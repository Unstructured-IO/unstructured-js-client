/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../../lib/primitives.js";
import { safeParse } from "../../../lib/schemas.js";
import { blobLikeSchema } from "../../types/blobs.js";
import {
  catchUnrecognizedEnum,
  OpenEnum,
  Unrecognized,
} from "../../types/enums.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";

export type Files = {
  content: ReadableStream<Uint8Array> | Blob | ArrayBuffer | Uint8Array;
  fileName: string;
};

/**
 * The format of the response. Supported formats are application/json and text/csv. Default: application/json.
 */
export enum OutputFormat {
  ApplicationJson = "application/json",
  TextCsv = "text/csv",
}
/**
 * The format of the response. Supported formats are application/json and text/csv. Default: application/json.
 */
export type OutputFormatOpen = OpenEnum<typeof OutputFormat>;

/**
 * The strategy to use for partitioning PDF/image. Options are fast, hi_res, auto. Default: hi_res
 */
export enum Strategy {
  Fast = "fast",
  HiRes = "hi_res",
  Auto = "auto",
  OcrOnly = "ocr_only",
  OdOnly = "od_only",
  Vlm = "vlm",
}
/**
 * The strategy to use for partitioning PDF/image. Options are fast, hi_res, auto. Default: hi_res
 */
export type StrategyOpen = OpenEnum<typeof Strategy>;

/**
 * The VLM Model to use.
 */
export enum PartitionParametersStrategy {
  Claude35Sonnet20241022 = "claude-3-5-sonnet-20241022",
  Gpt4o = "gpt-4o",
  Gemini15Pro = "gemini-1.5-pro",
  UsAmazonNovaProV10 = "us.amazon.nova-pro-v1:0",
  UsAmazonNovaLiteV10 = "us.amazon.nova-lite-v1:0",
  UsAnthropicClaude35Sonnet20241022V20 =
    "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
  UsAnthropicClaude3Opus20240229V10 =
    "us.anthropic.claude-3-opus-20240229-v1:0",
  UsAnthropicClaude3Haiku20240307V10 =
    "us.anthropic.claude-3-haiku-20240307-v1:0",
  UsAnthropicClaude3Sonnet20240229V10 =
    "us.anthropic.claude-3-sonnet-20240229-v1:0",
  UsMetaLlama3290bInstructV10 = "us.meta.llama3-2-90b-instruct-v1:0",
  UsMetaLlama3211bInstructV10 = "us.meta.llama3-2-11b-instruct-v1:0",
  Gemini20Flash001 = "gemini-2.0-flash-001",
}
/**
 * The VLM Model to use.
 */
export type PartitionParametersStrategyOpen = OpenEnum<
  typeof PartitionParametersStrategy
>;

/**
 * The VLM Model provider to use.
 */
export enum PartitionParametersSchemasStrategy {
  Openai = "openai",
  Anthropic = "anthropic",
  Bedrock = "bedrock",
  AnthropicBedrock = "anthropic_bedrock",
  Vertexai = "vertexai",
  Google = "google",
  AzureOpenai = "azure_openai",
}
/**
 * The VLM Model provider to use.
 */
export type PartitionParametersSchemasStrategyOpen = OpenEnum<
  typeof PartitionParametersSchemasStrategy
>;

