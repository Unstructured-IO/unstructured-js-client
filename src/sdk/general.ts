/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { generalPartition } from "../funcs/generalPartition.js";
import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as operations from "./models/operations/index.js";
import { unwrapAsync } from "./types/fp.js";

export class General extends ClientSDK {
  /**
   * Summary
   *
   * @remarks
   * Description
   */
  async partition(
    request: operations.PartitionRequest,
    options?: RequestOptions,
  ): Promise<operations.PartitionResponse> {
    return unwrapAsync(generalPartition(
      this,
      request,
      options,
    ));
  }
}
