import { AfterErrorContext, AfterErrorHook } from "./types";

/**
 * Represents a hook that logs status and information that the request will be retried
 * after encountering a 5xx error.
 */
export class LogRetryHook implements AfterErrorHook {
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
    if (response && response.status >= 500) {
      console.warn(
        `Got an error: '${response.status} ${response.statusText}'. Retrying request!`
      );
    }
    return { response, error };
  }
}
