<!-- Start SDK Example Usage -->


```typescript
import { UnstructuredClient } from "unstructured-client";
import { PartitionResponse } from "unstructured-client/dist/sdk/models/operations";

const sdk = new UnstructuredClient({
  security: {
    apiKeyAuth: "YOUR_API_KEY",
  },
});

sdk.general.partition({
  coordinates: false,
  encoding: "utf-8",
  files: {
    content: "corrupti".encode(),
    files: "provident",
  },
  gzUncompressedContentType: "application/pdf",
  hiResModelName: "yolox",
  includePageBreaks: false,
  ocrLanguages: [
    "eng",
  ],
  outputFormat: "application/json",
  pdfInferTableStructure: false,
  skipInferTableTypes: [
    "pdf",
  ],
  strategy: "hi_res",
  xmlKeepTags: false,
}).then((res: PartitionResponse) => {
  if (res.statusCode == 200) {
    // handle response
  }
});
```
<!-- End SDK Example Usage -->