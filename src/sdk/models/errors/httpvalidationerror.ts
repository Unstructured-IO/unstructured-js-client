/*
 * Code generated by Speakeasy (https://speakeasyapi.dev). DO NOT EDIT.
 */

import * as components from "../../../sdk/models/components";
import * as z from "zod";

export type HTTPValidationErrorData = {
    detail?: Array<components.ValidationError> | undefined;
};

export class HTTPValidationError extends Error {
    detail?: Array<components.ValidationError> | undefined;

    /** The original data that was passed to this error instance. */
    data$: HTTPValidationErrorData;

    constructor(err: HTTPValidationErrorData) {
        super("");
        this.data$ = err;

        if (err.detail != null) {
            this.detail = err.detail;
        }

        this.message =
            "message" in err && typeof err.message === "string"
                ? err.message
                : "API error occurred";

        this.name = "HTTPValidationError";
    }
}

/** @internal */
export namespace HTTPValidationError$ {
    export type Inbound = {
        detail?: Array<components.ValidationError$.Inbound> | undefined;
    };

    export const inboundSchema: z.ZodType<HTTPValidationError, z.ZodTypeDef, Inbound> = z
        .object({
            detail: z.array(components.ValidationError$.inboundSchema).optional(),
        })
        .transform((v) => {
            return new HTTPValidationError({
                ...(v.detail === undefined ? null : { detail: v.detail }),
            });
        });
    export type Outbound = {
        detail?: Array<components.ValidationError$.Outbound> | undefined;
    };

    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, HTTPValidationError> = z
        .instanceof(HTTPValidationError)
        .transform((v) => v.data$)
        .pipe(
            z
                .object({
                    detail: z.array(components.ValidationError$.outboundSchema).optional(),
                })
                .transform((v) => {
                    return {
                        ...(v.detail === undefined ? null : { detail: v.detail }),
                    };
                })
        );
}
