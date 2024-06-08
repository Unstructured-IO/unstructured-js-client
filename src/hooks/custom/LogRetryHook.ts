import { AfterErrorContext, AfterErrorHook } from "../types";

/**
 * Represents a hook that logs status and information that the request will be retried
 * after encountering a 5xx error.
 */
export class LogRetryHook implements AfterErrorHook {
  private retriesCounter: Map<string, number> = new Map();

  /**
   * Log retries to give users visibility into requests.
   * @param response - The response object received from the server.
   * @param operationID - The unique identifier for the operation being logged.
   */
  private logRetries(response: Response | null, operationID: string): void {
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
    }
  }

  /**
   * Executes after an error occurs during a request.
   * @param _context - The context object containing information about the request.
   * @param response - The response object received from the server.
   * @param error - The error object representing the encountered error.
   * @returns An object containing the updated response and error.
   */
  afterError(
    _context: AfterErrorContext,
    response: Response | null,
    error: unknown
  ): { response: Response | null; error: unknown } {
    const currentCount = this.retriesCounter.get(_context.operationID) || 0;
    this.retriesCounter.set(_context.operationID, currentCount + 1);
    this.logRetries(response, _context.operationID);
    return { response, error };
  }
}
