import async from "async";

import { HTTPClient } from "../../lib/http";
import {
  AfterErrorContext,
  AfterErrorHook,
  AfterSuccessContext,
  AfterSuccessHook,
  type BeforeRequestContext,
  BeforeRequestHook,
  SDKInitHook,
  SDKInitOptions,
} from "../types";
import {
  getSplitPdfConcurrencyLevel,
  getStartingPageNumber,
  loadPdf,
  prepareRequestBody,
  prepareRequestHeaders,
  prepareResponseBody,
  prepareResponseHeaders,
  splitPdf,
  stringToBoolean,
} from "./utils";
import {
  MIN_PAGES_PER_THREAD,
  PARTITION_FORM_FILES_KEY,
  PARTITION_FORM_SPLIT_PDF_PAGE_KEY,
} from "./common";

/**
 * Represents a hook for splitting and sending PDF files as per page requests.
 */
export class SplitPdfHook
  implements SDKInitHook, BeforeRequestHook, AfterSuccessHook, AfterErrorHook
{
  /**
   * The HTTP client used for making requests.
   */
  client: HTTPClient | undefined;

  /**
   * Maps lists responses to client operation.
   */
  partitionResponses: Record<string, Response[]> = {};

  /**
   * Maps parallel requests to client operation.
   */
  partitionRequests: Record<string, Promise<unknown>> = {};

  /**
   * Initializes Split PDF Hook.
   * @param opts - The options for SDK initialization.
   * @returns The initialized SDK options.
   */
  sdkInit(opts: SDKInitOptions): SDKInitOptions {
    const { baseURL, client } = opts;
    this.client = client;
    return { baseURL: baseURL, client: client };
  }

  /**
   * If `splitPdfPage` is set to `true` in the request, the PDF file is split into
   * separate batches. Each batch is sent as a separate request in parallel. The last
   * batch request is returned by this method. It will return the original request
   * when: `splitPdfPage` is set to `false`, the file is not a PDF, or the HTTP
   * has not been initialized.
   *
   * @param hookCtx - The hook context containing information about the operation.
   * @param request - The request object.
   * @returns If `splitPdfPage` is set to `true`, the last batch request; otherwise,
   * the original request.
   */
  async beforeRequest(
    hookCtx: BeforeRequestContext,
    request: Request
  ): Promise<Request> {
    const { operationID } = hookCtx;
    const formData = await request.clone().formData();
    const splitPdfPage = stringToBoolean(
      (formData.get(PARTITION_FORM_SPLIT_PDF_PAGE_KEY) as string) ?? "false"
    );
    const file = formData.get(PARTITION_FORM_FILES_KEY) as File | null;
    const startingPageNumber = getStartingPageNumber(formData);

    if (!splitPdfPage) {
      return request;
    }

    if (!this.client) {
      console.warn("HTTP client not accessible! Continuing without splitting.");
      return request;
    }

    const [error, pdf, pagesCount] = await loadPdf(file);
    if (file === null || pdf === null || error) {
      return request;
    }

    if (pagesCount < MIN_PAGES_PER_THREAD) {
      console.warn(
        `PDF has less than ${MIN_PAGES_PER_THREAD} pages. Continuing without splitting.`
      );
      return request;
    }

    const concurrencyLevel = getSplitPdfConcurrencyLevel(formData);
    const splits = await splitPdf(pdf, concurrencyLevel);
    const headers = prepareRequestHeaders(request);

    const requestClone = request.clone();
    const requests: Request[] = [];

    for (const { content, startPage } of splits) {
      // Both startPage and startingPageNumber are 1-based, so we need to subtract 1
      const firstPageNumber = startPage + startingPageNumber - 1;
      const body = await prepareRequestBody(
        formData,
        content,
        file.name,
        firstPageNumber
      );
      const req = new Request(requestClone, {
        headers,
        body,
      });
      requests.push(req);
    }

    this.partitionResponses[operationID] = new Array(requests.length);

    this.partitionRequests[operationID] = async.parallelLimit(
      requests.slice(0, -1).map((req, pageIndex) => async () => {
        const pageNumber = pageIndex + startingPageNumber;
        try {
          const response = await this.client!.request(req);
          if (response.status === 200) {
            (this.partitionResponses[operationID] as Response[])[pageIndex] =
              response;
          }
        } catch (e) {
          console.error(`Failed to send request for page ${pageNumber}.`);
        }
      }),
      concurrencyLevel
    );

    return requests.at(-1) as Request;
  }

  /**
   * Executes after a successful API request. Awaits all parallel requests and combines
   * the responses into a single response object.
   * @param hookCtx - The context object containing information about the hook execution.
   * @param response - The response object returned from the API request.
   * @returns If requests were run in parallel, a combined response object; otherwise,
   * the original response.
   */
  async afterSuccess(
    hookCtx: AfterSuccessContext,
    response: Response
  ): Promise<Response> {
    const { operationID } = hookCtx;
    const responses = await this.awaitAllRequests(operationID);

    if (!responses) {
      return response;
    }

    const headers = prepareResponseHeaders(response);
    const body = await prepareResponseBody([...responses, response]);

    this.clearOperation(operationID);

    return new Response(body, {
      headers: headers,
      status: response.status,
      statusText: response.statusText,
    });
  }

  /**
   * Executes after an unsuccessful API request. Awaits all parallel requests, if at least one
   * request was successful, combines the responses into a single response object and doesn't
   * throw an error. It will return an error only if all requests failed, or there was no PDF split.
   * @param hookCtx - The AfterErrorContext object containing information about the hook context.
   * @param response - The Response object representing the response received before the error occurred.
   * @param error - The error object that was thrown.
   * @returns If requests were run in parallel, and at least one was successful, a combined response
   * object; otherwise, the original response and error.
   */
  async afterError(
    hookCtx: AfterErrorContext,
    response: Response | null,
    error: unknown
  ): Promise<{ response: Response | null; error: unknown }> {
    const { operationID } = hookCtx;
    const responses = await this.awaitAllRequests(operationID);

    if (!responses?.length) {
      this.clearOperation(operationID);
      return { response, error };
    }

    const okResponse = responses[0] as Response;
    const headers = prepareResponseHeaders(okResponse);
    const body = await prepareResponseBody(responses);

    const finalResponse = new Response(body, {
      headers: headers,
      status: okResponse.status,
      statusText: okResponse.statusText,
    });

    this.clearOperation(operationID);

    return { response: finalResponse, error: null };
  }

  /**
   * Clears the parallel requests and response data associated with the given
   * operation ID.
   *
   * @param operationID - The ID of the operation to clear.
   */
  clearOperation(operationID: string) {
    delete this.partitionResponses[operationID];
    delete this.partitionRequests[operationID];
  }

  /**
   * Awaits all parallel requests for a given operation ID and returns the
   * responses.
   * @param operationID - The ID of the operation.
   * @returns A promise that resolves to an array of responses, or undefined
   * if there are no requests for the given operation ID.
   */
  async awaitAllRequests(operationID: string): Promise<Response[] | undefined> {
    const requests = this.partitionRequests[operationID];

    if (!requests) {
      return;
    }

    await requests;

    return this.partitionResponses[operationID]?.filter((e) => e) ?? [];
  }
}
