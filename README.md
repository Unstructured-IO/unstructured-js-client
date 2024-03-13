# unstructured-client

<div align="left">
    <a href="https://speakeasyapi.dev/"><img src="https://custom-icon-badges.demolab.com/badge/-Built%20By%20Speakeasy-212015?style=for-the-badge&logoColor=FBE331&logo=speakeasy&labelColor=545454" /></a>
    <a href="https://opensource.org/licenses/MIT">
        <img src="https://img.shields.io/badge/License-MIT-blue.svg" style="width: 100px; height: 28px;" />
    </a>
</div>


## 🏗 **Welcome to your new SDK!** 🏗

It has been generated successfully based on your OpenAPI spec. However, it is not yet ready for production use. Here are some next steps:
- [ ] 🛠 Make your SDK feel handcrafted by [customizing it](https://www.speakeasyapi.dev/docs/customize-sdks)
- [ ] ♻️ Refine your SDK quickly by iterating locally with the [Speakeasy CLI](https://github.com/speakeasy-api/speakeasy)
- [ ] 🎁 Publish your SDK to package managers by [configuring automatic publishing](https://www.speakeasyapi.dev/docs/productionize-sdks/publish-sdks)
- [ ] ✨ When ready to productionize, delete this section from the README

<!-- Start SDK Installation [installation] -->
## SDK Installation

### NPM

```bash
npm add <UNSET>
```

### Yarn

```bash
yarn add <UNSET>
```
<!-- End SDK Installation [installation] -->

<!-- Start Requirements [requirements] -->
## Requirements

For supported JavaScript runtimes, please consult [RUNTIMES.md](RUNTIMES.md).
<!-- End Requirements [requirements] -->

<!-- Start SDK Example Usage [usage] -->
## SDK Example Usage

### Example

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
        extractImageBlockTypes: ["image", "table"],
        files: await openAsBlob("./sample-file"),
        gzUncompressedContentType: "application/pdf",
        hiResModelName: "yolox",
        languages: ["[", "e", "n", "g", "]"],
        maxCharacters: 1500,
        newAfterNChars: 1500,
        outputFormat: "application/json",
        overlap: 25,
        overlapAll: true,
        skipInferTableTypes: ["pdf"],
        strategy: "hi_res",
    });

    // Handle the result
    console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

### [general](docs/sdks/general/README.md)

* [partition](docs/sdks/general/README.md#partition) - Pipeline 1
<!-- End Available Resources and Operations [operations] -->

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

async function run() {
    const sdk = new UnstructuredClient({
        apiKeyAuth: "YOUR_API_KEY",
    });

    const result = await sdk.general.partition({
        chunkingStrategy: "by_title",
        combineUnderNChars: 500,
        encoding: "utf-8",
        extractImageBlockTypes: ["image", "table"],
        files: await openAsBlob("./sample-file"),
        gzUncompressedContentType: "application/pdf",
        hiResModelName: "yolox",
        languages: ["[", "e", "n", "g", "]"],
        maxCharacters: 1500,
        newAfterNChars: 1500,
        outputFormat: "application/json",
        overlap: 25,
        overlapAll: true,
        skipInferTableTypes: ["pdf"],
        strategy: "hi_res",
    });

    // Handle the result
    console.log(result);
}

run();

```
<!-- End File uploads [file-upload] -->

<!-- Start Retries [retries] -->
## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:
```typescript
import { openAsBlob } from "node:fs";
import { UnstructuredClient } from "unstructured-client";

async function run() {
    const sdk = new UnstructuredClient({
        apiKeyAuth: "YOUR_API_KEY",
    });

    const result = await sdk.general.partition(
        {
            chunkingStrategy: "by_title",
            combineUnderNChars: 500,
            encoding: "utf-8",
            extractImageBlockTypes: ["image", "table"],
            files: await openAsBlob("./sample-file"),
            gzUncompressedContentType: "application/pdf",
            hiResModelName: "yolox",
            languages: ["[", "e", "n", "g", "]"],
            maxCharacters: 1500,
            newAfterNChars: 1500,
            outputFormat: "application/json",
            overlap: 25,
            overlapAll: true,
            skipInferTableTypes: ["pdf"],
            strategy: "hi_res",
        },
        {
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
        }
    );

    // Handle the result
    console.log(result);
}

run();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:
```typescript
import { openAsBlob } from "node:fs";
import { UnstructuredClient } from "unstructured-client";

async function run() {
    const sdk = new UnstructuredClient({
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
        apiKeyAuth: "YOUR_API_KEY",
    });

    const result = await sdk.general.partition({
        chunkingStrategy: "by_title",
        combineUnderNChars: 500,
        encoding: "utf-8",
        extractImageBlockTypes: ["image", "table"],
        files: await openAsBlob("./sample-file"),
        gzUncompressedContentType: "application/pdf",
        hiResModelName: "yolox",
        languages: ["[", "e", "n", "g", "]"],
        maxCharacters: 1500,
        newAfterNChars: 1500,
        outputFormat: "application/json",
        overlap: 25,
        overlapAll: true,
        skipInferTableTypes: ["pdf"],
        strategy: "hi_res",
    });

    // Handle the result
    console.log(result);
}

run();

```
<!-- End Retries [retries] -->

<!-- Start Error Handling [errors] -->
## Error Handling

All SDK methods return a response object or throw an error. If Error objects are specified in your OpenAPI Spec, the SDK will throw the appropriate Error type.

| Error Object               | Status Code                | Content Type               |
| -------------------------- | -------------------------- | -------------------------- |
| errors.HTTPValidationError | 422                        | application/json           |
| errors.SDKError            | 4xx-5xx                    | */*                        |

Validation errors can also occur when either method arguments or data returned from the server do not match the expected format. The `SDKValidationError` that is thrown as a result will capture the raw value that failed validation in an attribute called `rawValue`. Additionally, a `pretty()` method is available on this error that can be used to log a nicely formatted string since validation errors can list many issues and the plain error string may be difficult read when debugging. 


```typescript
import { openAsBlob } from "node:fs";
import { UnstructuredClient } from "unstructured-client";
import * as errors from "unstructured-client/sdk/models/errors";

async function run() {
    const sdk = new UnstructuredClient({
        apiKeyAuth: "YOUR_API_KEY",
    });

    let result;
    try {
        result = await sdk.general.partition({
            chunkingStrategy: "by_title",
            combineUnderNChars: 500,
            encoding: "utf-8",
            extractImageBlockTypes: ["image", "table"],
            files: await openAsBlob("./sample-file"),
            gzUncompressedContentType: "application/pdf",
            hiResModelName: "yolox",
            languages: ["[", "e", "n", "g", "]"],
            maxCharacters: 1500,
            newAfterNChars: 1500,
            outputFormat: "application/json",
            overlap: 25,
            overlapAll: true,
            skipInferTableTypes: ["pdf"],
            strategy: "hi_res",
        });
    } catch (err) {
        switch (true) {
            case err instanceof errors.SDKValidationError: {
                // Validation errors can be pretty-printed
                console.error(err.pretty());
                // Raw value may also be inspected
                console.error(err.rawValue);
                return;
            }
            case err instanceof errors.HTTPValidationError: {
                console.error(err); // handle exception
                return;
            }
            default: {
                throw err;
            }
        }
    }

    // Handle the result
    console.log(result);
}

run();

```
<!-- End Error Handling [errors] -->

<!-- Start Server Selection [server] -->
## Server Selection

### Select Server by Name

You can override the default server globally by passing a server name to the `server` optional parameter when initializing the SDK client instance. The selected server will then be used as the default on the operations that use it. This table lists the names associated with the available servers:

| Name | Server | Variables |
| ----- | ------ | --------- |
| `prod` | `https://api.unstructured.io` | None |
| `local` | `http://localhost:8000` | None |

```typescript
import { openAsBlob } from "node:fs";
import { UnstructuredClient } from "unstructured-client";

async function run() {
    const sdk = new UnstructuredClient({
        server: "local",
        apiKeyAuth: "YOUR_API_KEY",
    });

    const result = await sdk.general.partition({
        chunkingStrategy: "by_title",
        combineUnderNChars: 500,
        encoding: "utf-8",
        extractImageBlockTypes: ["image", "table"],
        files: await openAsBlob("./sample-file"),
        gzUncompressedContentType: "application/pdf",
        hiResModelName: "yolox",
        languages: ["[", "e", "n", "g", "]"],
        maxCharacters: 1500,
        newAfterNChars: 1500,
        outputFormat: "application/json",
        overlap: 25,
        overlapAll: true,
        skipInferTableTypes: ["pdf"],
        strategy: "hi_res",
    });

    // Handle the result
    console.log(result);
}

run();

```


### Override Server URL Per-Client

The default server can also be overridden globally by passing a URL to the `serverURL` optional parameter when initializing the SDK client instance. For example:

```typescript
import { openAsBlob } from "node:fs";
import { UnstructuredClient } from "unstructured-client";

async function run() {
    const sdk = new UnstructuredClient({
        serverURL: "https://api.unstructured.io",
        apiKeyAuth: "YOUR_API_KEY",
    });

    const result = await sdk.general.partition({
        chunkingStrategy: "by_title",
        combineUnderNChars: 500,
        encoding: "utf-8",
        extractImageBlockTypes: ["image", "table"],
        files: await openAsBlob("./sample-file"),
        gzUncompressedContentType: "application/pdf",
        hiResModelName: "yolox",
        languages: ["[", "e", "n", "g", "]"],
        maxCharacters: 1500,
        newAfterNChars: 1500,
        outputFormat: "application/json",
        overlap: 25,
        overlapAll: true,
        skipInferTableTypes: ["pdf"],
        strategy: "hi_res",
    });

    // Handle the result
    console.log(result);
}

run();

```
<!-- End Server Selection [server] -->

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
    signal: request.signal || AbortSignal.timeout(5000);
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

<!-- Start Authentication [security] -->
## Authentication

### Per-Client Security Schemes

This SDK supports the following security scheme globally:

| Name         | Type         | Scheme       |
| ------------ | ------------ | ------------ |
| `apiKeyAuth` | apiKey       | API key      |

To authenticate with the API the `apiKeyAuth` parameter must be set when initializing the SDK client instance. For example:
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
        extractImageBlockTypes: ["image", "table"],
        files: await openAsBlob("./sample-file"),
        gzUncompressedContentType: "application/pdf",
        hiResModelName: "yolox",
        languages: ["[", "e", "n", "g", "]"],
        maxCharacters: 1500,
        newAfterNChars: 1500,
        outputFormat: "application/json",
        overlap: 25,
        overlapAll: true,
        skipInferTableTypes: ["pdf"],
        strategy: "hi_res",
    });

    // Handle the result
    console.log(result);
}

run();

```
<!-- End Authentication [security] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->

# Development

## Maturity

This SDK is in beta, and there may be breaking changes between versions without a major version update. Therefore, we recommend pinning usage
to a specific package version. This way, you can install the same version each time without breaking changes unless you are intentionally
looking for the latest version.

## Contributions

While we value open-source contributions to this SDK, this library is generated programmatically.
Feel free to open a PR or a Github issue as a proof of concept and we'll do our best to include it in a future release!

### SDK Created by [Speakeasy](https://docs.speakeasyapi.dev/docs/using-speakeasy/client-sdks)
