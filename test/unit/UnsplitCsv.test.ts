import { describe, expect, it, vi } from "vitest";
import { PDFDocument } from "pdf-lib";
import { UnstructuredClient } from "../../src/sdk/sdk.js";
import { HTTPClient } from "../../src/lib/http.js";
import { SplitPdfHook } from "../../src/hooks/custom/SplitPdfHook.js";
import { PartitionAcceptEnum } from "../../src/funcs/generalPartition.js";
import type { AfterSuccessContext } from "../../src/hooks/types.js";

const csv = "type,text\nTitle,Hello\n";

async function pdf(pages: number) {
  const document = await PDFDocument.create();
  for (let i = 0; i < pages; i++) document.addPage();
  return document.save();
}

function client(body: string, contentType: string) {
  return new UnstructuredClient({
    serverURL: "https://local.invalid",
    httpClient: new HTTPClient({
      fetcher: async () => new Response(body, { headers: { "content-type": contentType } }),
    }),
  });
}

describe("unsplit partition responses", () => {
  it.each(["split disabled", "non-PDF", "small PDF"])("returns CSV for %s", async (mode) => {
    const content = mode === "non-PDF" ? new TextEncoder().encode("hello") : await pdf(1);
    const result = await client(csv, "text/csv").general.partition({
      partitionParameters: {
        files: { content, fileName: mode === "non-PDF" ? "test.txt" : "test.pdf" },
        splitPdfPage: mode !== "split disabled",
      },
    }, { acceptHeaderOverride: PartitionAcceptEnum.textCsv });
    expect(result).toBe(csv);
  });

  it("keeps the public JSON response unchanged", async () => {
    const elements = [{ type: "Title", text: "Hello" }];
    const result = await client(JSON.stringify(elements), "application/json").general.partition({
      partitionParameters: {
        files: { content: new TextEncoder().encode("hello"), fileName: "test.txt" },
        splitPdfPage: false,
      },
    });
    expect(result).toEqual(elements);
  });

  it("does not consume an unsplit response while another operation is splitting", async () => {
    const hook = new SplitPdfHook();
    let release!: () => void;
    hook.partitionRequests["split"] = new Promise<void>((resolve) => { release = resolve; });
    hook.partitionSuccessfulResponses["split"] = [new Response('[{"text":"split"}]')];
    hook.partitionFailedResponses["split"] = [];
    const response = new Response(csv, { headers: { "content-type": "text/csv" } });
    const result = await hook.afterSuccess({ operationID: "unsplit" } as AfterSuccessContext, response);
    expect(result).toBe(response);
    expect(result.bodyUsed).toBe(false);
    expect(hook.partitionRequests["split"]).toBeDefined();
    release();
    const combined = await hook.afterSuccess(
      { operationID: "split" } as AfterSuccessContext, new Response("[]")
    );
    expect(await combined.json()).toEqual([{ text: "split" }]);
    expect(hook.partitionRequests["split"]).toBeUndefined();
  });

  it("still processes a real split operation with zero successful chunks", async () => {
    const hook = new SplitPdfHook();
    hook.partitionRequests["split"] = Promise.resolve();
    hook.partitionSuccessfulResponses["split"] = [];
    const failures = [new Response("failure", { status: 429 })];
    hook.partitionFailedResponses["split"] = failures;
    const response = new Response("[]");
    const combined = new Response("combined");
    const combine = vi.spyOn(hook, "formFinalResponse").mockResolvedValue(combined);
    expect(await hook.afterSuccess({ operationID: "split" } as AfterSuccessContext, response)).toBe(combined);
    expect(combine).toHaveBeenCalledWith(response, [], failures);
    expect(hook.partitionRequests["split"]).toBeUndefined();
  });
});
