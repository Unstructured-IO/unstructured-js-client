/*
 * Code generated by Speakeasy (https://speakeasyapi.dev). DO NOT EDIT.
 */

import * as z from "zod";

export type PartitionResponse = {
    /**
     * HTTP response content type for this operation
     */
    contentType: string;
    /**
     * Successful Response
     */
    elements?: Array<any> | undefined;
    /**
     * HTTP response status code for this operation
     */
    statusCode: number;
    /**
     * Raw HTTP response; suitable for custom response parsing
     */
    rawResponse: Response;
};

/** @internal */
export namespace PartitionResponse$ {
    export type Inbound = {
        ContentType: string;
        Elements?: Array<any> | undefined;
        StatusCode: number;
        RawResponse: Response;
    };

    export const inboundSchema: z.ZodType<PartitionResponse, z.ZodTypeDef, Inbound> = z
        .object({
            ContentType: z.string(),
            Elements: z.array(z.any()).optional(),
            StatusCode: z.number().int(),
            RawResponse: z.instanceof(Response),
        })
        .transform((v) => {
            return {
                contentType: v.ContentType,
                ...(v.Elements === undefined ? null : { elements: v.Elements }),
                statusCode: v.StatusCode,
                rawResponse: v.RawResponse,
            };
        });

    export type Outbound = {
        ContentType: string;
        Elements?: Array<any> | undefined;
        StatusCode: number;
        RawResponse: never;
    };

    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, PartitionResponse> = z
        .object({
            contentType: z.string(),
            elements: z.array(z.any()).optional(),
            statusCode: z.number().int(),
            rawResponse: z.instanceof(Response).transform(() => {
                throw new Error("Response cannot be serialized");
            }),
        })
        .transform((v) => {
            return {
                ContentType: v.contentType,
                ...(v.elements === undefined ? null : { Elements: v.elements }),
                StatusCode: v.statusCode,
                RawResponse: v.rawResponse,
            };
        });
}
