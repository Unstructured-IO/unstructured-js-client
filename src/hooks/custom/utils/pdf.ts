import { PDFDocument } from "pdf-lib";

import { MAX_PAGES_PER_THREAD, MIN_PAGES_PER_THREAD } from "../common.js";

interface PdfSplit {
  content: Blob;
  startPage: number;
  endPage: number;
}

/**
 * Converts range of pages (including start and end page values) of a PDF document
 * to a Blob object.
 * @param pdf - The PDF document.
 * @param startPage - Number of the first page of split.
 * @param endPage - Number of the last page of split.
 * @returns A Promise that resolves to a Blob object representing the converted pages.
 */
export async function pdfPagesToBlob(
  pdf: PDFDocument,
  startPage: number,
  endPage: number
): Promise<Blob> {
  const subPdf = await PDFDocument.create();
  // Create an array with page indices to copy
  // Converts 1-based page numbers to 0-based page indices
  const pageIndices = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index - 1
  );
  const pages = await subPdf.copyPages(pdf, pageIndices);
  for (const page of pages) {
    subPdf.addPage(page);
  }
  const subPdfBytes = await subPdf.save();
  return new Blob([subPdfBytes], {
    type: "application/pdf",
  });
}

/**
 * Calculates the optimal split size for processing pages with a specified concurrency level.
 *
 * @param pagesCount - The total number of pages to process.
 * @param concurrencyLevel - The level of concurrency to be used.
 * @returns A promise that resolves to the optimal number of pages per split,
 * ensuring it does not exceed the maximum or fall below the minimum threshold.
 */
export async function getOptimalSplitSize(
    pagesCount: number,
    concurrencyLevel: number
): Promise<number> {
  let splitSize = MAX_PAGES_PER_THREAD;
  if (pagesCount < MAX_PAGES_PER_THREAD * concurrencyLevel) {
    splitSize = Math.ceil(pagesCount / concurrencyLevel);
  }
  splitSize = Math.max(splitSize, MIN_PAGES_PER_THREAD);

  return splitSize;
}


/**
 * Retrieves an array of splits, with the start and end page numbers, from a PDF file.
 * Distribution of pages per split is made in as much uniform manner as possible.
 *
 * @param pdf - The PDF file to extract pages from.
 * @param splitSize - The number of pages per split.
 * @param [pageRangeStart=1] - The starting page of the range to be split (1-based index). Defaults to the first page of the document.
 * @param [pageRangeEnd=pdf.getPageCount()] - The ending page of the range to be split (1-based index). Defaults to the last page of the document.
 * @returns A promise that resolves to an array of objects containing Blob files and
 * start and end page numbers from the original document.
 */
export async function splitPdf(
  pdf: PDFDocument,
  splitSize: number,
  pageRangeStart?: number,
  pageRangeEnd?: number
): Promise<PdfSplit[]> {
  const pdfSplits: PdfSplit[] = [];

  const startPage = pageRangeStart || 1;
  const endPage = pageRangeEnd || pdf.getPageCount();
  const pagesCount = endPage - startPage + 1

  const numberOfSplits = Math.ceil(pagesCount / splitSize);

  for (let i = 0; i < numberOfSplits; ++i) {
    const offset = i * splitSize;
    const splitStartPage = offset + startPage;
    const splitEndPage = Math.min(endPage, splitStartPage + splitSize - 1);

    const pdfSplit = await pdfPagesToBlob(pdf, splitStartPage, splitEndPage);
    pdfSplits.push({ content: pdfSplit, startPage: splitStartPage, endPage: splitEndPage });
  }

  return pdfSplits;
}

/**
 * Checks if the given file is a PDF by loading the file as a PDF using the `PDFDocument.load` method.
 * @param file - The file to check.
 * @returns A promise that resolves to three values, first is a boolean representing
 * whether there was an error during PDF load, second is a PDFDocument object or null
 * (depending if there was an error), and the third is the number of pages in the PDF.
 * The number of pages is 0 if there was an error while loading the file.
 */
export async function loadPdf(
  file: File | null
): Promise<[boolean, PDFDocument | null, number]> {
  if (!file) {
    return [true, null, 0];
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pagesCount = pdf.getPages().length;
    return [false, pdf, pagesCount];
  } catch (e) {
    return [true, null, 0];
  }
}
