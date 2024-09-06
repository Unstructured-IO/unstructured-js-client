# PartitionResponse

## Example Usage

```typescript
import { PartitionResponse } from "unstructured-client/sdk/models/operations";

let value: PartitionResponse = {
    contentType: "<value>",
    elements: [
        {
            type: "Title",
            element_id: "6aa0ff22f91bbe7e26e8e25ca8052acd",
            text: "LayoutParser: A Unified Toolkit for Deep Learning Based Document Image Analysis",
            metadata: {
                languages: ["eng"],
                page_number: 1,
                filename: "layout-parser-paper.pdf",
                filetype: "application/pdf",
            },
        },
    ],
    statusCode: 715190,
    rawResponse: new Response('{"message": "hello world"}', {
        headers: { "Content-Type": "application/json" },
    }),
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `elements`                                                            | Record<string, *any*>[]                                               | :heavy_minus_sign:                                                    | Successful Response                                                   |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |