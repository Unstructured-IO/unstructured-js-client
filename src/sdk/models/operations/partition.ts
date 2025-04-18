/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../../lib/primitives.js";
import { safeParse } from "../../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";
import * as shared from "../shared/index.js";

export type PartitionRequest = {
  partitionParameters: shared.PartitionParameters;
  unstructuredApiKey?: string | null | undefined;
};

export type PartitionResponse = string | Array<{ [k: string]: any }>;

/** @internal */
export const PartitionRequest$inboundSchema: z.ZodType<
  PartitionRequest,
  z.ZodTypeDef,
  unknown
> = z.object({
  partition_parameters: shared.PartitionParameters$inboundSchema,
  "unstructured-api-key": z.nullable(z.string()).optional(),
}).transform((v) => {
  return remap$(v, {
    "partition_parameters": "partitionParameters",
    "unstructured-api-key": "unstructuredApiKey",
  });
});

/** @internal */
export type PartitionRequest$Outbound = {
  partition_parameters: shared.PartitionParameters$Outbound;
  "unstructured-api-key"?: string | null | undefined;
};

/** @internal */
export const PartitionRequest$outboundSchema: z.ZodType<
  PartitionRequest$Outbound,
  z.ZodTypeDef,
  PartitionRequest
> = z.object({
  partitionParameters: shared.PartitionParameters$outboundSchema,
  unstructuredApiKey: z.nullable(z.string()).optional(),
}).transform((v) => {
  return remap$(v, {
    partitionParameters: "partition_parameters",
    unstructuredApiKey: "unstructured-api-key",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace PartitionRequest$ {
  /** @deprecated use `PartitionRequest$inboundSchema` instead. */
  export const inboundSchema = PartitionRequest$inboundSchema;
  /** @deprecated use `PartitionRequest$outboundSchema` instead. */
  export const outboundSchema = PartitionRequest$outboundSchema;
  /** @deprecated use `PartitionRequest$Outbound` instead. */
  export type Outbound = PartitionRequest$Outbound;
}

export function partitionRequestToJSON(
  partitionRequest: PartitionRequest,
): string {
  return JSON.stringify(
    PartitionRequest$outboundSchema.parse(partitionRequest),
  );
}

export function partitionRequestFromJSON(
  jsonString: string,
): SafeParseResult<PartitionRequest, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => PartitionRequest$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'PartitionRequest' from JSON`,
  );
}

/** @internal */
export const PartitionResponse$inboundSchema: z.ZodType<
  PartitionResponse,
  z.ZodTypeDef,
  unknown
> = z.union([z.string(), z.array(z.record(z.any()))]);

/** @internal */
export type PartitionResponse$Outbound = string | Array<{ [k: string]: any }>;

/** @internal */
export const PartitionResponse$outboundSchema: z.ZodType<
  PartitionResponse$Outbound,
  z.ZodTypeDef,
  PartitionResponse
> = z.union([z.string(), z.array(z.record(z.any()))]);

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace PartitionResponse$ {
  /** @deprecated use `PartitionResponse$inboundSchema` instead. */
  export const inboundSchema = PartitionResponse$inboundSchema;
  /** @deprecated use `PartitionResponse$outboundSchema` instead. */
  export const outboundSchema = PartitionResponse$outboundSchema;
  /** @deprecated use `PartitionResponse$Outbound` instead. */
  export type Outbound = PartitionResponse$Outbound;
}

export function partitionResponseToJSON(
  partitionResponse: PartitionResponse,
): string {
  return JSON.stringify(
    PartitionResponse$outboundSchema.parse(partitionResponse),
  );
}

export function partitionResponseFromJSON(
  jsonString: string,
): SafeParseResult<PartitionResponse, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => PartitionResponse$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'PartitionResponse' from JSON`,
  );
}
