/*
 * Code generated by Speakeasy (https://speakeasyapi.dev). DO NOT EDIT.
 */

import { never as znever } from "zod";
import { parse } from "./schemas.js";
import { isPlainObject } from "./is-plain-object.js";
import { SDKError } from "../sdk/models/errors/sdkerror.js";

export type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export type Awaitable<T> = T | Promise<T>;

const DEFAULT_FETCHER: Fetcher = (input, init) => {
    // If input is a Request and init is undefined, Bun will discard the method,
    // headers, body and other options that were set on the request object.
    // Node.js and browers would ignore an undefined init value. This check is
    // therefore needed for interop with Bun.
    if (init == null) {
        return fetch(input);
    } else {
        return fetch(input, init);
    }
};

export type RequestInput = {
    /**
     * The URL the request will use.
     */
    url: URL;
    /**
     * Options used to create a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request).
     */
    options?: RequestInit | undefined;
};

export interface HTTPClientOptions {
    fetcher?: Fetcher;
}

export type BeforeRequestHook = (req: Request) => Awaitable<Request | void>;
export type RequestErrorHook = (err: unknown, req: Request) => Awaitable<void>;
export type ResponseHook = (res: Response, req: Request) => Awaitable<void>;

export class HTTPClient {
    private fetcher: Fetcher;
    private requestHooks: BeforeRequestHook[] = [];
    private requestErrorHooks: RequestErrorHook[] = [];
    private responseHooks: ResponseHook[] = [];

    constructor(private options: HTTPClientOptions = {}) {
        this.fetcher = options.fetcher || DEFAULT_FETCHER;
    }

    async request(request: Request): Promise<Response> {
        let req = request;
        for (const hook of this.requestHooks) {
            const nextRequest = await hook(req);
            if (nextRequest) {
                req = nextRequest;
            }
        }

        try {
            const res = await this.fetcher(req);

            for (const hook of this.responseHooks) {
                await hook(res, req);
            }

            return res;
        } catch (err) {
            for (const hook of this.requestErrorHooks) {
                await hook(err, req);
            }

            throw err;
        }
    }

    /**
     * Registers a hook that is called before a request is made. The hook function
     * can mutate the request or return a new request. This may be useful to add
     * additional information to request such as request IDs and tracing headers.
     */
    addHook(hook: "beforeRequest", fn: BeforeRequestHook): this;
    /**
     * Registers a hook that is called when a request cannot be made due to a
     * network error.
     */
    addHook(hook: "requestError", fn: RequestErrorHook): this;
    /**
     * Registers a hook that is called when a response has been received from the
     * server.
     */
    addHook(hook: "response", fn: ResponseHook): this;
    addHook(
        ...args:
            | [hook: "beforeRequest", fn: BeforeRequestHook]
            | [hook: "requestError", fn: RequestErrorHook]
            | [hook: "response", fn: ResponseHook]
    ) {
        if (args[0] === "beforeRequest") {
            this.requestHooks.push(args[1]);
        } else if (args[0] === "requestError") {
            this.requestErrorHooks.push(args[1]);
        } else if (args[0] === "response") {
            this.responseHooks.push(args[1]);
        } else {
            throw new Error(`Invalid hook type: ${args[0]}`);
        }
        return this;
    }

    /** Removes a hook that was previously registered with `addHook`. */
    removeHook(hook: "beforeRequest", fn: BeforeRequestHook): this;
    /** Removes a hook that was previously registered with `addHook`. */
    removeHook(hook: "requestError", fn: RequestErrorHook): this;
    /** Removes a hook that was previously registered with `addHook`. */
    removeHook(hook: "response", fn: ResponseHook): this;
    removeHook(
        ...args:
            | [hook: "beforeRequest", fn: BeforeRequestHook]
            | [hook: "requestError", fn: RequestErrorHook]
            | [hook: "response", fn: ResponseHook]
    ): this {
        let target: unknown[];
        if (args[0] === "beforeRequest") {
            target = this.requestHooks;
        } else if (args[0] === "requestError") {
            target = this.requestErrorHooks;
        } else if (args[0] === "response") {
            target = this.responseHooks;
        } else {
            throw new Error(`Invalid hook type: ${args[0]}`);
        }

        const index = target.findIndex((v) => v === args[1]);
        if (index >= 0) {
            target.splice(index, 1);
        }

        return this;
    }

    clone(): HTTPClient {
        const child = new HTTPClient(this.options);
        child.requestHooks = this.requestHooks.slice();
        child.requestErrorHooks = this.requestErrorHooks.slice();
        child.responseHooks = this.responseHooks.slice();

        return child;
    }
}

