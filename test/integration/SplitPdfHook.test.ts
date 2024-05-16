import { readFileSync } from "fs";

import { UnstructuredClient } from "../../src";
import { PartitionResponse } from "../../src/sdk/models/operations";
import { PartitionParameters, Strategy } from "../../src/sdk/models/shared";

describe("SplitPdfHook integration tests check splitted file is same as not splitted", () => {
  const FAKE_API_KEY = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const consoleWarnSpy = jest.spyOn(console, "warn");
  const consoleErrorSpy = jest.spyOn(console, "error");

  beforeEach(() => {
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
      try {
        const res = await fetch("http://localhost:8000/general/docs");
        expect(res.status).toEqual(200);
      } catch {
        throw Error("The unstructured-api is not running on localhost:8000");
      }

      const client = new UnstructuredClient({
        serverURL: "http://localhost:8000",
        security: {
          apiKeyAuth: FAKE_API_KEY,
        },
      });

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
            splitPdfThreads: requestsLimit,
          },
        });
      } catch (e) {
        if (!expectedOk) {
          expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
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
          ...el.metadata,
          parent_id: undefined,
        },
      }));
      const singleElements = respSingle.elements?.map((el) => ({
        ...el,
        metadata: {
          ...el.metadata,
          parent_id: undefined,
        },
      }));
      
      expect(JSON.stringify(splitElements)).toEqual(
        JSON.stringify(singleElements)
      );
    },
    300000
  );

  it("should throw error when given filename is empty", async () => {
    try {
      const res = await fetch("http://localhost:8000/general/docs");
      expect(res.status).toEqual(200);
    } catch {
      throw Error("The unstructured-api is not running on localhost:8000");
    }

    const client = new UnstructuredClient({
      serverURL: "http://localhost:8000",
      security: {
        apiKeyAuth: FAKE_API_KEY,
      },
    });

    const file = {
      content: readFileSync("test/data/layout-parser-paper-fast.pdf"),
      fileName: "    ",
    };

    const requestParams = {
      files: file,
      strategy: Strategy.Fast,
      languages: ["eng"],
    };

    await expect(async () => {
      await client.general.partition({
        partitionParameters: {
          ...requestParams,
          splitPdfPage: true,
        },
      });
    }).rejects.toThrow(/.*File type None is not supported.*/);
  });
});
