<!-- Start SDK Example Usage [usage] -->
```typescript
import { openAsBlob } from "node:fs";
import { UnstructuredClient } from "unstructured-client";

const unstructuredClient = new UnstructuredClient({
    security: {
        apiKeyAuth: "YOUR_API_KEY",
    },
});

async function run() {
    const result = await unstructuredClient.general.partition({
        chunkingStrategy: "by_title",
        combineUnderNChars: 500,
        encoding: "utf-8",
        extractImageBlockTypes: ["image", "table"],
        files: await openAsBlob("./sample-file"),
        gzUncompressedContentType: "application/pdf",
        hiResModelName: "yolox",
        languages: ["[", "e", "n", "g", "]"],
        maxCharacters: 1500,
        newAfterNChars: 1500,
        outputFormat: "application/json",
        overlap: 25,
        skipInferTableTypes: ["pdf"],
        strategy: "hi_res",
    });

    // Handle the result
    console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->