export type StatusCodePredicate = number | string | (number | string)[];

// A semicolon surrounded by optional whitespace characters is used to separate
// segments in a media type string.
const mediaParamSeparator = /\s*;\s*/g;

function matchContentType(response: Response, pattern: string): boolean {
    // `*` is a special case which means anything is acceptable.
    if (pattern === "*") {
        return true;
    }

    let contentType = response.headers.get("content-type")?.trim() || "application/octet-stream";
    contentType = contentType.toLowerCase();

    const wantParts = pattern.toLowerCase().trim().split(mediaParamSeparator);
    const [wantType = "", ...wantParams] = wantParts;

    if (wantType.split("/").length !== 2) {
        return false;
    }

    const gotParts = contentType.split(mediaParamSeparator);
    const [gotType = "", ...gotParams] = gotParts;

    const [type = "", subtype = ""] = gotType.split("/");
    if (!type || !subtype) {
        return false;
    }

    if (
        wantType !== "*/*" &&
        gotType !== wantType &&
        `${type}/*` !== wantType &&
        `*/${subtype}` !== wantType
    ) {
        return false;
    }

    if (gotParams.length < wantParams.length) {
        return false;
    }

    const params = new Set(gotParams);
    for (const wantParam of wantParams) {
        if (!params.has(wantParam)) {
            return false;
        }
    }

    return true;
}

const codeRangeRE = new RegExp("^[0-9]xx$", "i");

export function matchStatusCode(response: Response, codes: StatusCodePredicate): boolean {
    const actual = `${response.status}`;
    const expectedCodes = Array.isArray(codes) ? codes : [codes];
    if (!expectedCodes.length) {
        return false;
    }

    return expectedCodes.some((ec) => {
        const code = `${ec}`;

        if (code === "default") {
            return true;
        }

        if (!codeRangeRE.test(`${code}`)) {
            return code === actual;
        }

        const expectFamily = code.charAt(0);
        if (!expectFamily) {
            throw new Error("Invalid status code range");
        }

        const actualFamily = actual.charAt(0);
        if (!actualFamily) {
            throw new Error(`Invalid response status code: ${actual}`);
        }

        return actualFamily === expectFamily;
    });
}

export function matchResponse(
    response: Response,
    code: StatusCodePredicate,
    contentTypePattern: string
): boolean {
    return matchStatusCode(response, code) && matchContentType(response, contentTypePattern);
}

const headerValRE = /, */;
export function unpackHeaders(headers: Headers): Record<string, string[]> {
    const out: Record<string, string[]> = {};

    for (const [k, v] of headers.entries()) {
        out[k] = v.split(headerValRE);
    }

    return out;
}

type ResponseMatcherSchema<T> =
    | { parse: (data: unknown) => T }
    | { inboundSchema: { parse: (data: unknown) => T } };

type SerializationMethod = "sse" | "json" | "rawBytes" | "rawStream" | "text" | "void" | "fail";

const defaultContentTypes: Record<SerializationMethod, string> = {
    sse: "text/event-stream",
    json: "application/json",
    rawBytes: "application/octet-stream",
    rawStream: "application/octet-stream",
    text: "text/plain",
    void: "",
    fail: "",
};

type ResponsePredicateMatch<Result> = {
    method: SerializationMethod;
    codes: StatusCodePredicate;
    ctype: string;
    schema: ResponseMatcherSchema<Result | Error>;
    hdrs: boolean;
    key: string | undefined;
    err: boolean;
    fail: boolean;
};

type ResponsePredicateOptions = {
    /** Content type to match on. */
    ctype?: string;
    /** Pass HTTP headers to deserializer. */
    hdrs?: boolean;
} & (
    | {
          /** The result key to store the deserialized value into. */
          key?: string;
          fail?: never;
          err?: never;
      }
    | {
          /** Indicates the matched response must throw the built-in error. */
          fail: true;
          key?: never;
          err?: never;
      }
    | {
          /** Indicates the matched response is a custom error. */
          err: true;
          key?: never;
          fail?: never;
      }
);

export class ResponseMatcher<Result> {
    private predicates: ResponsePredicateMatch<Result>[] = [];

