<h3 align="center">
  <img
    src="https://raw.githubusercontent.com/Unstructured-IO/unstructured/main/img/unstructured_logo.png"
    height="200"
  >
</h3>

<div align="center">
    <a href="https://speakeasyapi.dev/"><img src="https://custom-icon-badges.demolab.com/badge/-Built%20By%20Speakeasy-212015?style=for-the-badge&logoColor=FBE331&logo=speakeasy&labelColor=545454" /></a>
</div>

<h2 align="center">
  <p>TypeScript SDK for the Unstructured API</p>
</h2>

This is a HTTP client for the [Unstructured Platform API](https://docs.unstructured.io/platform-api/overview). You can sign up [here](https://unstructured.io/developers) and process 1000 free pages per day for 14 days.

Please refer to the our documentation for a full guide on integrating the [Partition Endpoint](https://docs.unstructured.io/platform-api/partition-api/sdk-jsts) into your JavaScript/TypeScript code. Support for the [Workflow Endpoint](https://docs.unstructured.io/platform-api/api/overview) is coming soon. 


## SDK Installation

### NPM

```bash
npm install unstructured-client --include=dev
```

### Yarn

```bash
yarn add unstructured-client --dev
```

### Model Context Protocol (MCP) Server

This SDK is also an installable MCP server where the various SDK methods are
exposed as tools that can be invoked by AI applications.

> Node.js v20 or greater is required to run the MCP server.

<details>
<summary>Claude installation steps</summary>

Add the following server definition to your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "Unstructured": {
      "command": "npx",
      "args": [
        "-y", "--package", "unstructured-client",
        "--",
        "mcp", "start",
      ]
    }
  }
}
```

</details>

<details>
<summary>Cursor installation steps</summary>

Go to `Cursor Settings > Features > MCP Servers > Add new MCP server` and use the following settings:

- Name: Unstructured
- Type: `command`
- Command:
```sh
npx -y --package unstructured-client -- mcp start
```

</details>

For a full list of server arguments, run:

```sh
npx -y --package unstructured-client -- mcp start --help
```

<!-- No SDK Installation -->

## SDK Example Usage

### Example

```typescript
import { UnstructuredClient } from "unstructured-client";
import { PartitionResponse } from "unstructured-client/sdk/models/operations";
import { Strategy } from "unstructured-client/sdk/models/shared";
import * as fs from "fs";

const unstructuredClient = new UnstructuredClient({
    security: {
        apiKeyAuth: "YOUR_API_KEY",
    },
});

const filename = "./sample-file";
const data = fs.readFileSync(filename);

unstructuredClient.general.partition({
    partitionParameters: {
        files: {
            content: data,
            fileName: filename,
        },
	strategy: Strategy.Auto,
    }
}).then((res: PartitionResponse) => {
    if (res.statusCode == 200) {
        console.log(res.elements);
    }
}).catch((e) => {
    console.log(e.statusCode);
    console.log(e.body);
});

```
<!-- No SDK Example Usage [usage] -->

Refer to the [API parameters page](https://docs.unstructured.io/api-reference/api-services/api-parameters) for all available parameters.

## Change the base URL

If you are self hosting the API, or developing locally, you can change the server URL when setting up the client.

```typescript
const client = new UnstructuredClient({
    serverURL: "http://localhost:8000",
    security: {
        apiKeyAuth: key,
    },
});

// OR

const client = new UnstructuredClient({
    serverURL: "https://my-server-url",
    security: {
        apiKeyAuth: key,
    },
});
```


<!-- Start Custom HTTP Client [http-client] -->
## Custom HTTP Client

The TypeScript SDK makes API calls using an `HTTPClient` that wraps the native
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This
client is a thin wrapper around `fetch` and provides the ability to attach hooks
around the request lifecycle that can be used to modify the request or handle
errors and response.

The `HTTPClient` constructor takes an optional `fetcher` argument that can be
used to integrate a third-party HTTP client or when writing tests to mock out
the HTTP client and feed in fixtures.

The following example shows how to use the `"beforeRequest"` hook to to add a
custom header and a timeout to requests and how to use the `"requestError"` hook
to log errors:

```typescript
import { UnstructuredClient } from "unstructured-client";
import { HTTPClient } from "unstructured-client/lib/http";

const httpClient = new HTTPClient({
  // fetcher takes a function that has the same signature as native `fetch`.
  fetcher: (request) => {
    return fetch(request);
  }
});

httpClient.addHook("beforeRequest", (request) => {
  const nextRequest = new Request(request, {
    signal: request.signal || AbortSignal.timeout(5000)
  });

  nextRequest.headers.set("x-custom-header", "custom value");

  return nextRequest;
});

httpClient.addHook("requestError", (error, request) => {
  console.group("Request Error");
  console.log("Reason:", `${error}`);
  console.log("Endpoint:", `${request.method} ${request.url}`);
  console.groupEnd();
});

const sdk = new UnstructuredClient({ httpClient });
```
<!-- End Custom HTTP Client [http-client] -->

<!-- Start Retries [retries] -->
## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:
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
      files: await openAsBlob("example.file"),
      chunkingStrategy: "by_title",
      splitPdfPageRange: [
        1,
        10,
      ],
      vlmModel: VLMModel.Gpt4o,
      vlmModelProvider: VLMModelProvider.Openai,
    },
  }, {
    retries: {
      strategy: "backoff",
      backoff: {
        initialInterval: 1,
        maxInterval: 50,
        exponent: 1.1,
        maxElapsedTime: 100,
      },
      retryConnectionErrors: false,
    },
  });

  // Handle the result
  console.log(result);
}

run();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:
```typescript
import { openAsBlob } from "node:fs";
import { UnstructuredClient } from "unstructured-client";
import {
  VLMModel,
  VLMModelProvider,
} from "unstructured-client/sdk/models/shared";

