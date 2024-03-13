# General
(*general*)

### Available Operations

* [partition](#partition) - Pipeline 1

## partition

Pipeline 1

### Example Usage

```typescript
import { openAsBlob } from "node:fs";
import { UnstructuredClient } from "unstructured-client";

async function run() {
  const sdk = new UnstructuredClient({
    apiKeyAuth: "YOUR_API_KEY",
  });

  const result = await sdk.general.partition({
    chunkingStrategy: "by_title",
    combineUnderNChars: 500,
    encoding: "utf-8",
    extractImageBlockTypes: [
      "image",
      "table",
    ],
    files: await openAsBlob("./sample-file"),
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
    overlap: 25,
    overlapAll: true,
    skipInferTableTypes: [
      "pdf",
    ],
    strategy: "hi_res",
  });

  // Handle the result
  console.log(result)
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [components.PartitionParameters](../../sdk/models/components/partitionparameters.md)                                                                                           | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |


### Response

**Promise<[operations.PartitionResponse](../../sdk/models/operations/partitionresponse.md)>**
### Errors

| Error Object               | Status Code                | Content Type               |
| -------------------------- | -------------------------- | -------------------------- |
| errors.HTTPValidationError | 422                        | application/json           |
| errors.SDKError            | 4xx-5xx                    | */*                        |
