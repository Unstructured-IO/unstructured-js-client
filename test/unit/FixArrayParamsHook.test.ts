import { readFileSync } from "fs";

import { UnstructuredClient } from "../../src";
import { PartitionResponse } from "../../src/sdk/models/operations";
import { PartitionParameters, Strategy } from "../../src/sdk/models/shared";
import { describe, it, expect, vi, beforeEach} from 'vitest';

describe("FixArrayParamsHook unit tests", () => {
    beforeEach(() => {
        // Reset the mock before each test
        vi.resetAllMocks();
    });

    const FAKE_API_KEY = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

    // Assert that array parameters are sent in the correct format
    // This should work with and without pdf splitting
    it.each([
      {splitPdfPage: false},
      {splitPdfPage: true},
    ])(
    "should send extract_image_block_types in the correct format", async ({splitPdfPage}) => {
      const client = new UnstructuredClient({});

      const file = {
        content: readFileSync("test/data/layout-parser-paper-fast.pdf"),
        fileName: "test/data/layout-parser-paper-fast.pdf",
      };

      const requestParams: PartitionParameters = {
        files: file,
        strategy: Strategy.Fast,
        extractImageBlockTypes: ["a", "b", "c"],
        splitPdfPage: splitPdfPage,
      };

      const fetchMock = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify([
            {
              type: "Image",
              element_id: "2fe9cbfbf0ff1bd64cc4705347dbd1d6",
              text: "This is a test",
              metadata: {},
            },
          ]),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        )
      );

      vi.stubGlobal("fetch", fetchMock);

      const res: PartitionResponse = await client.general.partition({
        partitionParameters: requestParams,
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);

      const request = fetchMock.mock.calls[0][0];
      const formData = await request.formData();
      const extract_image_block_types = formData.getAll(
        "extract_image_block_types[]"
      );

      expect(extract_image_block_types).toEqual(["a", "b", "c"]);
    });
});
