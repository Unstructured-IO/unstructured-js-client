/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";

export type ServerErrorData = {
  detail?: string | undefined;
};

export class ServerError extends Error {
  detail?: string | undefined;

  /** The original data that was passed to this error instance. */
  data$: ServerErrorData;

  constructor(err: ServerErrorData) {
    const message = "message" in err && typeof err.message === "string"
      ? err.message
      : `API error occurred: ${JSON.stringify(err)}`;
    super(message);
    this.data$ = err;

    if (err.detail != null) this.detail = err.detail;

    this.name = "ServerError";
  }
}

/** @internal */
export const ServerError$inboundSchema: z.ZodType<
  ServerError,
  z.ZodTypeDef,
  unknown
> = z.object({
  detail: z.string().optional(),
})
  .transform((v) => {
    return new ServerError(v);
  });

/** @internal */
export type ServerError$Outbound = {
  detail?: string | undefined;
};

/** @internal */
export const ServerError$outboundSchema: z.ZodType<
  ServerError$Outbound,
  z.ZodTypeDef,
  ServerError
> = z.instanceof(ServerError)
  .transform(v => v.data$)
  .pipe(z.object({
    detail: z.string().optional(),
  }));

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace ServerError$ {
  /** @deprecated use `ServerError$inboundSchema` instead. */
  export const inboundSchema = ServerError$inboundSchema;
  /** @deprecated use `ServerError$outboundSchema` instead. */
  export const outboundSchema = ServerError$outboundSchema;
  /** @deprecated use `ServerError$Outbound` instead. */
  export type Outbound = ServerError$Outbound;
}
