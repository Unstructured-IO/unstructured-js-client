/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { UnstructuredClientCore } from "../core.js";
import { appendForm, encodeSimple } from "../lib/encodings.js";
import { readableStreamToArrayBuffer } from "../lib/files.js";
import * as M from "../lib/matchers.js";
import { compactMap } from "../lib/primitives.js";
import { safeParse } from "../lib/schemas.js";
import { RequestOptions } from "../lib/sdks.js";
import { extractSecurity, resolveGlobalSecurity } from "../lib/security.js";
import { pathToFunc } from "../lib/url.js";
import {
  ConnectionError,
  InvalidRequestError,
  RequestAbortedError,
  RequestTimeoutError,
  UnexpectedClientError,
} from "../sdk/models/errors/httpclienterrors.js";
import * as errors from "../sdk/models/errors/index.js";
import { SDKError } from "../sdk/models/errors/sdkerror.js";
import { SDKValidationError } from "../sdk/models/errors/sdkvalidationerror.js";
import * as operations from "../sdk/models/operations/index.js";
import { APICall, APIPromise } from "../sdk/types/async.js";
import { isBlobLike } from "../sdk/types/blobs.js";
import { Result } from "../sdk/types/fp.js";
import { isReadableStream } from "../sdk/types/streams.js";

export enum PartitionAcceptEnum {
  applicationJson = "application/json",
  textCsv = "text/csv",
}

/**
 * Summary
 *
 * @remarks
 * Description
 */
export function generalPartition(
  client: UnstructuredClientCore,
  request: operations.PartitionRequest,
  options?: RequestOptions & { acceptHeaderOverride?: PartitionAcceptEnum },
): APIPromise<
  Result<
    operations.PartitionResponse,
    | errors.HTTPValidationError
    | errors.ServerError
    | SDKError
    | SDKValidationError
    | UnexpectedClientError
    | InvalidRequestError
    | RequestAbortedError
    | RequestTimeoutError
    | ConnectionError
  >
> {
  return new APIPromise($do(
    client,
    request,
    options,
  ));
}

async function $do(
  client: UnstructuredClientCore,
  request: operations.PartitionRequest,
  options?: RequestOptions & { acceptHeaderOverride?: PartitionAcceptEnum },
): Promise<
  [
    Result<
      operations.PartitionResponse,
      | errors.HTTPValidationError
      | errors.ServerError
      | SDKError
      | SDKValidationError
      | UnexpectedClientError
      | InvalidRequestError
      | RequestAbortedError
      | RequestTimeoutError
      | ConnectionError
    >,
    APICall,
  ]
