/*
 * Code generated by Speakeasy (https://speakeasyapi.dev). DO NOT EDIT.
 */

import { SDKHooks } from "../hooks";
import { SDK_METADATA, SDKOptions, serverURLFromOptions } from "../lib/config";
import { HTTPClient } from "../lib/http";
import * as retries$ from "../lib/retries";
import * as schemas$ from "../lib/schemas";
import { ClientSDK, RequestOptions } from "../lib/sdks";
import * as components from "../sdk/models/components";
import * as errors from "../sdk/models/errors";
import * as operations from "../sdk/models/operations";
import { isBlobLike } from "../types";

export class General extends ClientSDK {
    private readonly options$: SDKOptions & { hooks?: SDKHooks };

    constructor(options: SDKOptions = {}) {
        const opt = options as unknown;
        let hooks: SDKHooks;
        if (
            typeof opt === "object" &&
            opt != null &&
            "hooks" in opt &&
            opt.hooks instanceof SDKHooks
        ) {
            hooks = opt.hooks;
        } else {
            hooks = new SDKHooks();
        }

        super({
            client: options.httpClient || new HTTPClient(),
            baseURL: serverURLFromOptions(options),
            hooks,
        });

        this.options$ = { ...options, hooks };
        void this.options$;
    }

    /**
     * Pipeline 1
     */
    async partition(
        input: components.PartitionParameters | undefined,
        options?: RequestOptions & { retries?: retries$.RetryConfig }
    ): Promise<operations.PartitionResponse> {
        const headers$ = new Headers();
        headers$.set("user-agent", SDK_METADATA.userAgent);
        headers$.set("Accept", "application/json");

        const payload$ = schemas$.parse(
            input,
            (value$) => components.PartitionParameters$.outboundSchema.optional().parse(value$),
            "Input validation failed"
        );
        const body$ = new FormData();
        if (payload$ != null) {
            if (payload$?.chunking_strategy !== undefined) {
                body$.append("chunking_strategy", payload$?.chunking_strategy);
            }
            if (payload$?.combine_under_n_chars !== undefined) {
                body$.append("combine_under_n_chars", String(payload$?.combine_under_n_chars));
            }
            if (payload$?.coordinates !== undefined) {
                body$.append("coordinates", String(payload$?.coordinates));
            }
            if (payload$?.encoding !== undefined) {
                body$.append("encoding", payload$?.encoding);
            }
            if (payload$?.extract_image_block_types !== undefined) {
                body$.append(
                    "extract_image_block_types",
                    String(payload$?.extract_image_block_types)
                );
            }
            if (payload$?.files !== undefined) {
                if (isBlobLike(payload$?.files)) {
                    body$.append("files", payload$?.files);
                } else {
                    body$.append(
                        "files",
                        new Blob([payload$?.files.content], { type: "application/octet-stream" }),
                        payload$?.files.fileName
                    );
                }
            }
            if (payload$?.gz_uncompressed_content_type !== undefined) {
                body$.append(
                    "gz_uncompressed_content_type",
                    payload$?.gz_uncompressed_content_type
                );
            }
            if (payload$?.hi_res_model_name !== undefined) {
                body$.append("hi_res_model_name", payload$?.hi_res_model_name);
            }
            if (payload$?.include_page_breaks !== undefined) {
                body$.append("include_page_breaks", String(payload$?.include_page_breaks));
            }
            if (payload$?.languages !== undefined) {
                body$.append("languages", String(payload$?.languages));
            }
            if (payload$?.max_characters !== undefined) {
                body$.append("max_characters", String(payload$?.max_characters));
            }
            if (payload$?.multipage_sections !== undefined) {
                body$.append("multipage_sections", String(payload$?.multipage_sections));
            }
            if (payload$?.new_after_n_chars !== undefined) {
                body$.append("new_after_n_chars", String(payload$?.new_after_n_chars));
            }
            if (payload$?.output_format !== undefined) {
                body$.append("output_format", payload$?.output_format);
            }
            if (payload$?.overlap !== undefined) {
                body$.append("overlap", String(payload$?.overlap));
            }
            if (payload$?.overlap_all !== undefined) {
                body$.append("overlap_all", String(payload$?.overlap_all));
            }
            if (payload$?.pdf_infer_table_structure !== undefined) {
                body$.append(
                    "pdf_infer_table_structure",
                    String(payload$?.pdf_infer_table_structure)
                );
            }
            if (payload$?.skip_infer_table_types !== undefined) {
                body$.append("skip_infer_table_types", String(payload$?.skip_infer_table_types));
            }
            if (payload$?.strategy !== undefined) {
                body$.append("strategy", payload$?.strategy);
            }
            if (payload$?.xml_keep_tags !== undefined) {
                body$.append("xml_keep_tags", String(payload$?.xml_keep_tags));
            }
        }

        const path$ = this.templateURLComponent("/general/v0/general")();

        const query$ = "";

        let security$;
        if (typeof this.options$.apiKeyAuth === "function") {
            security$ = { apiKeyAuth: await this.options$.apiKeyAuth() };
        } else if (this.options$.apiKeyAuth) {
            security$ = { apiKeyAuth: this.options$.apiKeyAuth };
        } else {
            security$ = {};
        }
        const context = {
            operationID: "partition",
            oAuth2Scopes: [],
            securitySource: this.options$.apiKeyAuth,
        };
        const securitySettings$ = this.resolveGlobalSecurity(security$);

        const doOptions = { context, errorCodes: ["422", "4XX", "5XX"] };
        const request = this.createRequest$(
            {
                security: securitySettings$,
                method: "POST",
                path: path$,
                headers: headers$,
                query: query$,
                body: body$,
            },
            options
        );

        const retryConfig = options?.retries ||
            this.options$.retryConfig || {
                strategy: "backoff",
                backoff: {
                    initialInterval: 500,
                    maxInterval: 60000,
                    exponent: 1.5,
                    maxElapsedTime: 900000,
                },
                retryConnectionErrors: true,
            };

        const response = await retries$.retry(
            () => {
                const cloned = request.clone();
                return this.do$(cloned, doOptions);
            },
            { config: retryConfig, statusCodes: ["5xx"] }
        );

        const responseFields$ = {
            HttpMeta: {
                Response: response,
                Request: request,
            },
        };

        if (this.matchResponse(response, 200, "application/json")) {
            const responseBody = await response.json();
            const result = schemas$.parse(
                responseBody,
                (val$) => {
                    return operations.PartitionResponse$.inboundSchema.parse({
                        ...responseFields$,
                        Elements: val$,
                    });
                },
                "Response validation failed"
            );
            return result;
        } else if (this.matchResponse(response, 422, "application/json")) {
            const responseBody = await response.json();
            const result = schemas$.parse(
                responseBody,
                (val$) => {
                    return errors.HTTPValidationError$.inboundSchema.parse({
                        ...responseFields$,
                        ...val$,
                    });
                },
                "Response validation failed"
            );
            throw result;
        } else {
            throw new errors.SDKError("Unexpected API response", { response, request });
        }
    }
}
