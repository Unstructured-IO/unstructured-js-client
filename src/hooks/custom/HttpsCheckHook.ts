import { SDKInitHook, SDKInitOptions } from "../types";

/**
 * Regular expression pattern for matching base hostnames in the form of "*.unstructuredapp.io".
 */
const BASE_HOSTNAME_REGEX = /^.*\.unstructuredapp\.io$/;

/**
 * The base protocol used for HTTPS requests.
 */
const BASE_PROTOCOL = "https:";

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

    if (
      baseURL &&
      BASE_HOSTNAME_REGEX.test(baseURL.hostname) &&
      baseURL.protocol !== BASE_PROTOCOL
    ) {
      const newBaseURL = baseURL.href.replace(baseURL.protocol, BASE_PROTOCOL);
      return { baseURL: new URL(newBaseURL), client: client };
    }

    return { baseURL: baseURL, client: client };
  }
}
