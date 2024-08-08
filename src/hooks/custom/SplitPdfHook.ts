import async from "async";

import { HTTPClient } from "../../lib/http.js";
import {
  AfterErrorContext,
  AfterErrorHook,
  AfterSuccessContext,
  AfterSuccessHook,
  type BeforeRequestContext,
  BeforeRequestHook,
  SDKInitHook,
  SDKInitOptions,
} from "../types.js";
import {
  getOptimalSplitSize, getSplitPdfAllowFailed,
  getSplitPdfConcurrencyLevel,
  getStartingPageNumber,
  getSplitPdfPageRange,
  loadPdf,
  prepareRequestBody,
  prepareRequestHeaders,
  prepareResponseBody,
  prepareResponseHeaders,
  splitPdf,
  stringToBoolean,
} from "./utils/index.js";
import {
  MIN_PAGES_PER_THREAD,
  PARTITION_FORM_FILES_KEY,
  PARTITION_FORM_SPLIT_PDF_PAGE_KEY,
} from "./common.js";

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
   * Keeps the strict-mode setting for splitPdfPage feature.
   */
  allowFailed: boolean | undefined;

  /**
   * Maps lists responses to client operation.
   */
  partitionSuccessfulResponses: Record<string, Response[]> = {};

  /**
   * Maps lists failed responses to client operation.
   */
  partitionFailedResponses: Record<string, Response[]> = {};

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
    const requestClone = request.clone();
    const formData = await requestClone.formData();
    const splitPdfPage = stringToBoolean(
      (formData.get(PARTITION_FORM_SPLIT_PDF_PAGE_KEY) as string) ?? "false"
    );
    const file = formData.get(PARTITION_FORM_FILES_KEY) as File | null;

    if (!splitPdfPage) {
      console.info("Partitioning without split.")
      return request;
    }

    console.info("Preparing to split document for partition.")
    if (!this.client) {
      console.warn("HTTP client not accessible! Partitioning without split.");
      return request;
    }

    const [error, pdf, totalPages] = await loadPdf(file);
    if (file === null || pdf === null || error) {
      console.info("Partitioning without split.")
      return request;
    }

    const [pageRangeStart, pageRangeEnd] = getSplitPdfPageRange(formData, totalPages);
    const pagesCount = pageRangeEnd - pageRangeStart + 1;

    const startingPageNumber = getStartingPageNumber(formData);
    console.info("Starting page number set to %d", startingPageNumber);

    const concurrencyLevel = getSplitPdfConcurrencyLevel(formData);
    console.info("Concurrency level set to %d", concurrencyLevel)

    this.allowFailed = getSplitPdfAllowFailed(formData);
    console.info("Allow failed set to %s", this.allowFailed)

    const splitSize = await getOptimalSplitSize(pagesCount, concurrencyLevel);
    console.info("Determined optimal split size of %d pages.", splitSize)

    // If user wants a specific page range, we need to call splitPdf,
    // even if this page count is too small to be split normally
    const isPageRangeRequested = pagesCount < totalPages;

    // Otherwise, if there are not enough pages, return the original request without splitting
    if (!isPageRangeRequested) {
      if (splitSize >= pagesCount || pagesCount < MIN_PAGES_PER_THREAD) {
        console.info(
          "Document has too few pages (%d) to be split efficiently. Partitioning without split.",
          pagesCount,
        )
        return request;
      }
    }

    const splits = await splitPdf(pdf, splitSize, pageRangeStart, pageRangeEnd);
    const numberOfSplits = splits.length
    console.info(
        "Document split into %d, %d-paged sets.",
        numberOfSplits,
        splitSize,
    )
    console.info(
        "Partitioning %d, %d-paged sets.",
        numberOfSplits,
        splitSize,
    )

    const headers = prepareRequestHeaders(request);

    const requests: Request[] = [];

    let setIndex = 1
    for (const { content, startPage } of splits) {
      // Both startPage and startingPageNumber are 1-based, so we need to subtract 1
      const firstPageNumber = startPage + startingPageNumber - 1;
      console.info(
          "Partitioning set #%d (pages %d-%d).",
          setIndex,
          firstPageNumber,
          Math.min(firstPageNumber + splitSize - 1, pagesCount),
      );

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
      setIndex+=1;
    }

    this.partitionSuccessfulResponses[operationID] = new Array(requests.length);

    const allowFailed = this.allowFailed;

    this.partitionRequests[operationID] = async.parallelLimit(
      requests.slice(0, -1).map((req, pageIndex) => async () => {
        const pageNumber = pageIndex + startingPageNumber;
        try {
          const response = await this.client!.request(req);
          if (response.status === 200) {
            (this.partitionSuccessfulResponses[operationID] as Response[])[pageIndex] =
              response.clone();
          } else {
            (this.partitionFailedResponses[operationID] as Response[])[pageIndex] =
              response.clone();
              if (!allowFailed) {
                throw new Error(`Failed to send request for page ${pageNumber}.`);
              }
          }
        } catch (e) {
          console.error(`Failed to send request for page ${pageNumber}.`);
          if (!allowFailed) {
            throw e;
          }
        }
      }),
      concurrencyLevel
    );

    return requests.at(-1) as Request;
  }

    /**
     * Forms the final response object based on the successful and failed responses.
     * @param response - The response object returned from the API request.
     *   Expected to be a successful response.
     * @param successfulResponses - The list of successful responses.
     * @param failedResponses - The list of failed responses.
     * @returns The final response object.
     */
  async formFinalResponse(response: Response,
                    successfulResponses: Response[],
                    failedResponses: Response[]
  ): Promise<Response>  {
    let responseBody, responseStatus, responseStatusText;
    const numFailedResponses = failedResponses?.length ?? 0;
    const headers = prepareResponseHeaders(response);

    if (!this.allowFailed && failedResponses && failedResponses.length > 0) {
       const failedResponse = failedResponses[0]?.clone();
       if (failedResponse) {
            responseBody = await failedResponse.text();
            responseStatus = failedResponse.status;
            responseStatusText = failedResponse.statusText;
        } else {
            responseBody = JSON.stringify({"details:": "Unknown error"});
            responseStatus = 503
            responseStatusText = "Unknown error"
        }
        console.warn(
            `${numFailedResponses} requests failed. The partition operation is cancelled.`
          );
      } else {
        responseBody = await prepareResponseBody([...successfulResponses, response]);
        responseStatus = response.status
        responseStatusText = response.statusText
        if (numFailedResponses > 0) {
          console.warn(
            `${numFailedResponses} requests failed. The results might miss some pages.`
          );
          }
    }
    return new Response(responseBody, {
        headers: headers,
        status: responseStatus,
        statusText: responseStatusText,
      });

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
    const successfulResponses = responses?.get("success") ?? [];
    const failedResponses = responses?.get("failed") ?? [];
    if (!successfulResponses) {
      return response;
    }

    const finalResponse = await this.formFinalResponse(response, successfulResponses, failedResponses);

    this.clearOperation(operationID);

    return finalResponse;
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
    const successfulResponses = responses?.get("success") ?? [];
    const failedResponses = responses?.get("failed") ?? [];
    if (!successfulResponses?.length) {
      this.clearOperation(operationID);
      return { response, error };
    }

    const okResponse = successfulResponses[0] as Response;
    const finalResponse = await this.formFinalResponse(
        okResponse,
        successfulResponses.slice(1),
        failedResponses
    );

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
    delete this.partitionSuccessfulResponses[operationID];
    delete this.partitionFailedResponses[operationID];
    delete this.partitionRequests[operationID];
  }

  /**
   * Awaits all parallel requests for a given operation ID and returns the
   * responses.
   * @param operationID - The ID of the operation.
   * @returns A promise that resolves to an array of responses, or undefined
   * if there are no requests for the given operation ID.
   */
  async awaitAllRequests(operationID: string): Promise<Map<string, Response[]>> {
    const requests = this.partitionRequests[operationID];
    const responseMap = new Map<string, Response[]>();

    if (!requests) {
      return responseMap;
    }
    await requests;

    responseMap.set("success", this.partitionSuccessfulResponses[operationID]?.filter((e) => e) ?? []);
    responseMap.set("failed", this.partitionFailedResponses[operationID]?.filter((e) => e) ?? []);
    return responseMap
  }
}
