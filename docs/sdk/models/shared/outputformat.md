# OutputFormat

The format of the response. Supported formats are application/json and text/csv. Default: application/json.

## Example Usage

```typescript
import { OutputFormat } from "unstructured-client/sdk/models/shared";

let value: OutputFormat = OutputFormat.TextCsv;
```

## Values

This is an open enum. Unrecognized values will be captured as the `Unrecognized<string>` branded type.

| Name                   | Value                  |
| ---------------------- | ---------------------- |
| `ApplicationJson`      | application/json       |
| `TextCsv`              | text/csv               |
| -                      | `Unrecognized<string>` |