export type PartitionParameters = {
  /**
   * The file to extract
   */
  files: Files | Blob;
  /**
   * Use one of the supported strategies to chunk the returned elements after partitioning. When 'chunking_strategy' is not specified, no chunking is performed and any other chunking parameters provided are ignored. Supported strategies: 'basic', 'by_page', 'by_similarity', or 'by_title'
   */
  chunkingStrategy?: string | null | undefined;
  /**
   * If chunking strategy is set, combine elements until a section reaches a length of n chars. Default: 500
   */
  combineUnderNChars?: number | null | undefined;
  /**
   * A hint about the content type to use (such as text/markdown), when there are problems processing a specific file. This value is a MIME type in the format type/subtype.
   */
  contentType?: string | null | undefined;
  /**
   * If `True`, return coordinates for each element extracted via OCR. Default: `False`
   */
  coordinates?: boolean | undefined;
  /**
   * The encoding method used to decode the text input. Default: utf-8
   */
  encoding?: string | null | undefined;
  /**
   * The types of elements to extract, for use in extracting image blocks as base64 encoded data stored in metadata fields.
   */
  extractImageBlockTypes?: Array<string> | undefined;
  /**
   * If file is gzipped, use this content type after unzipping.
   */
  gzUncompressedContentType?: string | null | undefined;
  /**
   * The name of the inference model used when strategy is hi_res
   */
  hiResModelName?: string | null | undefined;
  /**
   * When a chunking strategy is specified, each returned chunk will include the elements consolidated to form that chunk as `.metadata.orig_elements`. Default: true.
   */
  includeOrigElements?: boolean | null | undefined;
  /**
   * If true, the output will include page breaks if the filetype supports it. Default: false
   */
  includePageBreaks?: boolean | undefined;
  /**
   * When `True`, slide notes from .ppt and .pptx files will be included in the response. Default: `True`
   */
  includeSlideNotes?: boolean | undefined;
  /**
   * The languages present in the document, for use in partitioning and/or OCR. See the Tesseract documentation for a full list of languages.
   */
  languages?: Array<string> | undefined;
  /**
   * If chunking strategy is set, cut off new sections after reaching a length of n chars (hard max). Default: 500
   */
  maxCharacters?: number | null | undefined;
  /**
   * If chunking strategy is set, determines if sections can span multiple sections. Default: true
   */
  multipageSections?: boolean | undefined;
  /**
   * If chunking strategy is set, cut off new sections after reaching a length of n chars (soft max). Default: 1500
   */
  newAfterNChars?: number | null | undefined;
  /**
   * Deprecated! The languages present in the document, for use in partitioning and/or OCR
   */
  ocrLanguages?: Array<string> | undefined;
  /**
   * The format of the response. Supported formats are application/json and text/csv. Default: application/json.
   */
  outputFormat?: OutputFormatOpen | undefined;
  /**
   * Specifies the length of a string ('tail') to be drawn from each chunk and prefixed to the next chunk as a context-preserving mechanism. By default, this only applies to split-chunks where an oversized element is divided into multiple chunks by text-splitting. Default: 0
   */
  overlap?: number | undefined;
  /**
   * When `True`, apply overlap between 'normal' chunks formed from whole elements and not subject to text-splitting. Use this with caution as it entails a certain level of 'pollution' of otherwise clean semantic chunk boundaries. Default: False
   */
  overlapAll?: boolean | undefined;
  /**
   * Deprecated! Use skip_infer_table_types to opt out of table extraction for any file type. If False and strategy=hi_res, no Table Elements will be extracted from pdf files regardless of skip_infer_table_types contents.
   */
  pdfInferTableStructure?: boolean | undefined;
  /**
   * A value between 0.0 and 1.0 describing the minimum similarity two elements must have to be included in the same chunk. Note that similar elements may be separated to meet chunk-size criteria; this value can only guarantees that two elements with similarity below the threshold will appear in separate chunks.
   */
  similarityThreshold?: number | null | undefined;
  /**
   * The document types that you want to skip table extraction with. Default: []
   */
  skipInferTableTypes?: Array<string> | undefined;
  /**
   * When `split_pdf_page` is set to `True`, this parameter defines the behavior when some of the parallel requests fail. By default `split_pdf_allow_failed` is set to `False` and any failed request send to the API will make the whole process break and raise an Exception. If `split_pdf_allow_failed` is set to `True`, the errors encountered while sending parallel requests will not break the processing - the resuling list of Elements will miss the data from errored pages.
   */
  splitPdfAllowFailed?: boolean | undefined;
  /**
   * Number of maximum concurrent requests made when splitting PDF. Ignored on backend.
   */
  splitPdfConcurrencyLevel?: number | undefined;
  /**
   * Should the pdf file be split at client. Ignored on backend.
   */
  splitPdfPage?: boolean | undefined;
  /**
   * When `split_pdf_page is set to `True`, this parameter selects a subset of the pdf to send to the API. The parameter is a list of 2 integers within the range [1, length_of_pdf]. An Error is thrown if the given range is invalid. Ignored on backend.
   */
  splitPdfPageRange?: Array<number> | undefined;
  /**
   * When PDF is split into pages before sending it into the API, providing this information will allow the page number to be assigned correctly. Introduced in 1.0.27.
   */
  startingPageNumber?: number | null | undefined;
  /**
   * The strategy to use for partitioning PDF/image. Options are fast, hi_res, auto. Default: hi_res
   */
  strategy?: StrategyOpen | undefined;
  /**
   * The OCR agent to use for table ocr inference.
   */
  tableOcrAgent?: string | null | undefined;
  /**
   * When `True`, assign UUIDs to element IDs, which guarantees their uniqueness (useful when using them as primary keys in database). Otherwise a SHA-256 of element text is used. Default: `False`
   */
  uniqueElementIds?: boolean | undefined;
  /**
   * The VLM Model to use.
   */
  vlmModel?: PartitionParametersStrategyOpen | undefined;
  /**
   * The VLM Model provider to use.
   */
  vlmModelProvider?: PartitionParametersSchemasStrategyOpen | undefined;
  /**
   * If `True`, will retain the XML tags in the output. Otherwise it will simply extract the text from within the tags. Only applies to XML documents.
   */
  xmlKeepTags?: boolean | undefined;
};

