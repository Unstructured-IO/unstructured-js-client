<h3 align="center">
  <img
    src="https://raw.githubusercontent.com/Unstructured-IO/unstructured/main/img/unstructured_logo.png"
    height="200"
  >
</h3>

<div align="left">
    <a href="https://speakeasyapi.dev/"><img src="https://custom-icon-badges.demolab.com/badge/-Built%20By%20Speakeasy-212015?style=for-the-badge&logoColor=FBE331&logo=speakeasy&labelColor=545454" /></a>
    <a href="https://github.com/Unstructured-IO/unstructured-js-client.git/actions"><img src="https://img.shields.io/github/actions/workflow/status/speakeasy-sdks/bolt-php/speakeasy_sdk_generation.yml?style=for-the-badge" /></a>
</div>

<h2 align="center">
  <p>Typescript SDK for the Unstructured API</p>
</h2>

This is a Typescript client for the [Unstructured API](https://unstructured-io.github.io/unstructured/api.html). 

## SDK Installation

### NPM

```bash
npm install unstructured-client
```

### Yarn

```bash
yarn add unstructured-client
```
<!-- No SDK Installation -->

## SDK Example Usage
Only the `files` parameter is required. See the [general partition]([General](docs/sdks/general/README.md)) page for all available parameters. 

```typescript
import { UnstructuredClient } from "unstructured-client";
import { PartitionResponse } from "unstructured-client/dist/sdk/models/operations";
import * as fs from "fs";

const key = "YOUR-API-KEY";

const client = new UnstructuredClient({
    security: {
        apiKeyAuth: key,
    },
});

const filename = "sample-docs/layout-parser-paper.pdf";
const data = fs.readFileSync(filename);

client.general.partition({
    // Note that this currently only supports a single file
    files: {
        content: data,
        files: filename,
    },
    // Other partition params
    strategy: "fast",
}).then((res: PartitionResponse) => {
    if (res.statusCode == 200) {
        console.log(res.elements);
    }
}).catch((e) => {
    console.log(e.statusCode);
    console.log(e.body);
});
```

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

<!-- Start Dev Containers -->

<!-- End Dev Containers -->


<!-- No SDK Example Usage -->
<!-- No SDK Available Operations -->
<!-- No Pagination -->
<!-- No Error Handling -->
<!-- No Server Selection -->

<!-- Start Custom HTTP Client -->
# Custom HTTP Client

The Typescript SDK makes API calls using the (axios)[https://axios-http.com/docs/intro] HTTP library.  In order to provide a convenient way to configure timeouts, cookies, proxies, custom headers, and other low-level configuration, you can initialize the SDK client with a custom `AxiosInstance` object.


For example, you could specify a header for every request that your sdk makes as follows:

```typescript
from unstructured-client import UnstructuredClient;
import axios;

const httpClient = axios.create({
    headers: {'x-custom-header': 'someValue'}
})


const sdk = new UnstructuredClient({defaultClient: httpClient});
```
<!-- End Custom HTTP Client -->



<!-- Start Retries -->
# Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:


## Example

```typescript
import { UnstructuredClient } from "unstructured-client";

(async () => {
    const sdk = new UnstructuredClient({
        security: {
            apiKeyAuth: "YOUR_API_KEY",
        },
    });

    const res = await sdk.general.partition(
        {
            chunkingStrategy: "by_title",
            combineUnderNChars: 500,
            encoding: "utf-8",
            files: {
                content: new TextEncoder().encode("0x2cC94b2FEF"),
                fileName: "um.shtml",
            },
            gzUncompressedContentType: "application/pdf",
            hiResModelName: "yolox",
            languages: ["[", "e", "n", "g", "]"],
            maxCharacters: 1500,
            newAfterNChars: 1500,
            outputFormat: "application/json",
            skipInferTableTypes: ["p", "d", "f"],
            strategy: "hi_res",
        },
        {
            strategy: "backoff",
            backoff: {
                initialInterval: 1,
                maxInterval: 50,
                exponent: 1.1,
                maxElapsedTime: 100,
            },
            retryConnectionErrors: false,
        }
    );

    if (res.statusCode == 200) {
        // handle response
    }
})();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:


## Example

```typescript
import { UnstructuredClient } from "unstructured-client";

(async() => {
  const sdk = new UnstructuredClient({
    retry_config: {
        strategy: "backoff",
        backoff: {
          initialInterval: 1,
          maxInterval: 50,
          exponent: 1.1,
          maxElapsedTime: 100,
        },
        retryConnectionErrors: false,
      }
    security: {
      apiKeyAuth: "YOUR_API_KEY",
    },
  });

  const res = await sdk.general.partition({
    chunkingStrategy: "by_title",
    combineUnderNChars: 500,
    encoding: "utf-8",
    files: {
      content: new TextEncoder().encode("0x2cC94b2FEF"),
      fileName: "um.shtml",
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


<!-- End Retries -->



<!-- Start Authentication -->

# Authentication

## Per-Client Security Schemes

Your SDK supports the following security scheme globally:

| Name         | Type         | Scheme       |
| ------------ | ------------ | ------------ |
| `apiKeyAuth` | apiKey       | API key      |

You can set the security parameters through the `security` optional parameter when initializing the SDK client instance. For example:

```typescript
import { UnstructuredClient } from "unstructured-client";

(async () => {
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
            content: new TextEncoder().encode("0x2cC94b2FEF"),
            fileName: "um.shtml",
        },
        gzUncompressedContentType: "application/pdf",
        hiResModelName: "yolox",
        languages: ["[", "e", "n", "g", "]"],
        maxCharacters: 1500,
        newAfterNChars: 1500,
        outputFormat: "application/json",
        skipInferTableTypes: ["p", "d", "f"],
        strategy: "hi_res",
    });

    if (res.statusCode == 200) {
        // handle response
    }
})();

```
<!-- End Authentication -->

<!-- Placeholder for Future Speakeasy SDK Sections -->

### Maturity

This SDK is in beta, and there may be breaking changes between versions without a major version update. Therefore, we recommend pinning usage
to a specific package version. This way, you can install the same version each time without breaking changes unless you are intentionally
looking for the latest version.

### Contributions

While we value open-source contributions to this SDK, this library is generated programmatically.
Feel free to open a PR or a Github issue as a proof of concept and we'll do our best to include it in a future release!

### SDK Created by [Speakeasy](https://docs.speakeasyapi.dev/docs/using-speakeasy/client-sdks)
