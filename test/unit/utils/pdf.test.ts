import { PDFDocument } from "pdf-lib";
import { readFileSync } from "node:fs";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  loadPdf,
  pdfPagesToBlob,
  splitPdf,
} from "../../../src/hooks/custom/utils";
import { getOptimalSplitSize } from "../../../src/hooks/custom/utils";
import { MAX_PAGES_PER_THREAD, MIN_PAGES_PER_THREAD } from "../../../src/hooks/custom/common.js";

describe("Pdf utility functions", () => {
  const filename = "test/data/layout-parser-paper.pdf";
  let file: Buffer;
  let pdf: PDFDocument;

  beforeEach(async () => {
    file = readFileSync(filename);
    pdf = await PDFDocument.load(file);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("pdfPagesToBlob", () => {
    it("should convert range of pages to a Blob object", async () => {
      const copyMock = vi.spyOn(PDFDocument.prototype, "copyPages");
      const saveMock = vi.spyOn(PDFDocument.prototype, "save");
      const addMock = vi.spyOn(PDFDocument.prototype, "addPage");

      // Call the method
      const result = await pdfPagesToBlob(pdf, 4, 8);

      // Verify the expected behavior
      expect(copyMock).toHaveBeenCalledWith(pdf, [3, 4, 5, 6, 7]);
      expect(saveMock).toHaveBeenCalled();
      expect(addMock).toHaveBeenCalledTimes(5);
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toEqual("application/pdf");
    });
  });

  describe("getOptimalSplitSize", () => {
    it("should return the maximum pages per thread when pagesCount is high", async () => {
      const result = await getOptimalSplitSize(100, 4);
      expect(result).toBe(MAX_PAGES_PER_THREAD);
    });

    it("should return the minimum pages per thread when pagesCount is low", async () => {
      const result = await getOptimalSplitSize(2, 4);
      expect(result).toBe(MIN_PAGES_PER_THREAD);
    });

    it("should return an appropriate split size for a given pagesCount and concurrencyLevel", async () => {
      const result = await getOptimalSplitSize(10, 3);
      expect(result).toBe(Math.ceil(10 / 3));
    });
  });

  describe("splitPdf", () => {
    it("should split the PDF into one batch", async () => {
      const result = await splitPdf(pdf, 16);

      expect(result).toHaveLength(1);
      expect(result[0]?.startPage).toBe(1);
      expect(result[0]?.endPage).toBe(16);
    });

    it("should split the PDF into 3 batches", async () => {
      const result = await splitPdf(pdf, 6);

      // Verify the expected behavior
      expect(result).toHaveLength(3);
      expect(result[0]?.startPage).toBe(1);
      expect(result[0]?.endPage).toBe(6);
      expect(result[1]?.startPage).toBe(7);
      expect(result[1]?.endPage).toBe(12);
      expect(result[2]?.startPage).toBe(13);
      expect(result[2]?.endPage).toBe(16);
    });

    it("should split the PDF into 4 batches", async () => {
      const result = await splitPdf(pdf, 4);

      // Verify the expected behavior
      expect(result).toHaveLength(4);
      expect(result[0]?.startPage).toBe(1);
      expect(result[0]?.endPage).toBe(4);
      expect(result[1]?.startPage).toBe(5);
      expect(result[1]?.endPage).toBe(8);
      expect(result[2]?.startPage).toBe(9);
      expect(result[2]?.endPage).toBe(12);
      expect(result[3]?.startPage).toBe(13);
      expect(result[3]?.endPage).toBe(16);
    });
  });

  describe("loadPdf", () => {
    it("should return true, null, and 0 if the file is null", async () => {
      const result = await loadPdf(null);

      expect(result).toEqual([true, null, 0]);
    });

    it("should return true, null, and 0 if the file is not a PDF", async () => {
      const file = {
        name: "document.txt",
        content: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
      };

      const result = await loadPdf(file as any);

      expect(result).toEqual([true, null, 0]);
      expect(file.content).not.toHaveBeenCalled();
    });

    it("should return true, null, and 0 if the file is not a PDF without basing on file extension", async () => {
      const file = {
        name: "uuid1234",
        content: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
      };

      const result = await loadPdf(file as any);

      expect(result).toEqual([true, null, 0]);
      expect(file.content).not.toHaveBeenCalled();
    });


    it("should return true, null, and 0 if there is an error while loading the PDF", async () => {
      const file = {
        name: "document.pdf",
        arrayBuffer: vi.fn().mockRejectedValue(new ArrayBuffer(0)),
      };

      const result = await loadPdf(file as any);

      expect(result).toEqual([true, null, 0]);
      expect(file.arrayBuffer).toHaveBeenCalled();
    });

    it("should return false, PDFDocument object, and the number of pages if the PDF is loaded successfully", async () => {
      const file = readFileSync("test/data/layout-parser-paper-fast.pdf");
      const f = {
        name: "document.pdf",
        arrayBuffer: () => file.buffer,
      };

      const loadMock = vi.spyOn(PDFDocument, "load");

      const [error, _, pages] = await loadPdf(f as any);

      expect(error).toBeFalsy();
      expect(pages).toEqual(2);
      expect(loadMock).toHaveBeenCalledTimes(1);
      expect(loadMock).toHaveBeenCalledWith(f.arrayBuffer());
    });

    it("should return false, PDFDocument object, and the number of pages if the PDF is loaded successfully without basing on file extension", async () => {
      const file = readFileSync("test/data/layout-parser-paper-fast.pdf");
      const f = {
        name: "uuid1234",
        arrayBuffer: () => file.buffer,
      };

      vi.clearAllMocks(); // Reset Mocks Between Tests
      const loadMock = vi.spyOn(PDFDocument, "load");

      const [error, _, pages] = await loadPdf(f as any);

      expect(error).toBeFalsy();
      expect(pages).toEqual(2);
      expect(loadMock).toHaveBeenCalledTimes(1);
      expect(loadMock).toHaveBeenCalledWith(f.arrayBuffer());
    });

  });
});
