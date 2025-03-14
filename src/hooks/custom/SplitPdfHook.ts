import async from "async";

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
  HTTPClientExtension,
  generateGuid,
  MIN_PAGES_PER_THREAD,
  PARTITION_FORM_FILES_KEY,
  PARTITION_FORM_SPLIT_PDF_PAGE_KEY,
} from "./common.js";
import {retry, RetryConfig} from "../../lib/retries.js";

/**
 * Represents a hook for splitting and sending PDF files as per page requests.
 */
export class SplitPdfHook
  implements SDKInitHook, BeforeRequestHook, AfterSuccessHook, AfterErrorHook
{
  /**
   * The HTTP client used for making requests.
   */
  client: HTTPClientExtension | undefined;

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
    const { baseURL } = opts;
    this.client = new HTTPClientExtension();

    this.client.addHook("response", (res) => {
        if (res.status != 200) {
            console.error("Request failed with status code", `${res.status}`);
        }
    });

    return { baseURL: baseURL, client: this.client };
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

    // setting the current operationID to be unique
    const operationID = "partition-" + generateGuid();
    hookCtx.operationID = operationID;

    const requestClone = request.clone();
    const formData = await requestClone.formData();
    const splitPdfPage = stringToBoolean(
      (formData.get(PARTITION_FORM_SPLIT_PDF_PAGE_KEY) as string) ?? "false"
    );
    const file = formData.get(PARTITION_FORM_FILES_KEY) as File | null;

    if (!splitPdfPage) {
      return request;
    }

    if (!this.client) {
      console.warn("HTTP client not accessible! Partitioning without split.");
      return request;
    }

    const [error, pdf, totalPages] = await loadPdf(file);
    if (file === null || pdf === null || error) {
      return request;
    }

    const [pageRangeStart, pageRangeEnd] = getSplitPdfPageRange(formData, totalPages);
    const pagesCount = pageRangeEnd - pageRangeStart + 1;

    const startingPageNumber = getStartingPageNumber(formData);

    const concurrencyLevel = getSplitPdfConcurrencyLevel(formData);

    this.allowFailed = getSplitPdfAllowFailed(formData);

    const splitSize = await getOptimalSplitSize(pagesCount, concurrencyLevel);

    // If user wants a specific page range, we need to call splitPdf,
    // even if this page count is too small to be split normally
    const isPageRangeRequested = pagesCount < totalPages;

    // Otherwise, if there are not enough pages, return the original request without splitting
    if (!isPageRangeRequested) {
      if (splitSize >= pagesCount || pagesCount < MIN_PAGES_PER_THREAD) {
        return request;
      }
    }

    const splits = await splitPdf(pdf, splitSize, pageRangeStart, pageRangeEnd);

    const oneSecond = 1000;
    const oneMinute = 1000 * 60;
    const sixtyMinutes = oneMinute * 60;

    const headers = prepareRequestHeaders(request);

    const requests: Request[] = [];

    let setIndex = 1
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
        signal: AbortSignal.timeout(sixtyMinutes)
      });
      requests.push(req);
      setIndex+=1;
    }

    this.partitionSuccessfulResponses[operationID] = new Array(requests.length);
    this.partitionFailedResponses[operationID] = new Array(requests.length);

    const allowFailed = this.allowFailed;

    // These are the retry values from our api spec
    // We need to hardcode them here until we're able to reuse the SDK
    // from within this hook

    const allowedRetries = 3;
    const retryConfig = {
        strategy: "backoff",
        backoff: {
            initialInterval: oneSecond * 3,
            maxInterval: oneMinute * 12,
            exponent: 1.88,
            maxElapsedTime: sixtyMinutes,
        },
    } as RetryConfig;

    const retryCodes = ["502", "503", "504"];


    this.partitionRequests[operationID] = async.parallelLimit(
      requests.map((req, pageIndex) => async () => {
        const pageNumber = pageIndex + startingPageNumber;
        let retryCount = 0;
        try {
         const response = await retry(
              async () => {
                retryCount++;
                if (retryCount > allowedRetries) {
                  throw new Error(`Number of retries exceeded for page ${pageNumber}`);
                }
                return await this.client!.request(req.clone());
              },
              { config: retryConfig, statusCodes: retryCodes }
          );
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
          console.error(`Failed to send request for page ${pageNumber}.`, e);
          if (!allowFailed) {
            throw e;
          }
        }
      }),
      concurrencyLevel
    );

    return new Request("https://no-op/");
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
    let realResponse = response.clone();
    const firstSuccessfulResponse = successfulResponses.at(0);
    const isFakeResponse = response.headers.has("fake-response");
    if (firstSuccessfulResponse !== undefined && isFakeResponse) {
      realResponse = firstSuccessfulResponse.clone();
    }

    let responseBody, responseStatus, responseStatusText;
    const numFailedResponses = failedResponses?.length ?? 0;
    const headers = prepareResponseHeaders(realResponse);

    if (!this.allowFailed && failedResponses && failedResponses.length > 0) {
       const failedResponse = failedResponses[0]?.clone();
       if (failedResponse) {
            responseBody = await failedResponse.text();
            responseStatusText = failedResponse.statusText;
        } else {
            responseBody = JSON.stringify({"details:": "Unknown error"});
            responseStatusText = "Unknown error"
        }
        // if the response status is unknown or was 502, 503, 504, set back to 500 to ensure we don't cause more retries
        responseStatus = 500;
        console.warn(
            `${numFailedResponses} requests failed. The partition operation is cancelled.`
          );
      } else {
        if (isFakeResponse) {
          responseBody = await prepareResponseBody([...successfulResponses]);
        } else {
          responseBody = await prepareResponseBody([...successfulResponses, response]);
        }
        responseStatus = realResponse.status
        responseStatusText = realResponse.statusText
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
