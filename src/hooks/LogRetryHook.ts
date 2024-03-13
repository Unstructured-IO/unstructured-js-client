import { AfterErrorContext, AfterErrorHook } from "./types";

export class LogRetryHook implements AfterErrorHook {
  afterError(
    _: AfterErrorContext,
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
