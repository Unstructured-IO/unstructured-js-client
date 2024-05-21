/*
 * Code generated by Speakeasy (https://speakeasyapi.dev). DO NOT EDIT.
 */

import * as b64$ from "../../../lib/base64";
import { blobLikeSchema } from "../../types";
import * as z from "zod";

export enum ChunkingStrategy {
    Basic = "basic",
    ByPage = "by_page",
    BySimilarity = "by_similarity",
    ByTitle = "by_title",
}

export type Files = {
    content: Uint8Array | string;
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
 * The strategy to use for partitioning PDF/image. Options are fast, hi_res, auto. Default: auto
 */
export enum Strategy {
    Fast = "fast",
    HiRes = "hi_res",
    Auto = "auto",
    OcrOnly = "ocr_only",
}

export type PartitionParameters = {
    /**
     * The file to extract
     */
    files: Files | Blob;
    /**
     * Use one of the supported strategies to chunk the returned elements. Currently supports: 'basic', 'by_page', 'by_similarity', or 'by_title'
     */
    chunkingStrategy?: ChunkingStrategy | null | undefined;
    /**
     * If chunking strategy is set, combine elements until a section reaches a length of n chars. Default: 500
     */
    combineUnderNChars?: number | null | undefined;
    /**
     * If true, return coordinates for each element. Default: false
     */
    coordinates?: boolean | undefined;
    /**
     * The encoding method used to decode the text input. Default: utf-8
     */
    encoding?: string | null | undefined;
    /**
     * The types of elements to extract, for use in extracting image blocks as base64 encoded data stored in metadata fields
     */
    extractImageBlockTypes?: Array<string> | undefined;
    /**
     * If file is gzipped, use this content type after unzipping
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
     * If True, the output will include page breaks if the filetype supports it. Default: false
     */
    includePageBreaks?: boolean | undefined;
    /**
     * The languages present in the document, for use in partitioning and/or OCR
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
     * The languages present in the document, for use in partitioning and/or OCR
     */
    ocrLanguages?: Array<string> | undefined;
    /**
     * The format of the response. Supported formats are application/json and text/csv. Default: application/json.
     */
    outputFormat?: OutputFormat | undefined;
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
     * Number of maximum concurrent requests made when splitting PDF. Ignored on backend.
     */
    splitPdfConcurrencyLevel?: number | undefined;
    /**
     * Should the pdf file be split at client. Ignored on backend.
     */
    splitPdfPage?: boolean | undefined;
    /**
     * When PDF is split into pages before sending it into the API, providing this information will allow the page number to be assigned correctly. Introduced in 1.0.27.
     */
    startingPageNumber?: number | null | undefined;
    /**
     * The strategy to use for partitioning PDF/image. Options are fast, hi_res, auto. Default: auto
     */
    strategy?: Strategy | undefined;
    /**
     * When `True`, assign UUIDs to element IDs, which guarantees their uniqueness
     *
     * @remarks
     * (useful when using them as primary keys in database). Otherwise a SHA-256 of element text is used. Default: False
     */
    uniqueElementIds?: boolean | undefined;
    /**
     * If True, will retain the XML tags in the output. Otherwise it will simply extract the text from within the tags. Only applies to partition_xml.
     */
    xmlKeepTags?: boolean | undefined;
};

/** @internal */
export namespace ChunkingStrategy$ {
    export const inboundSchema = z.nativeEnum(ChunkingStrategy);
    export const outboundSchema = inboundSchema;
}

/** @internal */
export namespace Files$ {
    export const inboundSchema: z.ZodType<Files, z.ZodTypeDef, unknown> = z
        .object({
            content: b64$.zodInbound,
            fileName: z.string(),
        })
        .transform((v) => {
            return {
                content: v.content,
                fileName: v.fileName,
            };
        });

    export type Outbound = {
        content: Uint8Array;
        fileName: string;
    };

    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, Files> = z
        .object({
            content: b64$.zodOutbound,
            fileName: z.string(),
        })
        .transform((v) => {
            return {
                content: v.content,
                fileName: v.fileName,
            };
        });
}

/** @internal */
export namespace OutputFormat$ {
    export const inboundSchema = z.nativeEnum(OutputFormat);
    export const outboundSchema = inboundSchema;
}

/** @internal */
export namespace Strategy$ {
    export const inboundSchema = z.nativeEnum(Strategy);
    export const outboundSchema = inboundSchema;
}

/** @internal */
export namespace PartitionParameters$ {
    export const inboundSchema: z.ZodType<PartitionParameters, z.ZodTypeDef, unknown> = z
        .object({
            files: z.lazy(() => Files$.inboundSchema),
            chunking_strategy: z.nullable(ChunkingStrategy$.inboundSchema).default(null),
            combine_under_n_chars: z.nullable(z.number().int()).default(null),
            coordinates: z.boolean().default(false),
            encoding: z.nullable(z.string()).default(null),
            extract_image_block_types: z.array(z.string()).optional(),
            gz_uncompressed_content_type: z.nullable(z.string()).default(null),
            hi_res_model_name: z.nullable(z.string()).default(null),
            include_orig_elements: z.nullable(z.boolean()).default(null),
            include_page_breaks: z.boolean().default(false),
            languages: z.array(z.string()).optional(),
            max_characters: z.nullable(z.number().int()).default(null),
            multipage_sections: z.boolean().default(true),
            new_after_n_chars: z.nullable(z.number().int()).default(null),
            ocr_languages: z.array(z.string()).optional(),
            output_format: OutputFormat$.inboundSchema.default(OutputFormat.ApplicationJson),
            overlap: z.number().int().default(0),
            overlap_all: z.boolean().default(false),
            pdf_infer_table_structure: z.boolean().default(true),
            similarity_threshold: z.nullable(z.number()).default(null),
            skip_infer_table_types: z.array(z.string()).optional(),
            split_pdf_concurrency_level: z.number().int().default(5),
            split_pdf_page: z.boolean().default(false),
            starting_page_number: z.nullable(z.number().int()).default(null),
            strategy: Strategy$.inboundSchema.default(Strategy.Auto),
            unique_element_ids: z.boolean().default(false),
            xml_keep_tags: z.boolean().default(false),
        })
        .transform((v) => {
            return {
                files: v.files,
                chunkingStrategy: v.chunking_strategy,
                combineUnderNChars: v.combine_under_n_chars,
                coordinates: v.coordinates,
                encoding: v.encoding,
                ...(v.extract_image_block_types === undefined
                    ? null
                    : { extractImageBlockTypes: v.extract_image_block_types }),
                gzUncompressedContentType: v.gz_uncompressed_content_type,
                hiResModelName: v.hi_res_model_name,
                includeOrigElements: v.include_orig_elements,
                includePageBreaks: v.include_page_breaks,
                ...(v.languages === undefined ? null : { languages: v.languages }),
                maxCharacters: v.max_characters,
                multipageSections: v.multipage_sections,
                newAfterNChars: v.new_after_n_chars,
                ...(v.ocr_languages === undefined ? null : { ocrLanguages: v.ocr_languages }),
                outputFormat: v.output_format,
                overlap: v.overlap,
                overlapAll: v.overlap_all,
                pdfInferTableStructure: v.pdf_infer_table_structure,
                similarityThreshold: v.similarity_threshold,
                ...(v.skip_infer_table_types === undefined
                    ? null
                    : { skipInferTableTypes: v.skip_infer_table_types }),
                splitPdfConcurrencyLevel: v.split_pdf_concurrency_level,
                splitPdfPage: v.split_pdf_page,
                startingPageNumber: v.starting_page_number,
                strategy: v.strategy,
                uniqueElementIds: v.unique_element_ids,
                xmlKeepTags: v.xml_keep_tags,
            };
        });

    export type Outbound = {
        files: Files$.Outbound | Blob;
        chunking_strategy: string | null;
        combine_under_n_chars: number | null;
        coordinates: boolean;
        encoding: string | null;
        extract_image_block_types?: Array<string> | undefined;
        gz_uncompressed_content_type: string | null;
        hi_res_model_name: string | null;
        include_orig_elements: boolean | null;
        include_page_breaks: boolean;
        languages?: Array<string> | undefined;
        max_characters: number | null;
        multipage_sections: boolean;
        new_after_n_chars: number | null;
        ocr_languages?: Array<string> | undefined;
        output_format: string;
        overlap: number;
        overlap_all: boolean;
        pdf_infer_table_structure: boolean;
        similarity_threshold: number | null;
        skip_infer_table_types?: Array<string> | undefined;
        split_pdf_concurrency_level: number;
        split_pdf_page: boolean;
        starting_page_number: number | null;
        strategy: string;
        unique_element_ids: boolean;
        xml_keep_tags: boolean;
    };

    export const outboundSchema: z.ZodType<Outbound, z.ZodTypeDef, PartitionParameters> = z
        .object({
            files: z.lazy(() => Files$.outboundSchema).or(blobLikeSchema),
            chunkingStrategy: z.nullable(ChunkingStrategy$.outboundSchema).default(null),
            combineUnderNChars: z.nullable(z.number().int()).default(null),
            coordinates: z.boolean().default(false),
            encoding: z.nullable(z.string()).default(null),
            extractImageBlockTypes: z.array(z.string()).optional(),
            gzUncompressedContentType: z.nullable(z.string()).default(null),
            hiResModelName: z.nullable(z.string()).default(null),
            includeOrigElements: z.nullable(z.boolean()).default(null),
            includePageBreaks: z.boolean().default(false),
            languages: z.array(z.string()).optional(),
            maxCharacters: z.nullable(z.number().int()).default(null),
            multipageSections: z.boolean().default(true),
            newAfterNChars: z.nullable(z.number().int()).default(null),
            ocrLanguages: z.array(z.string()).optional(),
            outputFormat: OutputFormat$.outboundSchema.default(OutputFormat.ApplicationJson),
            overlap: z.number().int().default(0),
            overlapAll: z.boolean().default(false),
            pdfInferTableStructure: z.boolean().default(true),
            similarityThreshold: z.nullable(z.number()).default(null),
            skipInferTableTypes: z.array(z.string()).optional(),
            splitPdfConcurrencyLevel: z.number().int().default(5),
            splitPdfPage: z.boolean().default(false),
            startingPageNumber: z.nullable(z.number().int()).default(null),
            strategy: Strategy$.outboundSchema.default(Strategy.Auto),
            uniqueElementIds: z.boolean().default(false),
            xmlKeepTags: z.boolean().default(false),
        })
        .transform((v) => {
            return {
                files: v.files,
                chunking_strategy: v.chunkingStrategy,
                combine_under_n_chars: v.combineUnderNChars,
                coordinates: v.coordinates,
                encoding: v.encoding,
                ...(v.extractImageBlockTypes === undefined
                    ? null
                    : { extract_image_block_types: v.extractImageBlockTypes }),
                gz_uncompressed_content_type: v.gzUncompressedContentType,
                hi_res_model_name: v.hiResModelName,
                include_orig_elements: v.includeOrigElements,
                include_page_breaks: v.includePageBreaks,
                ...(v.languages === undefined ? null : { languages: v.languages }),
                max_characters: v.maxCharacters,
                multipage_sections: v.multipageSections,
                new_after_n_chars: v.newAfterNChars,
                ...(v.ocrLanguages === undefined ? null : { ocr_languages: v.ocrLanguages }),
                output_format: v.outputFormat,
                overlap: v.overlap,
                overlap_all: v.overlapAll,
                pdf_infer_table_structure: v.pdfInferTableStructure,
                similarity_threshold: v.similarityThreshold,
                ...(v.skipInferTableTypes === undefined
                    ? null
                    : { skip_infer_table_types: v.skipInferTableTypes }),
                split_pdf_concurrency_level: v.splitPdfConcurrencyLevel,
                split_pdf_page: v.splitPdfPage,
                starting_page_number: v.startingPageNumber,
                strategy: v.strategy,
                unique_element_ids: v.uniqueElementIds,
                xml_keep_tags: v.xmlKeepTags,
            };
        });
}
