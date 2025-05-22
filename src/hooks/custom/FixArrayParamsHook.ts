
import {
  type BeforeRequestContext,
  BeforeRequestHook,
} from "../types.js";
import { prepareRequestHeaders } from "./utils/request.js";

/**
 * If the given key in FormData is present and contains a comma-separated list of values,
 * split the values into separate entries with the key suffixed by "[]".
 *
 * @param formData - The FormData object to modify.
 * @param key - The key to extract and split.
 */
function flattenArrayParameter(formData: FormData, key: string): void {
  const value = formData.get(key);
  if (formData && typeof value === "string" && value.includes(",")) {
    formData.delete(key);
    const values = value.split(",").map(v => v.trim()).filter(Boolean);
    for (const v of values) {
      formData.append(`${key}[]`, v);
    }
  }
}
/**
 * Represents a hook for fixing array parameters before sending a request.
 */
export class FixArrayParamsHook implements BeforeRequestHook {
  /**
   * Fixes specific array parameters in the request.
   * The SDK creates FormData with {extract_image_block_types: "a,b,c"},
   * and the server expects it to be {extract_image_block_types[]: ["a", "b", "c"]}.
   * Speakeasy will fix this upstream soon.
   *
   * @param _hookCtx - The context object for the hook, containing metadata about the request.
   * @param request - The original Request object.
   * @returns A new Request object with modified form data and headers.
   */
  async beforeRequest(
    _hookCtx: BeforeRequestContext,
    request: Request
  ): Promise<Request> {
    const requestClone = request.clone();
    const formData = await requestClone.formData();

    flattenArrayParameter(formData, "extract_image_block_types");

    const headers = prepareRequestHeaders(requestClone);

    return new Request(requestClone, {
      body: formData,
      headers: headers,
    });
  }
}
