import { readFileSync } from "fs";

import { UnstructuredClient } from "../../src";
import { PartitionResponse } from "../../src/sdk/models/operations";

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
    },
    {
      filename: "test/data/list-item-example-1.pdf",
      expectedOk: true,
      requestsLimit: 2,
      description: "single paged PDF",
    },
    {
      filename: "test/data/list-item-example-1.pdf",
      expectedOk: true,
      requestsLimit: 5,
      description: "single paged PDF",
    },
    {
      filename: "test/data/layout-parser-paper-fast.pdf",
      expectedOk: true,
      requestsLimit: 1,
      description: "multi paged small PDF",
    },
    {
      filename: "test/data/layout-parser-paper-fast.pdf",
      expectedOk: true,
      requestsLimit: 2,
      description: "multi paged small PDF",
    },
    {
      filename: "test/data/layout-parser-paper-fast.pdf",
      expectedOk: true,
      requestsLimit: 5,
      description: "multi paged small PDF",
    },
    {
      filename: "test/data/layout-parser-paper.pdf",
      expectedOk: true,
      requestsLimit: 1,
      description: "multi paged big PDF",
    },
    {
      filename: "test/data/layout-parser-paper.pdf",
      expectedOk: true,
      requestsLimit: 2,
      description: "multi paged big PDF",
    },
    {
      filename: "test/data/layout-parser-paper.pdf",
      expectedOk: true,
      requestsLimit: 5,
      description: "multi paged big PDF",
    },
    {
      filename: "test/data/fake.doc",
      expectedOk: true,
      requestsLimit: 1,
      description: "not PDF file",
    },
    {
      filename: "test/data/fake.doc",
      expectedOk: true,
      requestsLimit: 2,
      description: "not PDF file",
    },
    {
      filename: "test/data/fake.doc",
      expectedOk: true,
      requestsLimit: 5,
      description: "not PDF file",
    },
    {
      filename: "test/data/fake.doc",
      expectedOk: false,
      requestsLimit: 1,
      description: "fake PDF file (wrong content)",
    },
    {
      filename: "test/data/fake.doc",
      expectedOk: false,
      requestsLimit: 2,
      description: "fake PDF file (wrong content)",
    },
    {
      filename: "test/data/fake.doc",
      expectedOk: false,
      requestsLimit: 5,
      description: "fake PDF file (wrong content)",
    },
  ])(
    "for request limit $requestsLimit and $description",
    async ({ filename, expectedOk, requestsLimit }) => {
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

      process.env["UNSTRUCTURED_CLIENT_SPLIT_CALL_THREADS"] =
        requestsLimit.toString();

      const requestParams = {
        files: file,
        strategy: "fast",
        languages: ["eng"],
      };

      let respSplit: PartitionResponse;
      try {
        respSplit = await client.general.partition({
          ...requestParams,
          splitPdfPage: true,
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
        ...requestParams,
        splitPdfPage: false,
      });

      expect(respSplit.elements?.length).toEqual(respSingle.elements?.length);
      expect(respSplit.contentType).toEqual(respSingle.contentType);
      expect(respSplit.statusCode).toEqual(respSingle.statusCode);

      // Remove 'parent_id' and (temporarily) 'page_number' metadata
      const splitElements = respSplit.elements?.map((el) => ({
        ...el,
        metadata: {
          ...el.metadata,
          parent_id: undefined,
          page_number: undefined,
        },
      }));
      const singleElements = respSingle.elements?.map((el) => ({
        ...el,
        metadata: {
          ...el.metadata,
          parent_id: undefined,
          page_number: undefined,
        },
      }));

      expect(JSON.stringify(splitElements)).toEqual(
        JSON.stringify(singleElements)
      );
    },
    30000
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
      strategy: "fast",
      languages: ["eng"],
    };

    await expect(async () => {
      await client.general.partition({
        ...requestParams,
        splitPdfPage: true,
      });
    }).rejects.toThrow(/.*File type None is not supported.*/);
  });
});