const unstructuredClient = new UnstructuredClient({
  retryConfig: {
    strategy: "backoff",
    backoff: {
      initialInterval: 1,
      maxInterval: 50,
      exponent: 1.1,
      maxElapsedTime: 100,
    },
    retryConnectionErrors: false,
  },
});

async function run() {
  const result = await unstructuredClient.general.partition({
    partitionParameters: {
      files: await openAsBlob("example.file"),
      chunkingStrategy: "by_title",
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
<!-- End Retries [retries] -->

### Splitting PDF by pages

See [page splitting](https://docs.unstructured.io/api-reference/api-services/sdk#page-splitting) for more details.

In order to speed up processing of large PDF files, the client splits up PDFs into smaller files, sends these to the API concurrently, and recombines the results. `splitPdfPage` can be set to `false` to disable this.

The amount of parallel requests is controlled by `splitPdfConcurrencyLevel` parameter. By default it equals to 5. It can't be more than 15, to avoid too high resource usage and costs. The size of each batch is determined internally and it can vary between 2 and 20 pages per split.

```typescript
client.general.partition({
    partitionParameters: {
        files: {
            content: data,
            fileName: filename,
        },
        // Set splitPdfPage parameter to false in order to disable splitting PDF
        splitPdfPage: true,
        // Modify splitPdfConcurrencyLevel to change the limit of parallel requests
        splitPdfConcurrencyLevel: 10,
    },
}};
```

<!-- Start Summary [summary] -->
## Summary


<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
  * [SDK Installation](#sdk-installation)
  * [SDK Example Usage](#sdk-example-usage)
  * [Change the base URL](#change-the-base-url)
  * [Custom HTTP Client](#custom-http-client)
  * [Retries](#retries)
  * [Requirements](#requirements)
  * [Standalone functions](#standalone-functions)
  * [File uploads](#file-uploads)
  * [Debugging](#debugging)

<!-- End Table of Contents [toc] -->

<!-- Start Requirements [requirements] -->
## Requirements

For supported JavaScript runtimes, please consult [RUNTIMES.md](RUNTIMES.md).
<!-- End Requirements [requirements] -->

<!-- Start Standalone functions [standalone-funcs] -->
## Standalone functions

All the methods listed above are available as standalone functions. These
functions are ideal for use in applications running in the browser, serverless
runtimes or other environments where application bundle size is a primary
concern. When using a bundler to build your application, all unused
functionality will be either excluded from the final bundle or tree-shaken away.

To read more about standalone functions, check [FUNCTIONS.md](./FUNCTIONS.md).

<details>

<summary>Available standalone functions</summary>

- [`generalPartition`](docs/sdks/general/README.md#partition) - Summary

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Start File uploads [file-upload] -->
## File uploads

Certain SDK methods accept files as part of a multi-part request. It is possible and typically recommended to upload files as a stream rather than reading the entire contents into memory. This avoids excessive memory consumption and potentially crashing with out-of-memory errors when working with very large files. The following example demonstrates how to attach a file stream to a request.

> [!TIP]
>
> Depending on your JavaScript runtime, there are convenient utilities that return a handle to a file without reading the entire contents into memory:
>
> - **Node.js v20+:** Since v20, Node.js comes with a native `openAsBlob` function in [`node:fs`](https://nodejs.org/docs/latest-v20.x/api/fs.html#fsopenasblobpath-options).
> - **Bun:** The native [`Bun.file`](https://bun.sh/docs/api/file-io#reading-files-bun-file) function produces a file handle that can be used for streaming file uploads.
> - **Browsers:** All supported browsers return an instance to a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) when reading the value from an `<input type="file">` element.
> - **Node.js v18:** A file stream can be created using the `fileFrom` helper from [`fetch-blob/from.js`](https://www.npmjs.com/package/fetch-blob).

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
      files: await openAsBlob("example.file"),
      chunkingStrategy: "by_title",
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
<!-- End File uploads [file-upload] -->

<!-- No Authentication -->
<!-- No SDK Available Operations -->
<!-- No Pagination -->
<!-- No Error Handling -->
<!-- No Server Selection -->

<!-- Start Debugging [debug] -->
## Debugging

You can setup your SDK to emit debug logs for SDK requests and responses.

You can pass a logger that matches `console`'s interface as an SDK option.

> [!WARNING]
> Beware that debug logging will reveal secrets, like API tokens in headers, in log messages printed to a console or files. It's recommended to use this feature only during local development and not in production.

```typescript
import { UnstructuredClient } from "unstructured-client";

const sdk = new UnstructuredClient({ debugLogger: console });
```
<!-- End Debugging [debug] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->

### Maturity

This SDK is in beta, and there may be breaking changes between versions without a major version update. Therefore, we recommend pinning usage
to a specific package version. This way, you can install the same version each time without breaking changes unless you are intentionally
looking for the latest version.

### Contributions

While we value open-source contributions to this SDK, this library is generated programmatically.
Feel free to open a PR or a Github issue as a proof of concept and we'll do our best to include it in a future release!

### SDK Created by [Speakeasy](https://docs.speakeasyapi.dev/docs/using-speakeasy/client-sdks)