> {
  const parsed = safeParse(
    request,
    (value) => operations.PartitionRequest$outboundSchema.parse(value),
    "Input validation failed",
  );
  if (!parsed.ok) {
    return [parsed, { status: "invalid" }];
  }
  const payload = parsed.value;
  const body = new FormData();

  if (isBlobLike(payload.partition_parameters.files)) {
    appendForm(body, "files", payload.partition_parameters.files);
  } else if (isReadableStream(payload.partition_parameters.files.content)) {
    const buffer = await readableStreamToArrayBuffer(
      payload.partition_parameters.files.content,
    );
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    appendForm(body, "files", blob);
  } else {
    appendForm(
      body,
      "files",
      new Blob([payload.partition_parameters.files.content], {
        type: "application/octet-stream",
      }),
      payload.partition_parameters.files.fileName,
    );
  }
  if (payload.partition_parameters.chunking_strategy !== undefined) {
    appendForm(
      body,
      "chunking_strategy",
      payload.partition_parameters.chunking_strategy,
    );
  }
  if (payload.partition_parameters.combine_under_n_chars !== undefined) {
    appendForm(
      body,
      "combine_under_n_chars",
      payload.partition_parameters.combine_under_n_chars,
    );
  }
  if (payload.partition_parameters.content_type !== undefined) {
    appendForm(body, "content_type", payload.partition_parameters.content_type);
  }
  if (payload.partition_parameters.coordinates !== undefined) {
    appendForm(body, "coordinates", payload.partition_parameters.coordinates);
  }
  if (payload.partition_parameters.encoding !== undefined) {
    appendForm(body, "encoding", payload.partition_parameters.encoding);
  }
  if (payload.partition_parameters.extract_image_block_types !== undefined) {
    appendForm(
      body,
      "extract_image_block_types",
      payload.partition_parameters.extract_image_block_types,
    );
  }
  if (payload.partition_parameters.gz_uncompressed_content_type !== undefined) {
    appendForm(
      body,
      "gz_uncompressed_content_type",
      payload.partition_parameters.gz_uncompressed_content_type,
    );
  }
  if (payload.partition_parameters.hi_res_model_name !== undefined) {
    appendForm(
      body,
      "hi_res_model_name",
      payload.partition_parameters.hi_res_model_name,
    );
  }
  if (payload.partition_parameters.include_orig_elements !== undefined) {
    appendForm(
      body,
      "include_orig_elements",
      payload.partition_parameters.include_orig_elements,
    );
  }
  if (payload.partition_parameters.include_page_breaks !== undefined) {
    appendForm(
      body,
      "include_page_breaks",
      payload.partition_parameters.include_page_breaks,
    );
  }
  if (payload.partition_parameters.include_slide_notes !== undefined) {
    appendForm(
      body,
      "include_slide_notes",
      payload.partition_parameters.include_slide_notes,
    );
  }
  if (payload.partition_parameters.languages !== undefined) {
    appendForm(body, "languages", payload.partition_parameters.languages);
  }
  if (payload.partition_parameters.max_characters !== undefined) {
    appendForm(
      body,
      "max_characters",
      payload.partition_parameters.max_characters,
    );
  }
  if (payload.partition_parameters.multipage_sections !== undefined) {
    appendForm(
      body,
      "multipage_sections",
      payload.partition_parameters.multipage_sections,
    );
  }
  if (payload.partition_parameters.new_after_n_chars !== undefined) {
    appendForm(
      body,
      "new_after_n_chars",
      payload.partition_parameters.new_after_n_chars,
    );
  }
  if (payload.partition_parameters.ocr_languages !== undefined) {
    appendForm(
      body,
      "ocr_languages",
      payload.partition_parameters.ocr_languages,
    );
  }
  if (payload.partition_parameters.output_format !== undefined) {
    appendForm(
      body,
      "output_format",
      payload.partition_parameters.output_format,
    );
  }
  if (payload.partition_parameters.overlap !== undefined) {
    appendForm(body, "overlap", payload.partition_parameters.overlap);
  }
  if (payload.partition_parameters.overlap_all !== undefined) {
    appendForm(body, "overlap_all", payload.partition_parameters.overlap_all);
  }
  if (payload.partition_parameters.pdf_infer_table_structure !== undefined) {
    appendForm(
      body,
      "pdf_infer_table_structure",
      payload.partition_parameters.pdf_infer_table_structure,
    );
  }
  if (payload.partition_parameters.pdfminer_char_margin !== undefined) {
    appendForm(
      body,
      "pdfminer_char_margin",
      payload.partition_parameters.pdfminer_char_margin,
    );
  }
  if (payload.partition_parameters.pdfminer_line_margin !== undefined) {
    appendForm(
      body,
      "pdfminer_line_margin",
      payload.partition_parameters.pdfminer_line_margin,
    );
  }
  if (payload.partition_parameters.pdfminer_line_overlap !== undefined) {
    appendForm(
      body,
      "pdfminer_line_overlap",
      payload.partition_parameters.pdfminer_line_overlap,
    );
  }
  if (payload.partition_parameters.pdfminer_word_margin !== undefined) {
    appendForm(
      body,
      "pdfminer_word_margin",
      payload.partition_parameters.pdfminer_word_margin,
    );
  }
  if (payload.partition_parameters.similarity_threshold !== undefined) {
    appendForm(
      body,
      "similarity_threshold",
      payload.partition_parameters.similarity_threshold,
    );
  }
  if (payload.partition_parameters.skip_infer_table_types !== undefined) {
    appendForm(
      body,
      "skip_infer_table_types",
      payload.partition_parameters.skip_infer_table_types,
    );
  }
  if (payload.partition_parameters.split_pdf_allow_failed !== undefined) {
    appendForm(
      body,
      "split_pdf_allow_failed",
      payload.partition_parameters.split_pdf_allow_failed,
    );
  }
  if (payload.partition_parameters.split_pdf_concurrency_level !== undefined) {
    appendForm(
      body,
      "split_pdf_concurrency_level",
      payload.partition_parameters.split_pdf_concurrency_level,
    );
  }
  if (payload.partition_parameters.split_pdf_page !== undefined) {
    appendForm(
      body,
      "split_pdf_page",
      payload.partition_parameters.split_pdf_page,
    );
  }
  if (payload.partition_parameters.split_pdf_page_range !== undefined) {
    appendForm(
      body,
      "split_pdf_page_range",
      payload.partition_parameters.split_pdf_page_range,
    );
  }
  if (payload.partition_parameters.starting_page_number !== undefined) {
    appendForm(
      body,
      "starting_page_number",
      payload.partition_parameters.starting_page_number,
    );
  }
  if (payload.partition_parameters.strategy !== undefined) {
    appendForm(body, "strategy", payload.partition_parameters.strategy);
  }
  if (payload.partition_parameters.table_ocr_agent !== undefined) {
    appendForm(
      body,
      "table_ocr_agent",
      payload.partition_parameters.table_ocr_agent,
    );
  }
  if (payload.partition_parameters.unique_element_ids !== undefined) {
    appendForm(
      body,
      "unique_element_ids",
      payload.partition_parameters.unique_element_ids,
    );
  }
  if (payload.partition_parameters.vlm_model !== undefined) {
    appendForm(body, "vlm_model", payload.partition_parameters.vlm_model);
  }
  if (payload.partition_parameters.vlm_model_provider !== undefined) {
    appendForm(
      body,
      "vlm_model_provider",
      payload.partition_parameters.vlm_model_provider,
    );
  }
  if (payload.partition_parameters.xml_keep_tags !== undefined) {
    appendForm(
      body,
      "xml_keep_tags",
      payload.partition_parameters.xml_keep_tags,
    );
  }

  const path = pathToFunc("/general/v0/general")();

  const headers = new Headers(compactMap({
    Accept: options?.acceptHeaderOverride
      || "application/json;q=1, text/csv;q=0",
    "unstructured-api-key": encodeSimple(
      "unstructured-api-key",
      payload["unstructured-api-key"],
      { explode: false, charEncoding: "none" },
    ),
  }));

  const securityInput = await extractSecurity(client._options.security);
  const requestSecurity = resolveGlobalSecurity(securityInput);

  const context = {
    baseURL: options?.serverURL ?? client._baseURL ?? "",
    operationID: "partition",
    oAuth2Scopes: [],

    resolvedSecurity: requestSecurity,

    securitySource: client._options.security,
    retryConfig: options?.retries
      || client._options.retryConfig
      || {
        strategy: "backoff",
        backoff: {
          initialInterval: 3000,
          maxInterval: 720000,
          exponent: 1.88,
          maxElapsedTime: 1800000,
        },
        retryConnectionErrors: true,
      }
      || { strategy: "none" },
    retryCodes: options?.retryCodes || ["5xx"],
  };

  const requestRes = client._createRequest(context, {
    security: requestSecurity,
    method: "POST",
    baseURL: options?.serverURL,
    path: path,
    headers: headers,
    body: body,
    timeoutMs: options?.timeoutMs || client._options.timeoutMs || -1,
  }, options);
  if (!requestRes.ok) {
    return [requestRes, { status: "invalid" }];
  }
  const req = requestRes.value;

  const doResult = await client._do(req, {
    context,
    errorCodes: ["422", "4XX", "5XX"],
    retryConfig: context.retryConfig,
    retryCodes: context.retryCodes,
  });
  if (!doResult.ok) {
    return [doResult, { status: "request-error", request: req }];
  }
  const response = doResult.value;

  const responseFields = {
    HttpMeta: { Response: response, Request: req },
  };

  const [result] = await M.match<
    operations.PartitionResponse,
    | errors.HTTPValidationError
    | errors.ServerError
    | SDKError
    | SDKValidationError
    | UnexpectedClientError
    | InvalidRequestError
    | RequestAbortedError
    | RequestTimeoutError
    | ConnectionError
  >(
    M.json(200, operations.PartitionResponse$inboundSchema),
    M.text(200, operations.PartitionResponse$inboundSchema, {
      ctype: "text/csv",
    }),
    M.jsonErr(422, errors.HTTPValidationError$inboundSchema),
    M.fail("4XX"),
    M.jsonErr("5XX", errors.ServerError$inboundSchema),
  )(response, { extraFields: responseFields });
  if (!result.ok) {
    return [result, { status: "complete", request: req, response }];
  }

  return [result, { status: "complete", request: req, response }];
}
