# General
(*general*)

### Available Operations

* [partition](#partition) - Pipeline 1

## partition

Pipeline 1

### Example Usage

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
    content: "unde".encode(),
    files: "nulla",
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

### Parameters

| Parameter                                                                | Type                                                                     | Required                                                                 | Description                                                              |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `request`                                                                | [shared.PartitionParameters](../../models/shared/partitionparameters.md) | :heavy_check_mark:                                                       | The request object to use for the request.                               |
| `retries`                                                                | [utils.RetryConfig](../../models/utils/retryconfig.md)                   | :heavy_minus_sign:                                                       | Configuration to override the default retry behavior of the client.      |
| `config`                                                                 | [AxiosRequestConfig](https://axios-http.com/docs/req_config)             | :heavy_minus_sign:                                                       | Available config options for making requests.                            |


### Response

**Promise<[operations.PartitionResponse](../../models/operations/partitionresponse.md)>**

