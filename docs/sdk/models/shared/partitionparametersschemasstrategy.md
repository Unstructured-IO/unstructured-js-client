# PartitionParametersSchemasStrategy

The VLM Model provider to use.

## Example Usage

```typescript
import { PartitionParametersSchemasStrategy } from "unstructured-client/sdk/models/shared";

let value: PartitionParametersSchemasStrategy =
  PartitionParametersSchemasStrategy.Openai;
```

## Values

This is an open enum. Unrecognized values will be captured as the `Unrecognized<string>` branded type.

| Name                   | Value                  |
| ---------------------- | ---------------------- |
| `Openai`               | openai                 |
| `Anthropic`            | anthropic              |
| `Bedrock`              | bedrock                |
| `AnthropicBedrock`     | anthropic_bedrock      |
| `Vertexai`             | vertexai               |
| `Google`               | google                 |
| `AzureOpenai`          | azure_openai           |
| -                      | `Unrecognized<string>` |