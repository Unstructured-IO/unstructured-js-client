# General
(*general*)

## Overview

### Available Operations

* [partition](#partition) - Summary

## partition

Description

### Example Usage

<!-- UsageSnippet language="typescript" operationID="partition" method="post" path="/general/v0/general" -->
```typescript
import { openAsBlob } from "node:fs";
import { UnstructuredClient } from "unstructured-client";
import { Strategy, VLMModel, VLMModelProvider } from "unstructured-client/sdk/models/shared";

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
      strategy: Strategy.Auto,
      vlmModel: VLMModel.Gpt4o,
      vlmModelProvider: VLMModelProvider.Openai,
    },
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { openAsBlob } from "node:fs";
import { UnstructuredClientCore } from "unstructured-client/core.js";
import { generalPartition } from "unstructured-client/funcs/generalPartition.js";
import { Strategy, VLMModel, VLMModelProvider } from "unstructured-client/sdk/models/shared";

// Use `UnstructuredClientCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const unstructuredClient = new UnstructuredClientCore();

async function run() {
  const res = await generalPartition(unstructuredClient, {
    partitionParameters: {
      chunkingStrategy: "by_title",
      files: await openAsBlob("example.file"),
      splitPdfPageRange: [
        1,
        10,
      ],
      strategy: Strategy.Auto,
      vlmModel: VLMModel.Gpt4o,
      vlmModelProvider: VLMModelProvider.Openai,
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("generalPartition failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.PartitionRequest](../../sdk/models/operations/partitionrequest.md)                                                                                                 | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.PartitionResponse](../../sdk/models/operations/partitionresponse.md)\>**

### Errors

| Error Type                 | Status Code                | Content Type               |
| -------------------------- | -------------------------- | -------------------------- |
| errors.HTTPValidationError | 422                        | application/json           |
| errors.ServerError         | 5XX                        | application/json           |
| errors.SDKError            | 4XX                        | \*/\*                      |