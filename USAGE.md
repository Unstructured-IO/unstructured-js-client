<!-- Start SDK Example Usage [usage] -->
```typescript
import { openAsBlob } from "node:fs";
import { UnstructuredClient } from "unstructured-client";
import {
  VLMModel,
  VLMModelProvider,
} from "unstructured-client/sdk/models/shared";

const unstructuredClient = new UnstructuredClient();

async function run() {
  const result = await unstructuredClient.general.partition({
    partitionParameters: {
      chunkingStrategy: "by_title",
      files: await openAsBlob("example.file"),
      splitPdfPageRange: [
        1,
        10,
      ],
      vlmModel: VLMModel.Gpt4o,
      vlmModelProvider: VLMModelProvider.Openai,
    },
  });

  // Handle the result
  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->