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
  chunkingStrategy: "by_title",
  combineUnderNChars: 500,
  coordinates: false,
  encoding: "utf-8",
  files: {
    content: "+WmI5Q)|yy" as bytes <<<>>>,
    files: "um",
  },
  gzUncompressedContentType: "application/pdf",
  hiResModelName: "yolox",
  includePageBreaks: false,
  languages: [
    "eng",
  ],
  multipageSections: false,
  newAfterNChars: 1500,
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