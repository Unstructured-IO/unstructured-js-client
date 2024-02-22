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
Only the `files` parameter is required. See the [general partition](docs/sdks/general/README.md) page for all available parameters. 

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
        fileName: filename,
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


<!-- No SDK Example Usage -->
<!-- No SDK Available Operations -->
<!-- No Pagination -->
<!-- No Error Handling -->
<!-- No Server Selection -->

<!-- Start Custom HTTP Client [http-client] -->
## Custom HTTP Client

The Typescript SDK makes API calls using the [axios](https://axios-http.com/docs/intro) HTTP library.  In order to provide a convenient way to configure timeouts, cookies, proxies, custom headers, and other low-level configuration, you can initialize the SDK client with a custom `AxiosInstance` object.

For example, you could specify a header for every request that your sdk makes as follows:

```typescript
import { unstructured-client } from "UnstructuredClient";
import axios from "axios";

const httpClient = axios.create({
    headers: {'x-custom-header': 'someValue'}
})

const sdk = new UnstructuredClient({defaultClient: httpClient});
```
<!-- End Custom HTTP Client [http-client] -->
<!-- No Retries -->
<!-- No Authentication -->

<!-- Placeholder for Future Speakeasy SDK Sections -->

### Maturity

This SDK is in beta, and there may be breaking changes between versions without a major version update. Therefore, we recommend pinning usage
to a specific package version. This way, you can install the same version each time without breaking changes unless you are intentionally
looking for the latest version.

### Contributions

While we value open-source contributions to this SDK, this library is generated programmatically.
Feel free to open a PR or a Github issue as a proof of concept and we'll do our best to include it in a future release!

### SDK Created by [Speakeasy](https://docs.speakeasyapi.dev/docs/using-speakeasy/client-sdks)
