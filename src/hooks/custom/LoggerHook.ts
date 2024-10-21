import { AfterErrorContext, AfterErrorHook, AfterSuccessContext, AfterSuccessHook } from "../types.js";

/**
 * Represents a hook that logs status and information that the request will be retried
 * after encountering a 5xx error.
 */
export class LoggerHook implements AfterSuccessHook, AfterErrorHook {
  private retriesCounter: Map<string, number> = new Map();

  /**
   * Log retries to give users visibility into requests.
   * @param response - The response object received from the server.
   * @param error - The error object representing the encountered error.
   * @param operationID - The unique identifier for the operation being logged.
   */
  private logRetries(
    response: Response | null,
    error: unknown,
    operationID: string
  ): void {
    if (response && response.status >= 500) {
      console.warn(
          "Failed to process a request due to API server error with status code %d. " +
          "Attempting retry number %d after sleep.",
          response.status,
          this.retriesCounter.get(operationID)
      );
      if (response.statusText) {
        console.warn("Server message - %s", response.statusText);
      }
    } else if (error) {
      console.info(
          `Failed to process a request due to connection error - ${(error as Error).message}. ` +
          `Attempting retry number ${this.retriesCounter.get(operationID)} after sleep.`
      );
    }
  }

  /**
   * Handles successful responses, resetting the retry counter for the operation.
   * Logs a success message indicating that the document was successfully partitioned.
   * @param hookCtx - The context object containing information about the request.
   * @param response - The response object received from the server.
   * @returns The response object.
   */
  afterSuccess(hookCtx: AfterSuccessContext, response: Response): Response {
    this.retriesCounter.delete(hookCtx.operationID);
    // NOTE: In case of split page partition this means - at least one of the splits was partitioned successfully
    return response;
  }

  /**
   * Executes after an error occurs during a request.
   * @param hookCtx - The context object containing information about the request.
   * @param response - The response object received from the server.
   * @param error - The error object representing the encountered error.
   * @returns An object containing the updated response and error.
   */
  afterError(
    hookCtx: AfterErrorContext,
    response: Response | null,
    error: unknown
  ): { response: Response | null; error: unknown } {
    const currentCount = this.retriesCounter.get(hookCtx.operationID) || 0;
    this.retriesCounter.set(hookCtx.operationID, currentCount + 1);
    this.logRetries(response, error, hookCtx.operationID);

    if (response && response.status === 200) {
      return { response, error };
    }
    console.error("Failed to partition the document.");
    if (response) {
      console.error(`Server responded with ${response.status} - ${response.statusText}`);
    }
    if (error) {
      console.error(`Following error occurred - ${(error as Error).message}`);
    }
    return { response, error };
  }
}
