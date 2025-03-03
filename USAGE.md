<!-- Start SDK Example Usage [usage] -->
```typescript
import { openAsBlob } from "node:fs";
import { UnstructuredClient } from "unstructured-client";
import {
  PartitionParametersSchemasStrategy,
  PartitionParametersStrategy,
} from "unstructured-client/sdk/models/shared";

const unstructuredClient = new UnstructuredClient();

async function run() {
  const result = await unstructuredClient.general.partition({
    partitionParameters: {
      files: await openAsBlob("example.file"),
      chunkingStrategy: "by_title",
      splitPdfPageRange: [
        1,
        10,
      ],
      vlmModel: PartitionParametersStrategy.Gpt4o,
      vlmModelProvider: PartitionParametersSchemasStrategy.Openai,
    },
  });

  // Handle the result
  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->