import { readFileSync } from "fs";

import { UnstructuredClient } from "../../src";
import { PartitionResponse } from "../../src/sdk/models/operations";
import { PartitionParameters, Strategy } from "../../src/sdk/models/shared";

const localServer = "http://localhost:8000"

describe("HttpsCheckHook integration tests", () => {
    const FAKE_API_KEY = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

    it.each([
        localServer,
      `${localServer}/general/v0/general`,
    ])("should throw error when given filename is empty", async (serverURL) => {
        const client = new UnstructuredClient({
            serverURL: serverURL,
            security: {
                apiKeyAuth: FAKE_API_KEY,
            },
        });

        const file = {
            content: readFileSync("test/data/layout-parser-paper-fast.pdf"),
            fileName: "test/data/layout-parser-paper-fast.pdf",
        };

        const requestParams: PartitionParameters = {
            files: file,
            strategy: Strategy.Fast,
        };

        const res: PartitionResponse = await client.general.partition({
            partitionParameters: {
                ...requestParams,
                splitPdfPage: false,
            },
        });

        expect(res.statusCode).toEqual(200);
    });
});