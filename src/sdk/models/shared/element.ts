/*
 * Code generated by Speakeasy (https://speakeasyapi.dev). DO NOT EDIT.
 */

import * as z from "zod";

export type Metadata = {};

export type Element = {
    elementId: string;
    metadata: Metadata;
    text: string;
    type: string;
};

/** @internal */
export namespace Metadata$ {
    export const inboundSchema: z.ZodType<Metadata, z.ZodTypeDef, unknown> = z.object({});

    export type Outbound = {};

    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, Metadata> = z.object({});
}

/** @internal */
export namespace Element$ {
    export const inboundSchema: z.ZodType<Element, z.ZodTypeDef, unknown> = z
        .object({
            element_id: z.string(),
            metadata: z.lazy(() => Metadata$.inboundSchema),
            text: z.string(),
            type: z.string(),
        })
        .transform((v) => {
            return {
                elementId: v.element_id,
                metadata: v.metadata,
                text: v.text,
                type: v.type,
            };
        });

    export type Outbound = {
        element_id: string;
        metadata: Metadata$.Outbound;
        text: string;
        type: string;
    };

    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, Element> = z
        .object({
            elementId: z.string(),
            metadata: z.lazy(() => Metadata$.outboundSchema),
            text: z.string(),
            type: z.string(),
        })
        .transform((v) => {
            return {
                element_id: v.elementId,
                metadata: v.metadata,
                text: v.text,
                type: v.type,
            };
        });
}
