import { BASE_HOSTNAME_REGEX, BASE_PROTOCOL } from "./common.js";
import { SDKInitHook, SDKInitOptions } from "../types.js";

/**
 * Represents a hook that performs base host HTTPS check during SDK initialization.
 */
export class HttpsCheckHook implements SDKInitHook {
  /**
   * Performs the base host HTTPS check during SDK initialization. If hostname
   * matches "*.unstructuredapp.io" and the protocol is not "https:", the protocol
   * is updated to "https:".
   * @param opts - The SDK initialization options.
   * @returns The updated SDK initialization options.
   */
  sdkInit(opts: SDKInitOptions): SDKInitOptions {
    const { baseURL, client } = opts;

    if (baseURL) {
      // -- pathname should always be empty
      baseURL.pathname = "/";

      if (BASE_HOSTNAME_REGEX.test(baseURL.hostname) && baseURL.protocol !== BASE_PROTOCOL) {
        console.warn("Base URL protocol is not HTTPS. Updating to HTTPS.");
        const newBaseURL = baseURL.href.replace(baseURL.protocol, BASE_PROTOCOL);
        return {baseURL: new URL(newBaseURL), client: client};
      }
    }

    return { baseURL: baseURL, client: client };
  }
}
