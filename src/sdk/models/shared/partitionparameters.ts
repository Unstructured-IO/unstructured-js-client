/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { remap as remap$ } from "../../../lib/primitives.js";
import { blobLikeSchema } from "../../types/blobs.js";
import { catchUnrecognizedEnum, OpenEnum, Unrecognized } from "../../types/enums.js";
import * as z from "zod";

export enum ChunkingStrategy {
    Basic = "basic",
    ByPage = "by_page",
    BySimilarity = "by_similarity",
    ByTitle = "by_title",
}
export type ChunkingStrategyOpen = OpenEnum<typeof ChunkingStrategy>;

export type Files = {
    content: ReadableStream<Uint8Array> | Blob | ArrayBuffer | Buffer;
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
}
/**
 * The strategy to use for partitioning PDF/image. Options are fast, hi_res, auto. Default: hi_res
 */
export type StrategyOpen = OpenEnum<typeof Strategy>;

export type PartitionParameters = {
    /**
     * The file to extract
     */
    files: Files | Blob;
    /**
     * Use one of the supported strategies to chunk the returned elements after partitioning. When 'chunking_strategy' is not specified, no chunking is performed and any other chunking parameters provided are ignored. Supported strategies: 'basic', 'by_page', 'by_similarity', or 'by_title'
     */
    chunkingStrategy?: ChunkingStrategyOpen | null | undefined;
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
     * When `split_pdf_page` is set to `True`, this parameter defines the behavior when some of the parallel requests fail. By default `split_pdf_allow_failed` is set to `False` and any failed request send to the API will make the whole process break and raise an Exception. If `split_pdf_allow_failed` is set to `True`, the errors encountered while sending parallel requests will not break the processing - the resulting list of Elements will miss the data from errored pages.
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
     * When `True`, assign UUIDs to element IDs, which guarantees their uniqueness (useful when using them as primary keys in database). Otherwise a SHA-256 of element text is used. Default: `False`
     */
    uniqueElementIds?: boolean | undefined;
    /**
     * If `True`, will retain the XML tags in the output. Otherwise it will simply extract the text from within the tags. Only applies to XML documents.
     */
    xmlKeepTags?: boolean | undefined;
};

/** @internal */
export const ChunkingStrategy$inboundSchema: z.ZodType<
    ChunkingStrategyOpen,
    z.ZodTypeDef,
    unknown
> = z.union([z.nativeEnum(ChunkingStrategy), z.string().transform(catchUnrecognizedEnum)]);

/** @internal */
export const ChunkingStrategy$outboundSchema: z.ZodType<
    ChunkingStrategyOpen,
    z.ZodTypeDef,
    ChunkingStrategyOpen
> = z.union([z.nativeEnum(ChunkingStrategy), z.string().and(z.custom<Unrecognized<string>>())]);

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace ChunkingStrategy$ {
    /** @deprecated use `ChunkingStrategy$inboundSchema` instead. */
    export const inboundSchema = ChunkingStrategy$inboundSchema;
    /** @deprecated use `ChunkingStrategy$outboundSchema` instead. */
    export const outboundSchema = ChunkingStrategy$outboundSchema;
}

/** @internal */
export const Files$inboundSchema: z.ZodType<Files, z.ZodTypeDef, unknown> = z.object({
    content: z.union([
        z.instanceof(ReadableStream<Uint8Array>),
        z.instanceof(Blob),
        z.instanceof(ArrayBuffer),
        z.instanceof(Buffer),
    ]),
    fileName: z.string(),
});

/** @internal */
export type Files$Outbound = {
    content: ReadableStream<Uint8Array> | Blob | ArrayBuffer | Buffer;
    fileName: string;
};

/** @internal */
export const Files$outboundSchema: z.ZodType<Files$Outbound, z.ZodTypeDef, Files> = z.object({
    content: z.union([
        z.instanceof(ReadableStream<Uint8Array>),
        z.instanceof(Blob),
        z.instanceof(ArrayBuffer),
        z.instanceof(Buffer),
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

/** @internal */
export const OutputFormat$inboundSchema: z.ZodType<OutputFormatOpen, z.ZodTypeDef, unknown> =
    z.union([z.nativeEnum(OutputFormat), z.string().transform(catchUnrecognizedEnum)]);

/** @internal */
export const OutputFormat$outboundSchema: z.ZodType<
    OutputFormatOpen,
    z.ZodTypeDef,
    OutputFormatOpen
> = z.union([z.nativeEnum(OutputFormat), z.string().and(z.custom<Unrecognized<string>>())]);

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
export const Strategy$inboundSchema: z.ZodType<StrategyOpen, z.ZodTypeDef, unknown> = z.union([
    z.nativeEnum(Strategy),
    z.string().transform(catchUnrecognizedEnum),
]);

/** @internal */
export const Strategy$outboundSchema: z.ZodType<StrategyOpen, z.ZodTypeDef, StrategyOpen> = z.union(
    [z.nativeEnum(Strategy), z.string().and(z.custom<Unrecognized<string>>())]
);

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
export const PartitionParameters$inboundSchema: z.ZodType<
    PartitionParameters,
    z.ZodTypeDef,
    unknown
> = z
    .object({
        files: z.lazy(() => Files$inboundSchema),
        chunking_strategy: z.nullable(ChunkingStrategy$inboundSchema).optional(),
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
        output_format: OutputFormat$inboundSchema.default(OutputFormat.ApplicationJson),
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
        unique_element_ids: z.boolean().default(false),
        xml_keep_tags: z.boolean().default(false),
    })
    .transform((v) => {
        return remap$(v, {
            chunking_strategy: "chunkingStrategy",
            combine_under_n_chars: "combineUnderNChars",
            content_type: "contentType",
            extract_image_block_types: "extractImageBlockTypes",
            gz_uncompressed_content_type: "gzUncompressedContentType",
            hi_res_model_name: "hiResModelName",
            include_orig_elements: "includeOrigElements",
            include_page_breaks: "includePageBreaks",
            include_slide_notes: "includeSlideNotes",
            max_characters: "maxCharacters",
            multipage_sections: "multipageSections",
            new_after_n_chars: "newAfterNChars",
            ocr_languages: "ocrLanguages",
            output_format: "outputFormat",
            overlap_all: "overlapAll",
            pdf_infer_table_structure: "pdfInferTableStructure",
            similarity_threshold: "similarityThreshold",
            skip_infer_table_types: "skipInferTableTypes",
            split_pdf_allow_failed: "splitPdfAllowFailed",
            split_pdf_concurrency_level: "splitPdfConcurrencyLevel",
            split_pdf_page: "splitPdfPage",
            split_pdf_page_range: "splitPdfPageRange",
            starting_page_number: "startingPageNumber",
            unique_element_ids: "uniqueElementIds",
            xml_keep_tags: "xmlKeepTags",
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
    unique_element_ids: boolean;
    xml_keep_tags: boolean;
};

/** @internal */
export const PartitionParameters$outboundSchema: z.ZodType<
    PartitionParameters$Outbound,
    z.ZodTypeDef,
    PartitionParameters
> = z
    .object({
        files: z.lazy(() => Files$outboundSchema).or(blobLikeSchema),
        chunkingStrategy: z.nullable(ChunkingStrategy$outboundSchema).optional(),
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
        outputFormat: OutputFormat$outboundSchema.default(OutputFormat.ApplicationJson),
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
        uniqueElementIds: z.boolean().default(false),
        xmlKeepTags: z.boolean().default(false),
    })
    .transform((v) => {
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
            uniqueElementIds: "unique_element_ids",
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
