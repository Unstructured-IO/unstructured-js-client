<!-- Start SDK Example Usage [usage] -->
```typescript
import { openAsBlob } from "node:fs";
import { UnstructuredClient } from "unstructured-client";
import {
  ChunkingStrategy,
  Strategy,
} from "unstructured-client/sdk/models/shared";

const unstructuredClient = new UnstructuredClient();

async function run() {
  const result = await unstructuredClient.general.partition({
    partitionParameters: {
      files: await openAsBlob("example.file"),
      chunkingStrategy: ChunkingStrategy.ByTitle,
      splitPdfPageRange: [
        1,
        10,
      ],
      strategy: Strategy.HiRes,
    },
  });

  // Handle the result
  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->