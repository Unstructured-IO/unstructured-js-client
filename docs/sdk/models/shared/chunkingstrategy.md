# ChunkingStrategy

## Example Usage

```typescript
import { ChunkingStrategy } from "unstructured-client/sdk/models/shared";

let value: ChunkingStrategy = ChunkingStrategy.Basic;
```

## Values

This is an open enum. Unrecognized values will be captured as the `Unrecognized<string>` branded type.

| Name                   | Value                  |
| ---------------------- | ---------------------- |
| `Basic`                | basic                  |
| `ByPage`               | by_page                |
| `BySimilarity`         | by_similarity          |
| `ByTitle`              | by_title               |
| -                      | `Unrecognized<string>` |