/** @internal */
export const Files$inboundSchema: z.ZodType<Files, z.ZodTypeDef, unknown> = z
  .object({
    content: z.union([
      z.instanceof(ReadableStream<Uint8Array>),
      z.instanceof(Blob),
      z.instanceof(ArrayBuffer),
      z.instanceof(Uint8Array),
    ]),
    fileName: z.string(),
  });

/** @internal */
export type Files$Outbound = {
  content: ReadableStream<Uint8Array> | Blob | ArrayBuffer | Uint8Array;
  fileName: string;
};

/** @internal */
export const Files$outboundSchema: z.ZodType<
  Files$Outbound,
  z.ZodTypeDef,
  Files
> = z.object({
  content: z.union([
    z.instanceof(ReadableStream<Uint8Array>),
    z.instanceof(Blob),
    z.instanceof(ArrayBuffer),
    z.instanceof(Uint8Array),
  ]),
  fileName: z.string(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Files$ {
  /** @deprecated use `Files$inboundSchema` instead. */
  export const inboundSchema = Files$inboundSchema;
  /** @deprecated use `Files$outboundSchema` instead. */
  export const outboundSchema = Files$outboundSchema;
  /** @deprecated use `Files$Outbound` instead. */
  export type Outbound = Files$Outbound;
}

export function filesToJSON(files: Files): string {
  return JSON.stringify(Files$outboundSchema.parse(files));
}

export function filesFromJSON(
  jsonString: string,
): SafeParseResult<Files, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Files$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Files' from JSON`,
  );
}

/** @internal */
export const OutputFormat$inboundSchema: z.ZodType<
  OutputFormatOpen,
  z.ZodTypeDef,
  unknown
> = z
  .union([
    z.nativeEnum(OutputFormat),
    z.string().transform(catchUnrecognizedEnum),
  ]);

/** @internal */
export const OutputFormat$outboundSchema: z.ZodType<
  OutputFormatOpen,
  z.ZodTypeDef,
  OutputFormatOpen
> = z.union([
  z.nativeEnum(OutputFormat),
  z.string().and(z.custom<Unrecognized<string>>()),
]);

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace OutputFormat$ {
  /** @deprecated use `OutputFormat$inboundSchema` instead. */
  export const inboundSchema = OutputFormat$inboundSchema;
  /** @deprecated use `OutputFormat$outboundSchema` instead. */
  export const outboundSchema = OutputFormat$outboundSchema;
}

/** @internal */
export const Strategy$inboundSchema: z.ZodType<
  StrategyOpen,
  z.ZodTypeDef,
  unknown
> = z
  .union([
    z.nativeEnum(Strategy),
    z.string().transform(catchUnrecognizedEnum),
  ]);

/** @internal */
export const Strategy$outboundSchema: z.ZodType<
  StrategyOpen,
  z.ZodTypeDef,
  StrategyOpen
> = z.union([
  z.nativeEnum(Strategy),
  z.string().and(z.custom<Unrecognized<string>>()),
]);

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Strategy$ {
  /** @deprecated use `Strategy$inboundSchema` instead. */
  export const inboundSchema = Strategy$inboundSchema;
  /** @deprecated use `Strategy$outboundSchema` instead. */
  export const outboundSchema = Strategy$outboundSchema;
}

/** @internal */
export const PartitionParametersStrategy$inboundSchema: z.ZodType<
  PartitionParametersStrategyOpen,
  z.ZodTypeDef,
  unknown
> = z
  .union([
    z.nativeEnum(PartitionParametersStrategy),
    z.string().transform(catchUnrecognizedEnum),
  ]);

/** @internal */
export const PartitionParametersStrategy$outboundSchema: z.ZodType<
  PartitionParametersStrategyOpen,
  z.ZodTypeDef,
  PartitionParametersStrategyOpen
> = z.union([
  z.nativeEnum(PartitionParametersStrategy),
  z.string().and(z.custom<Unrecognized<string>>()),
]);

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace PartitionParametersStrategy$ {
  /** @deprecated use `PartitionParametersStrategy$inboundSchema` instead. */
  export const inboundSchema = PartitionParametersStrategy$inboundSchema;
  /** @deprecated use `PartitionParametersStrategy$outboundSchema` instead. */
  export const outboundSchema = PartitionParametersStrategy$outboundSchema;
}

/** @internal */
export const PartitionParametersSchemasStrategy$inboundSchema: z.ZodType<
  PartitionParametersSchemasStrategyOpen,
  z.ZodTypeDef,
  unknown
> = z
  .union([
    z.nativeEnum(PartitionParametersSchemasStrategy),
    z.string().transform(catchUnrecognizedEnum),
  ]);

/** @internal */
export const PartitionParametersSchemasStrategy$outboundSchema: z.ZodType<
  PartitionParametersSchemasStrategyOpen,
  z.ZodTypeDef,
  PartitionParametersSchemasStrategyOpen
> = z.union([
  z.nativeEnum(PartitionParametersSchemasStrategy),
  z.string().and(z.custom<Unrecognized<string>>()),
]);

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace PartitionParametersSchemasStrategy$ {
  /** @deprecated use `PartitionParametersSchemasStrategy$inboundSchema` instead. */
  export const inboundSchema = PartitionParametersSchemasStrategy$inboundSchema;
  /** @deprecated use `PartitionParametersSchemasStrategy$outboundSchema` instead. */
  export const outboundSchema =
    PartitionParametersSchemasStrategy$outboundSchema;
}

/** @internal */
export const PartitionParameters$inboundSchema: z.ZodType<
  PartitionParameters,
  z.ZodTypeDef,
  unknown
> = z.object({
  files: z.lazy(() => Files$inboundSchema),
  chunking_strategy: z.nullable(z.string()).optional(),
  combine_under_n_chars: z.nullable(z.number().int()).optional(),
  content_type: z.nullable(z.string()).optional(),
  coordinates: z.boolean().default(false),
  encoding: z.nullable(z.string()).optional(),
  extract_image_block_types: z.array(z.string()).optional(),
  gz_uncompressed_content_type: z.nullable(z.string()).optional(),
  hi_res_model_name: z.nullable(z.string()).optional(),
  include_orig_elements: z.nullable(z.boolean()).optional(),
  include_page_breaks: z.boolean().default(false),
  include_slide_notes: z.boolean().default(true),
  languages: z.array(z.string()).optional(),
  max_characters: z.nullable(z.number().int()).optional(),
  multipage_sections: z.boolean().default(true),
  new_after_n_chars: z.nullable(z.number().int()).optional(),
  ocr_languages: z.array(z.string()).optional(),
  output_format: OutputFormat$inboundSchema.default(
    OutputFormat.ApplicationJson,
  ),
  overlap: z.number().int().default(0),
  overlap_all: z.boolean().default(false),
  pdf_infer_table_structure: z.boolean().default(true),
  similarity_threshold: z.nullable(z.number()).optional(),
  skip_infer_table_types: z.array(z.string()).optional(),
  split_pdf_allow_failed: z.boolean().default(false),
  split_pdf_concurrency_level: z.number().int().default(5),
  split_pdf_page: z.boolean().default(true),
  split_pdf_page_range: z.array(z.number().int()).optional(),
  starting_page_number: z.nullable(z.number().int()).optional(),
  strategy: Strategy$inboundSchema.default(Strategy.HiRes),
  table_ocr_agent: z.nullable(z.string()).optional(),
  unique_element_ids: z.boolean().default(false),
  vlm_model: PartitionParametersStrategy$inboundSchema.optional(),
  vlm_model_provider: PartitionParametersSchemasStrategy$inboundSchema
    .optional(),
  xml_keep_tags: z.boolean().default(false),
}).transform((v) => {
  return remap$(v, {
    "chunking_strategy": "chunkingStrategy",
    "combine_under_n_chars": "combineUnderNChars",
    "content_type": "contentType",
    "extract_image_block_types": "extractImageBlockTypes",
    "gz_uncompressed_content_type": "gzUncompressedContentType",
    "hi_res_model_name": "hiResModelName",
    "include_orig_elements": "includeOrigElements",
    "include_page_breaks": "includePageBreaks",
    "include_slide_notes": "includeSlideNotes",
    "max_characters": "maxCharacters",
    "multipage_sections": "multipageSections",
    "new_after_n_chars": "newAfterNChars",
    "ocr_languages": "ocrLanguages",
    "output_format": "outputFormat",
    "overlap_all": "overlapAll",
    "pdf_infer_table_structure": "pdfInferTableStructure",
    "similarity_threshold": "similarityThreshold",
    "skip_infer_table_types": "skipInferTableTypes",
    "split_pdf_allow_failed": "splitPdfAllowFailed",
    "split_pdf_concurrency_level": "splitPdfConcurrencyLevel",
    "split_pdf_page": "splitPdfPage",
    "split_pdf_page_range": "splitPdfPageRange",
    "starting_page_number": "startingPageNumber",
    "table_ocr_agent": "tableOcrAgent",
    "unique_element_ids": "uniqueElementIds",
    "vlm_model": "vlmModel",
    "vlm_model_provider": "vlmModelProvider",
    "xml_keep_tags": "xmlKeepTags",
  });
});

/** @internal */
export type PartitionParameters$Outbound = {
  files: Files$Outbound | Blob;
  chunking_strategy?: string | null | undefined;
  combine_under_n_chars?: number | null | undefined;
  content_type?: string | null | undefined;
  coordinates: boolean;
  encoding?: string | null | undefined;
  extract_image_block_types?: Array<string> | undefined;
  gz_uncompressed_content_type?: string | null | undefined;
  hi_res_model_name?: string | null | undefined;
  include_orig_elements?: boolean | null | undefined;
  include_page_breaks: boolean;
  include_slide_notes: boolean;
  languages?: Array<string> | undefined;
  max_characters?: number | null | undefined;
  multipage_sections: boolean;
  new_after_n_chars?: number | null | undefined;
  ocr_languages?: Array<string> | undefined;
  output_format: string;
  overlap: number;
  overlap_all: boolean;
  pdf_infer_table_structure: boolean;
  similarity_threshold?: number | null | undefined;
  skip_infer_table_types?: Array<string> | undefined;
  split_pdf_allow_failed: boolean;
  split_pdf_concurrency_level: number;
  split_pdf_page: boolean;
  split_pdf_page_range?: Array<number> | undefined;
  starting_page_number?: number | null | undefined;
  strategy: string;
  table_ocr_agent?: string | null | undefined;
  unique_element_ids: boolean;
  vlm_model?: string | undefined;
  vlm_model_provider?: string | undefined;
  xml_keep_tags: boolean;
};

/** @internal */
export const PartitionParameters$outboundSchema: z.ZodType<
  PartitionParameters$Outbound,
  z.ZodTypeDef,
  PartitionParameters
> = z.object({
  files: z.lazy(() => Files$outboundSchema).or(blobLikeSchema),
  chunkingStrategy: z.nullable(z.string()).optional(),
  combineUnderNChars: z.nullable(z.number().int()).optional(),
  contentType: z.nullable(z.string()).optional(),
  coordinates: z.boolean().default(false),
  encoding: z.nullable(z.string()).optional(),
  extractImageBlockTypes: z.array(z.string()).optional(),
  gzUncompressedContentType: z.nullable(z.string()).optional(),
  hiResModelName: z.nullable(z.string()).optional(),
  includeOrigElements: z.nullable(z.boolean()).optional(),
  includePageBreaks: z.boolean().default(false),
  includeSlideNotes: z.boolean().default(true),
  languages: z.array(z.string()).optional(),
  maxCharacters: z.nullable(z.number().int()).optional(),
  multipageSections: z.boolean().default(true),
  newAfterNChars: z.nullable(z.number().int()).optional(),
  ocrLanguages: z.array(z.string()).optional(),
  outputFormat: OutputFormat$outboundSchema.default(
    OutputFormat.ApplicationJson,
  ),
  overlap: z.number().int().default(0),
  overlapAll: z.boolean().default(false),
  pdfInferTableStructure: z.boolean().default(true),
  similarityThreshold: z.nullable(z.number()).optional(),
  skipInferTableTypes: z.array(z.string()).optional(),
  splitPdfAllowFailed: z.boolean().default(false),
  splitPdfConcurrencyLevel: z.number().int().default(5),
  splitPdfPage: z.boolean().default(true),
  splitPdfPageRange: z.array(z.number().int()).optional(),
  startingPageNumber: z.nullable(z.number().int()).optional(),
  strategy: Strategy$outboundSchema.default(Strategy.HiRes),
  tableOcrAgent: z.nullable(z.string()).optional(),
  uniqueElementIds: z.boolean().default(false),
  vlmModel: PartitionParametersStrategy$outboundSchema.optional(),
  vlmModelProvider: PartitionParametersSchemasStrategy$outboundSchema
    .optional(),
  xmlKeepTags: z.boolean().default(false),
}).transform((v) => {
  return remap$(v, {
    chunkingStrategy: "chunking_strategy",
    combineUnderNChars: "combine_under_n_chars",
    contentType: "content_type",
    extractImageBlockTypes: "extract_image_block_types",
    gzUncompressedContentType: "gz_uncompressed_content_type",
    hiResModelName: "hi_res_model_name",
    includeOrigElements: "include_orig_elements",
    includePageBreaks: "include_page_breaks",
    includeSlideNotes: "include_slide_notes",
    maxCharacters: "max_characters",
    multipageSections: "multipage_sections",
    newAfterNChars: "new_after_n_chars",
    ocrLanguages: "ocr_languages",
    outputFormat: "output_format",
    overlapAll: "overlap_all",
    pdfInferTableStructure: "pdf_infer_table_structure",
    similarityThreshold: "similarity_threshold",
    skipInferTableTypes: "skip_infer_table_types",
    splitPdfAllowFailed: "split_pdf_allow_failed",
    splitPdfConcurrencyLevel: "split_pdf_concurrency_level",
    splitPdfPage: "split_pdf_page",
    splitPdfPageRange: "split_pdf_page_range",
    startingPageNumber: "starting_page_number",
    tableOcrAgent: "table_ocr_agent",
    uniqueElementIds: "unique_element_ids",
    vlmModel: "vlm_model",
    vlmModelProvider: "vlm_model_provider",
    xmlKeepTags: "xml_keep_tags",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace PartitionParameters$ {
  /** @deprecated use `PartitionParameters$inboundSchema` instead. */
  export const inboundSchema = PartitionParameters$inboundSchema;
  /** @deprecated use `PartitionParameters$outboundSchema` instead. */
  export const outboundSchema = PartitionParameters$outboundSchema;
  /** @deprecated use `PartitionParameters$Outbound` instead. */
  export type Outbound = PartitionParameters$Outbound;
}

export function partitionParametersToJSON(
  partitionParameters: PartitionParameters,
): string {
  return JSON.stringify(
    PartitionParameters$outboundSchema.parse(partitionParameters),
  );
}

export function partitionParametersFromJSON(
  jsonString: string,
): SafeParseResult<PartitionParameters, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => PartitionParameters$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'PartitionParameters' from JSON`,
  );
}