    #any<T extends Result | Error>(
        method: SerializationMethod,
        codes: StatusCodePredicate,
        schema: ResponseMatcherSchema<T>,
        opts?: ResponsePredicateOptions
    ) {
        const ctype = opts?.ctype || defaultContentTypes[method];
        const hdrs = !!opts?.hdrs;
        const key = opts?.key;
        const err = !!opts?.err;
        const fail = !!opts?.fail;
        this.predicates.push({
            method,
            codes,
            ctype,
            schema,
            hdrs,
            key,
            err,
            fail,
        });
        return this;
    }

    json<T extends Result | Error>(
        codes: StatusCodePredicate,
        schema: ResponseMatcherSchema<T>,
        opts?: ResponsePredicateOptions
    ): this {
        return this.#any("json", codes, schema, opts);
    }
    bytes<T extends Result | Error>(
        codes: StatusCodePredicate,
        schema: ResponseMatcherSchema<T>,
        opts?: ResponsePredicateOptions
    ): this {
        return this.#any("rawBytes", codes, schema, opts);
    }
    stream<T extends Result | Error>(
        codes: StatusCodePredicate,
        schema: ResponseMatcherSchema<T>,
        opts?: ResponsePredicateOptions
    ): this {
        return this.#any("rawStream", codes, schema, opts);
    }
    text<T extends Result | Error>(
        codes: StatusCodePredicate,
        schema: ResponseMatcherSchema<T>,
        opts?: ResponsePredicateOptions
    ): this {
        return this.#any("text", codes, schema, opts);
    }
    sse<T extends Result | Error>(
        codes: StatusCodePredicate,
        schema: ResponseMatcherSchema<T>,
        opts?: Omit<ResponsePredicateOptions, "err" | "fail">
    ): this {
        return this.#any("sse", codes, schema, opts);
    }
    void<T extends Result | Error>(
        codes: StatusCodePredicate,
        schema: ResponseMatcherSchema<T>,
        opts?: Pick<ResponsePredicateOptions, "hdrs">
    ): this {
        return this.#any("void", codes, schema, opts);
    }
    fail(codes: StatusCodePredicate): this {
        return this.#any("fail", codes, znever(), { fail: true });
    }

    async match(
        response: Response,
        // envelope
        options?: {
            resultKey?: string;
            extraFields?: Record<string, unknown>;
        }
    ): Promise<[result: Result, rawData: unknown]> {
        let pred: ResponsePredicateMatch<Result> | undefined;
        for (const predicate of this.predicates) {
            const { codes, ctype } = predicate;
            if (ctype && matchResponse(response, codes, ctype)) {
                pred = predicate;
                break;
            } else if (!ctype && matchStatusCode(response, codes)) {
                pred = predicate;
                break;
            }
        }
        if (pred == null) {
            const responseBody = await response.text();
            throw new SDKError(
                "Unexpected API response status or content-type",
                response,
                responseBody
            );
        }

        const { method, schema } = pred;

        let raw: unknown;
        switch (method) {
            case "json":
                raw = await response.json();
                break;
            case "rawBytes":
                raw = await response.arrayBuffer();
                break;
            case "rawStream":
                raw = response.body;
                break;
            case "text":
                raw = await response.text();
                break;
            case "sse":
                raw = response.body;
                break;
            case "void":
                raw = await discardResponseBody(response);
                break;
            case "fail":
                raw = await response.text();
                break;
            default:
                method satisfies never;
                throw new Error(`Unsupported response type: ${method}`);
        }

        const resultKey = pred.key || options?.resultKey;
        let data: unknown;
        if (pred.fail) {
            throw new SDKError("API error occurred", response, typeof raw === "string" ? raw : "");
        } else if (pred.err) {
            data = {
                ...options?.extraFields,
                ...(pred.hdrs ? { Headers: unpackHeaders(response.headers) } : null),
                ...(isPlainObject(raw) ? raw : null),
            };
        } else if (resultKey) {
            data = {
                ...options?.extraFields,
                ...(pred.hdrs ? { Headers: unpackHeaders(response.headers) } : null),
                [resultKey]: raw,
            };
        } else {
            data = {
                ...options?.extraFields,
                ...(pred.hdrs ? { Headers: unpackHeaders(response.headers) } : null),
            };
        }

        const parser = "inboundSchema" in schema ? schema.inboundSchema : schema;
        const body = parse(data, (v: unknown) => parser.parse(v), "Response validation failed");

        if (body instanceof Error) {
            throw body;
        }

        return [body, raw];
    }
}

/**
 * Discards the response body to free up resources.
 *
 * To learn why this is need, see the undici docs:
 * https://undici.nodejs.org/#/?id=garbage-collection
 */
export async function discardResponseBody(res: Response) {
    const reader = res.body?.getReader();
    if (reader == null) {
        return;
    }

    try {
        let done = false;
        while (!done) {
            const res = await reader.read();
            done = res.done;
        }
    } finally {
        reader.releaseLock();
    }
}
