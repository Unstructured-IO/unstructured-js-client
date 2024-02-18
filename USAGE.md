<!-- Start SDK Example Usage [usage] -->
```typescript
import { UnstructuredClient } from "unstructured-client";
import { Strategy } from "unstructured-client/dist/sdk/models/shared";

async function run() {
    const sdk = new UnstructuredClient({
        security: {
            apiKeyAuth: "YOUR_API_KEY",
        },
    });

    const res = await sdk.general.partition({
        bodyPartitionParameters: {
            extractImageBlockTypes: ["<value>"],
            files: {
                content: new TextEncoder().encode("0x2cC94b2FEF"),
                fileName: "um.shtml",
            },
            languages: ["<value>"],
            ocrLanguages: ["<value>"],
            skipInferTableTypes: ["<value>"],
            strategy: Strategy.HiRes,
        },
    });

    if (res.statusCode == 200) {
        // handle response
    }
}

run();

```
<!-- End SDK Example Usage [usage] -->