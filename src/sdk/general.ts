/*
 * Code generated by Speakeasy (https://speakeasyapi.dev). DO NOT EDIT.
 */

import { SDKHooks } from "../hooks";
import { SDK_METADATA, SDKOptions, serverURLFromOptions } from "../lib/config";
import * as enc$ from "../lib/encodings";
import { HTTPClient } from "../lib/http";
import * as retries$ from "../lib/retries";
import * as schemas$ from "../lib/schemas";
import { ClientSDK, RequestOptions } from "../lib/sdks";
import * as errors from "./models/errors";
import * as operations from "./models/operations";
import { isBlobLike } from "./types";

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
     * Summary
     *
     * @remarks
     * Description
     */
    async partition(
        request: operations.PartitionRequest,
        options?: RequestOptions & { retries?: retries$.RetryConfig }
    ): Promise<operations.PartitionResponse> {
        const input$ = request;
        const headers$ = new Headers();
        headers$.set("user-agent", SDK_METADATA.userAgent);
        headers$.set("Accept", "application/json");

        const payload$ = schemas$.parse(
            input$,
            (value$) => operations.PartitionRequest$.outboundSchema.parse(value$),
            "Input validation failed"
        );
        const body$ = new FormData();

        if (isBlobLike(payload$.partition_parameters.files)) {
            body$.append("files", payload$.partition_parameters.files);
        } else {
            body$.append(
                "files",
                new Blob([payload$.partition_parameters.files.content], {
                    type: "application/octet-stream",
                }),
                payload$.partition_parameters.files.fileName
            );
        }
        if (payload$.partition_parameters.chunking_strategy !== undefined) {
            body$.append(
                "chunking_strategy",
                String(payload$.partition_parameters.chunking_strategy)
            );
        }
        if (payload$.partition_parameters.combine_under_n_chars !== undefined) {
            body$.append(
                "combine_under_n_chars",
                String(payload$.partition_parameters.combine_under_n_chars)
            );
        }
        if (payload$.partition_parameters.coordinates !== undefined) {
            body$.append("coordinates", String(payload$.partition_parameters.coordinates));
        }
        if (payload$.partition_parameters.encoding !== undefined) {
            body$.append("encoding", String(payload$.partition_parameters.encoding));
        }
        if (payload$.partition_parameters.extract_image_block_types !== undefined) {
            body$.append(
                "extract_image_block_types",
                String(payload$.partition_parameters.extract_image_block_types)
            );
        }
        if (payload$.partition_parameters.gz_uncompressed_content_type !== undefined) {
            body$.append(
                "gz_uncompressed_content_type",
                String(payload$.partition_parameters.gz_uncompressed_content_type)
            );
        }
        if (payload$.partition_parameters.hi_res_model_name !== undefined) {
            body$.append(
                "hi_res_model_name",
                String(payload$.partition_parameters.hi_res_model_name)
            );
        }
        if (payload$.partition_parameters.include_orig_elements !== undefined) {
            body$.append(
                "include_orig_elements",
                String(payload$.partition_parameters.include_orig_elements)
            );
        }
        if (payload$.partition_parameters.include_page_breaks !== undefined) {
            body$.append(
                "include_page_breaks",
                String(payload$.partition_parameters.include_page_breaks)
            );
        }
        if (payload$.partition_parameters.languages !== undefined) {
            body$.append("languages", String(payload$.partition_parameters.languages));
        }
        if (payload$.partition_parameters.max_characters !== undefined) {
            body$.append("max_characters", String(payload$.partition_parameters.max_characters));
        }
        if (payload$.partition_parameters.multipage_sections !== undefined) {
            body$.append(
                "multipage_sections",
                String(payload$.partition_parameters.multipage_sections)
            );
        }
        if (payload$.partition_parameters.new_after_n_chars !== undefined) {
            body$.append(
                "new_after_n_chars",
                String(payload$.partition_parameters.new_after_n_chars)
            );
        }
        if (payload$.partition_parameters.ocr_languages !== undefined) {
            body$.append("ocr_languages", String(payload$.partition_parameters.ocr_languages));
        }
        if (payload$.partition_parameters.output_format !== undefined) {
            body$.append("output_format", payload$.partition_parameters.output_format);
        }
        if (payload$.partition_parameters.overlap !== undefined) {
            body$.append("overlap", String(payload$.partition_parameters.overlap));
        }
        if (payload$.partition_parameters.overlap_all !== undefined) {
            body$.append("overlap_all", String(payload$.partition_parameters.overlap_all));
        }
        if (payload$.partition_parameters.pdf_infer_table_structure !== undefined) {
            body$.append(
                "pdf_infer_table_structure",
                String(payload$.partition_parameters.pdf_infer_table_structure)
            );
        }
        if (payload$.partition_parameters.similarity_threshold !== undefined) {
            body$.append(
                "similarity_threshold",
                String(payload$.partition_parameters.similarity_threshold)
            );
        }
        if (payload$.partition_parameters.skip_infer_table_types !== undefined) {
            body$.append(
                "skip_infer_table_types",
                String(payload$.partition_parameters.skip_infer_table_types)
            );
        }
        if (payload$.partition_parameters.split_pdf_page !== undefined) {
            body$.append("split_pdf_page", String(payload$.partition_parameters.split_pdf_page));
        }
        if (payload$.partition_parameters.split_pdf_threads !== undefined) {
            body$.append(
                "split_pdf_threads",
                String(payload$.partition_parameters.split_pdf_threads)
            );
        }
        if (payload$.partition_parameters.starting_page_number !== undefined) {
            body$.append(
                "starting_page_number",
                String(payload$.partition_parameters.starting_page_number)
            );
        }
        if (payload$.partition_parameters.strategy !== undefined) {
            body$.append("strategy", payload$.partition_parameters.strategy);
        }
        if (payload$.partition_parameters.unique_element_ids !== undefined) {
            body$.append(
                "unique_element_ids",
                String(payload$.partition_parameters.unique_element_ids)
            );
        }
        if (payload$.partition_parameters.xml_keep_tags !== undefined) {
            body$.append("xml_keep_tags", String(payload$.partition_parameters.xml_keep_tags));
        }

        const path$ = this.templateURLComponent("/general/v0/general")();

        const query$ = "";

        headers$.set(
            "unstructured-api-key",
            enc$.encodeSimple("unstructured-api-key", payload$["unstructured-api-key"], {
                explode: false,
                charEncoding: "none",
            })
        );

        const security$ =
            typeof this.options$.security === "function"
                ? await this.options$.security()
                : this.options$.security;

        const context = {
            operationID: "partition",
            oAuth2Scopes: [],
            securitySource: this.options$.security,
        };
        const securitySettings$ = this.resolveGlobalSecurity(security$);

        const doOptions = { context, errorCodes: ["422", "4XX", "5XX"] };
        const request$ = this.createRequest$(
            context,
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
                const cloned = request$.clone();
                return this.do$(cloned, doOptions);
            },
            { config: retryConfig, statusCodes: ["5xx"] }
        );

        const responseFields$ = {
            ContentType: response.headers.get("content-type") ?? "application/octet-stream",
            StatusCode: response.status,
            RawResponse: response,
            Headers: {},
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
            const responseBody = await response.text();
            throw new errors.SDKError(
                "Unexpected API response status or content-type",
                response,
                responseBody
            );
        }
    }
}
