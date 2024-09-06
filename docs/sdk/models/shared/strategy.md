# Strategy

The strategy to use for partitioning PDF/image. Options are fast, hi_res, auto. Default: hi_res

## Example Usage

```typescript
import { Strategy } from "unstructured-client/sdk/models/shared";

let value: Strategy = Strategy.Auto;
```

## Values

This is an open enum. Unrecognized values will be captured as the `Unrecognized<string>` branded type.

| Name                   | Value                  |
| ---------------------- | ---------------------- |
| `Fast`                 | fast                   |
| `HiRes`                | hi_res                 |
| `Auto`                 | auto                   |
| `OcrOnly`              | ocr_only               |
| -                      | `Unrecognized<string>` |