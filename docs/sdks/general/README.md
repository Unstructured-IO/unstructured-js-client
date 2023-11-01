# General
(*general*)

### Available Operations

* [partition](#partition) - Pipeline 1

## partition

Pipeline 1

### Example Usage

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

### Parameters

| Parameter                                                                | Type                                                                     | Required                                                                 | Description                                                              |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `request`                                                                | [shared.PartitionParameters](../../models/shared/partitionparameters.md) | :heavy_check_mark:                                                       | The request object to use for the request.                               |
| `retries`                                                                | [utils.RetryConfig](../../models/utils/retryconfig.md)                   | :heavy_minus_sign:                                                       | Configuration to override the default retry behavior of the client.      |
| `config`                                                                 | [AxiosRequestConfig](https://axios-http.com/docs/req_config)             | :heavy_minus_sign:                                                       | Available config options for making requests.                            |


### Response

**Promise<[operations.PartitionResponse](../../models/operations/partitionresponse.md)>**

