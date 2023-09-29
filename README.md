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
import { Unstructured } from "unstructured-client";
import { PartitionResponse } from "unstructured-client/dist/sdk/models/operations";

const sdk = new Unstructured({
  security: {
    apiKeyAuth: "YOUR_API_KEY",
  },
});

sdk.general.partition({
  coordinates: false,
  encoding: "utf-8",
  files: {
    content: "distinctio".encode(),
    files: "quibusdam",
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

<!-- Start Dev Containers -->

<!-- End Dev Containers -->



## SDK Example Usage
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



<!-- Start SDK Available Operations -->
## Available Resources and Operations


### [general](docs/sdks/general/README.md)

* [partition](docs/sdks/general/README.md#partition) - Pipeline 1
<!-- End SDK Available Operations -->



<!-- Start Pagination -->
# Pagination

Some of the endpoints in this SDK support pagination. To use pagination, you make your SDK calls as usual, but the
returned response object will have a `next` method that can be called to pull down the next group of results. If the
return value of `next` is `null`, then there are no more pages to be fetched.

Here's an example of one such pagination call:
<!-- End Pagination -->

<!-- Placeholder for Future Speakeasy SDK Sections -->

### Maturity

This SDK is in beta, and there may be breaking changes between versions without a major version update. Therefore, we recommend pinning usage
to a specific package version. This way, you can install the same version each time without breaking changes unless you are intentionally
looking for the latest version.

### Contributions

While we value open-source contributions to this SDK, this library is generated programmatically.
Feel free to open a PR or a Github issue as a proof of concept and we'll do our best to include it in a future release!

### SDK Created by [Speakeasy](https://docs.speakeasyapi.dev/docs/using-speakeasy/client-sdks)
