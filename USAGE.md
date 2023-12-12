<!-- Start SDK Example Usage [usage] -->
```typescript
import { UnstructuredClient } from "unstructured-client";

async function run() {
    const sdk = new UnstructuredClient({
        security: {
            apiKeyAuth: "YOUR_API_KEY",
        },
    });

    const res = await sdk.general.partition({
        chunkingStrategy: "by_title",
        combineUnderNChars: 500,
        encoding: "utf-8",
        files: {
            content: new TextEncoder().encode("0x2cC94b2FEF"),
            fileName: "um.shtml",
        },
        gzUncompressedContentType: "application/pdf",
        hiResModelName: "yolox",
        languages: ["[", "e", "n", "g", "]"],
        maxCharacters: 1500,
        newAfterNChars: 1500,
        outputFormat: "application/json",
        skipInferTableTypes: ["pdf"],
        strategy: "hi_res",
    });

    if (res.statusCode == 200) {
        // handle response
    }
}

run();

```
<!-- End SDK Example Usage [usage] -->