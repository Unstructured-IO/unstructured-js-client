import { formatResult, ToolDefinition } from "./tools.js";
import { Register } from "./extensions.js";
import { generalPartition } from "../funcs/generalPartition.js";
import fs from 'node:fs/promises';
import { UnstructuredClientCore } from "../core.js";
import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { z } from "zod";
import { Strategy, Strategy$inboundSchema, StrategyOpen } from "../sdk/models/shared/partitionparameters.js";


type FileRequest = {
  strategy?: StrategyOpen | undefined;
  file_content?: string | undefined;
  file_path?: string | undefined;
  file_name: string;
};

const FileRequest$inboundSchema: z.ZodType<
FileRequest,
  z.ZodTypeDef,
  unknown
> = z.object({
  file_content: z.string().optional(),
  file_path: z.string().optional(),
  file_name: z.string(),
  strategy: Strategy$inboundSchema.default(Strategy.HiRes),
});

const customToolArg = {
  request: FileRequest$inboundSchema
};



export const tool$generalPartitionCorrect: ToolDefinition<typeof customToolArg> = {
  name: "correct_general-partition",
  description: `use this tool to pass a file to unstructured. You must BASE64 ENCODE uploaded file content before passing to unstructured. Alternatively, if the user did not upload a file they can provide a full local file path. `,
  args: customToolArg,
  tool: async (client: UnstructuredClientCore, args, ctx: RequestHandlerExtra) => {
    let data: Uint8Array;
    if (args.request.file_content) {
      try {
        data = new Uint8Array(Buffer.from(args.request.file_content, 'base64'));
      } catch (e) {
        return {
          content: [{
            type: "text",
            text: `You must BASE64 encode this file content then pass it to the tool.`,
          }],
          isError: true,
        };
      }
    } else if (args.request.file_path) {
      data = new Uint8Array(await fs.readFile(args.request.file_path));
    } else {
      return {
        content: [{
          type: "text",
          text: `A full file path for file content must be provided`,
        }],
        isError: true,
      };
    }
    const [result, apiCall] = await generalPartition(
      client,
      {
        partitionParameters: {
          files: {
              content: data,
              fileName: args.request.file_name,
          },
        strategy: args.request.strategy,
      }
      },
      { fetchOptions: { signal: ctx.signal } },
    ).$inspect();

    if (!result.ok) {
      return {
        content: [{ type: "text", text: result.error.message }],
        isError: true,
      };
    }

    const value = result.value;

    return formatResult(value, apiCall);
  },
};

export function registerMCPExtensions(register: Register): void {
    register.tool(tool$generalPartitionCorrect);
}