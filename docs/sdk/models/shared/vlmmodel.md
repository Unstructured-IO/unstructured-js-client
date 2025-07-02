# VLMModel

The VLM Model to use.

## Example Usage

```typescript
import { VLMModel } from "unstructured-client/sdk/models/shared";

let value: VLMModel = VLMModel.Gpt4o;
```

## Values

This is an open enum. Unrecognized values will be captured as the `Unrecognized<string>` branded type.

| Name                                         | Value                                        |
| -------------------------------------------- | -------------------------------------------- |
| `Claude35Sonnet20241022`                     | claude-3-5-sonnet-20241022                   |
| `Claude37Sonnet20250219`                     | claude-3-7-sonnet-20250219                   |
| `Gpt4o`                                      | gpt-4o                                       |
| `Gemini15Pro`                                | gemini-1.5-pro                               |
| `UsAmazonNovaProV10`                         | us.amazon.nova-pro-v1:0                      |
| `UsAmazonNovaLiteV10`                        | us.amazon.nova-lite-v1:0                     |
| `UsAnthropicClaude37Sonnet20250219V10`       | us.anthropic.claude-3-7-sonnet-20250219-v1:0 |
| `UsAnthropicClaude35Sonnet20241022V20`       | us.anthropic.claude-3-5-sonnet-20241022-v2:0 |
| `UsAnthropicClaude3Opus20240229V10`          | us.anthropic.claude-3-opus-20240229-v1:0     |
| `UsAnthropicClaude3Haiku20240307V10`         | us.anthropic.claude-3-haiku-20240307-v1:0    |
| `UsAnthropicClaude3Sonnet20240229V10`        | us.anthropic.claude-3-sonnet-20240229-v1:0   |
| `UsMetaLlama3290bInstructV10`                | us.meta.llama3-2-90b-instruct-v1:0           |
| `UsMetaLlama3211bInstructV10`                | us.meta.llama3-2-11b-instruct-v1:0           |
| `Gemini20Flash001`                           | gemini-2.0-flash-001                         |
| -                                            | `Unrecognized<string>`                       |