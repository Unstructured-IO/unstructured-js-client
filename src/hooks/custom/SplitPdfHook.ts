import { PDFDocument } from "pdf-lib";
import async from "async";

import { HTTPClient } from "../../lib/http";
import {
  AfterErrorContext,
  AfterErrorHook,
  AfterSuccessContext,
  AfterSuccessHook,
  type BeforeRequestContext,
  BeforeRequestHook,
  SDKInitHook,
  SDKInitOptions,
} from "../types";
import { stringToBoolean } from "./utils";

const PARTITION_FORM_FILES_KEY = "files";
const PARTITION_FORM_SPLIT_PDF_PAGE_KEY = "split_pdf_page";

export class SplitPdfHook
  implements SDKInitHook, BeforeRequestHook, AfterSuccessHook, AfterErrorHook
{
  #client: HTTPClient | undefined;
  #partitionResponses: Record<string, Response[]> = {};
  #partitionQueues: Record<
    string,
    async.QueueObject<{
      req: Request;
      i: number;
    }>
  > = {};
  static concurrentLimit = 5;

  sdkInit(opts: SDKInitOptions): SDKInitOptions {
    const { baseURL, client } = opts;
    this.#client = client;
    return { baseURL: baseURL, client: client };
  }

  async beforeRequest(
    hookCtx: BeforeRequestContext,
    request: Request
  ): Promise<Request> {
    const { operationID } = hookCtx;
    const formData = await request.clone().formData();
    const splitPdfPage = stringToBoolean(
      (formData.get(PARTITION_FORM_SPLIT_PDF_PAGE_KEY) as string) ?? "false"
    );
    const file = formData.get(PARTITION_FORM_FILES_KEY) as File | null;

    if (!splitPdfPage) {
      return request;
    }

    if (!file?.name.endsWith(".pdf")) {
      console.warn("Given file is not a PDF. Continuing without splitting.");
      return request;
    }

    if (!this.#client) {
      console.warn("HTTP client not accessible! Continuing without splitting.");
      return request;
    }

    const fileName = file.name.replace(".pdf", "");
    const pages = await this.#getPdfPages(file);
    const headers = this.#prepareRequestHeaders(request);

    const requests: Request[] = [];
    for (const [i, page] of pages.entries()) {
      const body = await this.#prepareRequestBody(request);
      body.append(PARTITION_FORM_FILES_KEY, page, `${fileName}-${i + 1}.pdf`);
      const req = new Request(request.clone(), {
        headers,
        body,
      });
      requests.push(req);
    }

    this.#partitionResponses[operationID] = new Array(requests.length);

    this.#partitionQueues[operationID] = async.queue<{
      req: Request;
      i: number;
    }>(async (task) => {
      const response = await this.#client!.request(task.req);
      console.log(response.status);
      if (response.status === 200) {
        (this.#partitionResponses[operationID] as Response[])[task.i] =
          response;
      }
    }, SplitPdfHook.concurrentLimit);
    this.#partitionQueues[operationID]!.drain(() => console.log("FINISHED!"));
    this.#partitionQueues[operationID]!.push(
      requests.slice(0, -1).map((req, i) => ({ req, i }))
    );

    return requests.at(-1) as Request;
  }

  async afterSuccess(
    hookCtx: AfterSuccessContext,
    response: Response
  ): Promise<Response> {
    const { operationID } = hookCtx;
    const responses = await this.#awaitAllRequests(operationID);

    console.log(responses);
    if (!responses) {
      return response;
    }

    const headers = this.#prepareResponseHeaders(response);
    const body = await this.#prepareResponseBody([...responses, response]);

    this.#clearOperation(operationID);

    return new Response(body, {
      headers: headers,
      status: response.status,
      statusText: response.statusText,
    });
  }

  async afterError(
    hookCtx: AfterErrorContext,
    response: Response | null,
    error: unknown
  ): Promise<{ response: Response | null; error: unknown }> {
    const { operationID } = hookCtx;
    const responses = await this.#awaitAllRequests(operationID);

    console.log(responses);

    if (!responses?.length) {
      this.#clearOperation(operationID);
      return { response, error };
    }

    const okResponse = responses[0] as Response;
    const headers = this.#prepareResponseHeaders(okResponse);
    const body = await this.#prepareResponseBody(responses);

    const finalResponse = new Response(body, {
      headers: headers,
      status: okResponse.status,
      statusText: okResponse.statusText,
    });

    this.#clearOperation(operationID);

    return { response: finalResponse, error: null };
  }

  async #pdfPageToBlob(pdf: PDFDocument, pageIndex: number): Promise<Blob> {
    const subPdf = await PDFDocument.create();
    const [page] = await subPdf.copyPages(pdf, [pageIndex]);
    subPdf.addPage(page);
    const subPdfBytes = await subPdf.save();
    return new Blob([subPdfBytes], {
      type: "application/pdf",
    });
  }

  async #getPdfPages(file: File | Blob): Promise<Blob[]> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);

    const pagesFiles: Blob[] = [];
    for (let i = 0; i < pdf.getPages().length; ++i) {
      const pageFile = await this.#pdfPageToBlob(pdf, i);
      pagesFiles.push(pageFile);
    }

    return pagesFiles;
  }

  #prepareResponseHeaders(response: Response): Headers {
    const headers = new Headers(response.headers);
    headers.delete("content-length");
    return headers;
  }

  async #prepareResponseBody(responses: Response[]): Promise<string> {
    const allElements: any[] = [];
    for (const res of responses) {
      const resElements = await res.clone().json();
      allElements.push(resElements);
    }
    return JSON.stringify(allElements.flat());
  }

  #prepareRequestHeaders(request: Request): Headers {
    const headers = new Headers(request.headers);
    headers.delete("content-type");
    return headers;
  }

  async #prepareRequestBody(request: Request): Promise<FormData> {
    const formData = await request.clone().formData();
    formData.delete(PARTITION_FORM_SPLIT_PDF_PAGE_KEY);
    formData.delete(PARTITION_FORM_FILES_KEY);
    formData.append(PARTITION_FORM_SPLIT_PDF_PAGE_KEY, "false");
    return formData;
  }

  #clearOperation(operationID: string) {
    delete this.#partitionResponses[operationID];
    delete this.#partitionQueues[operationID];
  }

  async #awaitAllRequests(
    operationID: string
  ): Promise<Response[] | undefined> {
    const queue = this.#partitionQueues[operationID];

    if (!queue) {
      return;
    }


    let idle = queue.idle();
    while (!idle) {
      idle = queue.idle();
      console.log("idle!");
    }

    return this.#partitionResponses[operationID]?.filter((e) => e) ?? [];
  }
}
