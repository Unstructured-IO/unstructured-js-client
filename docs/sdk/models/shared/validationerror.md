# ValidationError

## Example Usage

```typescript
import { ValidationError } from "unstructured-client/sdk/models/shared";

let value: ValidationError = {
  loc: [
    929957,
  ],
  msg: "<value>",
  type: "<value>",
};
```

## Fields

| Field                                                   | Type                                                    | Required                                                | Description                                             |
| ------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| `ctx`                                                   | [shared.Context](../../../sdk/models/shared/context.md) | :heavy_minus_sign:                                      | N/A                                                     |
| `input`                                                 | *any*                                                   | :heavy_minus_sign:                                      | N/A                                                     |
| `loc`                                                   | *shared.Loc*[]                                          | :heavy_check_mark:                                      | N/A                                                     |
| `msg`                                                   | *string*                                                | :heavy_check_mark:                                      | N/A                                                     |
| `type`                                                  | *string*                                                | :heavy_check_mark:                                      | N/A                                                     |