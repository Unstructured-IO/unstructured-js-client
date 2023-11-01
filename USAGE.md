<!-- Start SDK Example Usage -->


```typescript
import { UnstructuredClient } from "unstructured-client";

(async() => {
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
      content: "+WmI5Q)|yy" as bytes <<<>>>,
      files: "string",
    },
    gzUncompressedContentType: "application/pdf",
    hiResModelName: "yolox",
    languages: [
      "[",
      "e",
      "n",
      "g",
      "]",
    ],
    maxCharacters: 1500,
    newAfterNChars: 1500,
    outputFormat: "application/json",
    skipInferTableTypes: [
      "p",
      "d",
      "f",
    ],
    strategy: "hi_res",
  });


  if (res.statusCode == 200) {
    // handle response
  }
})();
```
<!-- End SDK Example Usage -->