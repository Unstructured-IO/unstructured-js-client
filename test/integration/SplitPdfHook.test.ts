import { readFileSync } from "fs";

import { UnstructuredClient } from "../../src";
import { PartitionResponse } from "../../src/sdk/models/operations";
import { PartitionParameters, Strategy } from "../../src/sdk/models/shared";

const localServer = "http://localhost:8000"

describe("SplitPdfHook integration tests check splitted file is same as not splitted", () => {
  const FAKE_API_KEY = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const consoleInfoSpy = jest.spyOn(console, "info");
  const consoleWarnSpy = jest.spyOn(console, "warn");
  const consoleErrorSpy = jest.spyOn(console, "error");

  let client = new UnstructuredClient({
    serverURL: localServer,
    security: {
      apiKeyAuth: FAKE_API_KEY,
    },
  });

  beforeEach(async () => {
    try {
        const res = await fetch(`${localServer}/general/docs`);
      expect(res.status).toEqual(200);
    } catch {
        throw Error(`The unstructured-api is not running on ${localServer}`);
    }

    client = new UnstructuredClient({
      serverURL: localServer,
      security: {
        apiKeyAuth: FAKE_API_KEY,
      },
    });
  });

  afterEach(() => {
    consoleInfoSpy.mockClear();
    consoleWarnSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  it.each([
    {
      filename: "test/data/list-item-example-1.pdf",
      expectedOk: true,
      requestsLimit: 1,
      description: "single paged PDF",
      strategy: Strategy.Fast,
    },
    {
      filename: "test/data/list-item-example-1.pdf",
      expectedOk: true,
      requestsLimit: 2,
      description: "single paged PDF",
      strategy: Strategy.Fast,
    },
    {
      filename: "test/data/list-item-example-1.pdf",
      expectedOk: true,
      requestsLimit: 5,
      description: "single paged PDF",
      strategy: Strategy.Fast,
    },
    {
      filename: "test/data/layout-parser-paper-fast.pdf",
      expectedOk: true,
      requestsLimit: 1,
      description: "multi paged small PDF",
      strategy: Strategy.Fast,
    },
    {
      filename: "test/data/layout-parser-paper-fast.pdf",
      expectedOk: true,
      requestsLimit: 2,
      description: "multi paged small PDF",
      strategy: Strategy.Fast,
    },
    {
      filename: "test/data/layout-parser-paper-fast.pdf",
      expectedOk: true,
      requestsLimit: 5,
      description: "multi paged small PDF",
      strategy: Strategy.Fast,
    },
    // NOTE(Marek Połom): using "fast" strategy fails on this file for unknown reasons
    {
      filename: "test/data/layout-parser-paper.pdf",
      expectedOk: true,
      requestsLimit: 1,
      description: "multi paged big PDF",
      strategy: Strategy.HiRes,
    },
    {
      filename: "test/data/layout-parser-paper.pdf",
      expectedOk: true,
      requestsLimit: 2,
      description: "multi paged big PDF",
      strategy: Strategy.HiRes,
    },
    {
      filename: "test/data/layout-parser-paper.pdf",
      expectedOk: true,
      requestsLimit: 5,
      description: "multi paged big PDF",
      strategy: Strategy.HiRes,
    },
    {
      filename: "test/data/fake.doc",
      expectedOk: true,
      requestsLimit: 1,
      description: "not PDF file",
      strategy: Strategy.Fast,
    },
    {
      filename: "test/data/fake.doc",
      expectedOk: true,
      requestsLimit: 2,
      description: "not PDF file",
      strategy: Strategy.Fast,
    },
    {
      filename: "test/data/fake.doc",
      expectedOk: true,
      requestsLimit: 5,
      description: "not PDF file",
      strategy: Strategy.Fast,
    },
    {
      filename: "test/data/fake.doc",
      expectedOk: false,
      requestsLimit: 1,
      description: "fake PDF file (wrong content)",
      strategy: Strategy.Fast,
    },
    {
      filename: "test/data/fake.doc",
      expectedOk: false,
      requestsLimit: 2,
      description: "fake PDF file (wrong content)",
      strategy: Strategy.Fast,
    },
    {
      filename: "test/data/fake.doc",
      expectedOk: false,
      requestsLimit: 5,
      description: "fake PDF file (wrong content)",
      strategy: Strategy.Fast,
    },
  ])(
    "for request limit $requestsLimit and $description",
    async ({ filename, expectedOk, requestsLimit, strategy }) => {
      const file = { content: readFileSync(filename), fileName: filename };

      if (!expectedOk) {
        file.fileName += ".pdf";
      }

      const requestParams: PartitionParameters = {
        files: file,
        strategy: strategy,
        languages: ["eng"],
      };

      let respSplit: PartitionResponse;
      try {
        respSplit = await client.general.partition({
          partitionParameters: {
            ...requestParams,
            splitPdfPage: true,
            splitPdfConcurrencyLevel: requestsLimit,
          },
        });
      } catch (e) {
        if (!expectedOk) {
          expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
          expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to partition the document.");
          expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Server responded with"));
          expect(consoleInfoSpy).toHaveBeenCalledWith("Partitioning without split.");
          expect(consoleWarnSpy).toHaveBeenCalledWith(
            "Attempted to interpret file as pdf, but error arose when splitting by pages. Reverting to non-split pdf handling path."
          );
          return;
        } else {
          throw e;
        }
      }

      const respSingle = await client.general.partition({
        partitionParameters: {
          ...requestParams,
          splitPdfPage: false,
        },
      });

      expect(respSplit.elements?.length).toEqual(respSingle.elements?.length);
      expect(respSplit.contentType).toEqual(respSingle.contentType);
      expect(respSplit.statusCode).toEqual(respSingle.statusCode);

      // Remove 'parent_id' metadata
      const splitElements = respSplit.elements?.map((el) => ({
        ...el,
        metadata: {
          ...el['metadata'],
          parent_id: undefined,
        },
      }));
      const singleElements = respSingle.elements?.map((el) => ({
        ...el,
        metadata: {
          ...el['metadata'],
          parent_id: undefined,
        },
      }));

      expect(JSON.stringify(splitElements)).toEqual(
        JSON.stringify(singleElements)
      );
    },
    300000
  );

  it.each([
    {
      allowFailed: false,
    },
    {
      allowFailed: true,
    },
  ])(
    "for splitPdf request sets allow failed to $allowFailed",
    async ({ allowFailed }) => {

      const filename = "layout-parser-paper-fast.pdf";

      const file = {
        content: readFileSync(`test/data/${filename}`),
        fileName: filename,
      };

      // Make sure retries are disabled
      // (Until we fix retries happening on 500)
      client = new UnstructuredClient({
        serverURL: localServer,
        security: {
          apiKeyAuth: FAKE_API_KEY,
        },
        retryConfig: {
          strategy: "none",
        },
      });

      const requestParams = {
        files: file,
        strategy: Strategy.Fast,
        languages: ["eng"],
        contentType: "application/csv",  // Trigger an encoding error
      };

      await expect(async () => {
        await client.general.partition({
          partitionParameters: {
            ...requestParams,
            splitPdfPage: true,
            splitPdfAllowFailed: allowFailed,
          },
        });
      }).rejects.toThrow(/.*can't decode byte.*/);
    });

});

describe("SplitPdfHook integration tests page range parameter", () => {
  const FAKE_API_KEY = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const consoleInfoSpy = jest.spyOn(console, "info");
  const consoleWarnSpy = jest.spyOn(console, "warn");
  const consoleErrorSpy = jest.spyOn(console, "error");

  let client = new UnstructuredClient({
    serverURL: localServer,
    security: {
      apiKeyAuth: FAKE_API_KEY,
    },
  });

  beforeEach(async () => {
    try {
      const res = await fetch(`${localServer}/general/docs`);
      expect(res.status).toEqual(200);
    } catch {
      throw Error(`The unstructured-api is not running on ${localServer}`);
    }

    client = new UnstructuredClient({
      serverURL: localServer,
      security: {
        apiKeyAuth: FAKE_API_KEY,
      },
    });
  });

  afterEach(() => {
    consoleInfoSpy.mockClear();
    consoleWarnSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  it.each([
    { pageRange: [1, 14], expectedOk: true, expectedPages: [1, 14] }, // Valid range, start on boundary
    { pageRange: [4, 16], expectedOk: true, expectedPages: [4, 16] }, // Valid range, end on boundary
    { pageRange: [2, 5], expectedOk: true, expectedPages: [2, 5] },   // Valid range within boundary
    { pageRange: [6, 6], expectedOk: true, expectedPages: [6, 6] },   // Single page range
    { pageRange: [2, 100], expectedOk: false, expectedPages: null },  // End page too high
    { pageRange: [50, 100], expectedOk: false, expectedPages: null }, // Range too high
    { pageRange: [-50, 5], expectedOk: false, expectedPages: null },  // Start page too low
    { pageRange: [-50, -2], expectedOk: false, expectedPages: null }, // Range too low
    { pageRange: [10, 2], expectedOk: false, expectedPages: null },   // Backwards range
  ])(
    "for page range $pageRange",
    async ({ pageRange, expectedOk, expectedPages }) => {
      const filename = "test/data/layout-parser-paper.pdf";
      const file = { content: readFileSync(filename), fileName: filename };

      let startingPageNumber = 1;
      try {
        let response = await client.general.partition({
          partitionParameters: {
            files: file,
            strategy: Strategy.Fast,
            splitPdfPage: true,
            splitPdfPageRange: pageRange
          },
        });

        // Grab the set of page numbers in the result
        // Assert that all returned elements are in the expected page range
        const pageNumbers = new Set(response?.elements?.map((element: any) => element.metadata.page_number));
        const minPageNumber = expectedPages?.[0] ?? 0 + startingPageNumber - 1;
        const maxPageNumber = expectedPages?.[1] ?? 0 + startingPageNumber - 1;

        expect(Math.min(...pageNumbers)).toBe(minPageNumber);
        expect(Math.max(...pageNumbers)).toBe(maxPageNumber);
      } catch (e) {
        if (!expectedOk) {
          expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("is out of bounds"));
          return;
        } else {
          throw e;
        }
      }

    },
    300000
  );
});
