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
const PARTITION_FORM_STARTING_PAGE_NUMBER_KEY = "starting_page_number";
const PARTITION_FORM_SPLIT_PDF_THREADS = "split_pdf_threads";

const DEFAULT_STARTING_PAGE_NUMBER = 1;
const MAX_NUMBER_OF_PARALLEL_REQUESTS = 15;
const DEFAULT_NUMBER_OF_PARALLEL_REQUESTS = 5;

const MIN_PAGES = 2;
const MAX_PAGES = 20;

interface PdfSplit {
  content: Blob;
  startPage: number;
  endPage: number;
}

/**
 * Represents a hook for splitting and sending PDF files as per page requests.
 */
export class SplitPdfHook
  implements SDKInitHook, BeforeRequestHook, AfterSuccessHook, AfterErrorHook
{
  /**
   * The HTTP client used for making requests.
   */
  #client: HTTPClient | undefined;

  /**
   * Maps lists responses to client operation.
   */
  #partitionResponses: Record<string, Response[]> = {};

  /**
   * Maps parallel requests to client operation.
   */
  #partitionRequests: Record<string, Promise<unknown>> = {};

  /**
   * Initializes Split PDF Hook.
   * @param opts - The options for SDK initialization.
   * @returns The initialized SDK options.
   */
  sdkInit(opts: SDKInitOptions): SDKInitOptions {
    const { baseURL, client } = opts;
    this.#client = client;
    return { baseURL: baseURL, client: client };
  }

  /**
   * If `splitPdfPage` is set to `true` in the request, the PDF file is split into
   * separate pages. Each page is sent as a separate request in parallel. The last
   * page request is returned by this method. It will return the original request
   * when: `splitPdfPage` is set to `false`, the file is not a PDF, or the HTTP
   * has not been initialized.
   *
   * @param hookCtx - The hook context containing information about the operation.
   * @param request - The request object.
   * @returns If `splitPdfPage` is set to `true`, the last page request; otherwise,
   * the original request.
   */
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
    const startingPageNumber = this.#getStartingPageNumber(formData);

    if (!splitPdfPage) {
      return request;
    }

    if (!this.#client) {
      console.warn("HTTP client not accessible! Continuing without splitting.");
      return request;
    }

    const [error, pdf, pagesCount] = await this.#loadPdf(file);
    if (file === null || pdf === null || error) {
      return request;
    }

    if (pagesCount < MIN_PAGES) {
      console.warn(
        `PDF has less than ${MIN_PAGES} pages. Continuing without splitting.`
      );
      return request;
    }

    const requestsLimit = this.#getSplitPdfCallThreads(formData);
    const splits = await this.#splitPdf(pdf, requestsLimit);
    const headers = this.#prepareRequestHeaders(request);

    const requestClone = request.clone();
    const requests: Request[] = [];

    // TODO: Marek Połom - Fix page numbering
    for (const { content, startPage } of splits) {
      // Both startPage and startingPageNumber are 1-based, so we need to subtract 1
      const firstPageNumber = startPage + startingPageNumber - 1;
      const body = await this.#prepareRequestBody(
        formData,
        content,
        file.name,
        firstPageNumber
      );
      const req = new Request(requestClone, {
        headers,
        body,
      });
      requests.push(req);
    }

    this.#partitionResponses[operationID] = new Array(requests.length);

    this.#partitionRequests[operationID] = async.parallelLimit(
      requests.slice(0, -1).map((req, pageIndex) => async () => {
        const pageNumber = pageIndex + startingPageNumber;
        try {
          const response = await this.#client!.request(req);
          if (response.status === 200) {
            (this.#partitionResponses[operationID] as Response[])[pageIndex] =
              response;
          }
        } catch (e) {
          console.error(`Failed to send request for page ${pageNumber}.`);
        }
      }),
      requestsLimit
    );

    return requests.at(-1) as Request;
  }

  /**
   * Executes after a successful API request. Awaits all parallel requests and combines
   * the responses into a single response object.
   * @param hookCtx - The context object containing information about the hook execution.
   * @param response - The response object returned from the API request.
   * @returns If requests were run in parallel, a combined response object; otherwise,
   * the original response.
   */
  async afterSuccess(
    hookCtx: AfterSuccessContext,
    response: Response
  ): Promise<Response> {
    const { operationID } = hookCtx;
    const responses = await this.#awaitAllRequests(operationID);

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

  /**
   * Executes after an unsuccessful API request. Awaits all parallel requests, if at least one
   * request was successful, combines the responses into a single response object and doesn't
   * throw an error. It will return an error only if all requests failed, or there was no PDF split.
   * @param hookCtx - The AfterErrorContext object containing information about the hook context.
   * @param response - The Response object representing the response received before the error occurred.
   * @param error - The error object that was thrown.
   * @returns If requests were run in parallel, and at least one was successful, a combined response
   * object; otherwise, the original response and error.
   */
  async afterError(
    hookCtx: AfterErrorContext,
    response: Response | null,
    error: unknown
  ): Promise<{ response: Response | null; error: unknown }> {
    const { operationID } = hookCtx;
    const responses = await this.#awaitAllRequests(operationID);

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

  // TODO: Marek Połom - Update function documentation (min max pages)
  /**
   * Converts a page of a PDF document to a Blob object.
   * @param pdf - The PDF document.
   * @param pageIndex - The index of the page to convert.
   * @returns A Promise that resolves to a Blob object representing the converted page.
   */
  async #pdfPagesToBlob(
    pdf: PDFDocument,
    startPage: number,
    endPage: number
  ): Promise<Blob> {
    const subPdf = await PDFDocument.create();
    // Create an array with page indices to copy
    // Converts 1-based page numbers to 0-based page indices
    const pageIndices = Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index - 1
    );
    const [page] = await subPdf.copyPages(pdf, pageIndices);
    subPdf.addPage(page);
    const subPdfBytes = await subPdf.save();
    return new Blob([subPdfBytes], {
      type: "application/pdf",
    });
  }

  // TODO: Marek Połom - Update function documentation (min max pages)
  /**
   * Retrieves an array of individual page files from a PDF file.
   *
   * @param file - The PDF file to extract pages from.
   * @returns A promise that resolves to an array of Blob objects, each representing
   * an individual page of the PDF.
   */
  async #splitPdf(pdf: PDFDocument, threadsCount: number): Promise<PdfSplit[]> {
    const pdfSplits: PdfSplit[] = [];
    const pagesCount = pdf.getPages().length;
    let splitSize = Math.floor(pagesCount / threadsCount);  // Compute the max split size to distribute between each thread
    splitSize = Math.max(splitSize, MIN_PAGES);             // Ensure the split size is at least MIN_PAGES
    splitSize = Math.min(splitSize, MAX_PAGES);             // Ensure the split size is at most MAX_PAGES
    const numberOfSplits = Math.ceil(pagesCount / splitSize);

    for (let i = 0; i < numberOfSplits; ++i) {
      const startPage = i * splitSize + 1;
      // If it's the last split, take the rest of the pages
      const endPage = Math.min(pagesCount, startPage + splitSize);
      const pdfSplit = await this.#pdfPagesToBlob(pdf, startPage, endPage);
      pdfSplits.push({ content: pdfSplit, startPage, endPage });
    }

    return pdfSplits;
  }

  /**
   * Removes the "content-length" header from the passed response headers.
   *
   * @param response - The response object.
   * @returns The modified headers object.
   */
  #prepareResponseHeaders(response: Response): Headers {
    const headers = new Headers(response.headers);
    headers.delete("content-length");
    return headers;
  }

  /**
   * Prepares the response body by extracting and flattening the JSON elements from
   * an array of responses.
   *
   * @param responses - An array of Response objects.
   * @returns A Promise that resolves to a string representation of the flattened
   * JSON elements.
   */
  async #prepareResponseBody(responses: Response[]): Promise<string> {
    const allElements: any[] = [];
    for (const res of responses) {
      const resElements = await res.clone().json();
      allElements.push(resElements);
    }
    return JSON.stringify(allElements.flat());
  }

  /**
   * Removes the "content-type" header from the given request headers.
   *
   * @param request - The request object containing the headers.
   * @returns The modified headers object.
   */
  #prepareRequestHeaders(request: Request): Headers {
    const headers = new Headers(request.headers);
    headers.delete("content-type");
    return headers;
  }

  // TODO: Marek Połom - Update function documentation
  /**
   * Prepares the request body for splitting a PDF.
   *
   * @param formData - The original form data.
   * @param fileContent - The content of the page to be split.
   * @param fileName - The name of the file.
   * @param startingPageNumber - Real page number from the document.
   * @returns A Promise that resolves to a FormData object representing
   * the prepared request body.
   */
  async #prepareRequestBody(
    formData: FormData,
    fileContent: Blob,
    fileName: string,
    startingPageNumber: number
  ): Promise<FormData> {
    const newFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      if (
        ![
          PARTITION_FORM_STARTING_PAGE_NUMBER_KEY,
          PARTITION_FORM_SPLIT_PDF_PAGE_KEY,
          PARTITION_FORM_FILES_KEY,
        ].includes(key)
      ) {
        newFormData.append(key, value);
      }
    }

    newFormData.append(PARTITION_FORM_SPLIT_PDF_PAGE_KEY, "false");
    newFormData.append(PARTITION_FORM_FILES_KEY, fileContent, fileName);
    newFormData.append(
      PARTITION_FORM_STARTING_PAGE_NUMBER_KEY,
      startingPageNumber.toString()
    );
    return newFormData;
  }

  /**
   * Clears the parallel requests and response data associated with the given
   * operation ID.
   *
   * @param operationID - The ID of the operation to clear.
   */
  #clearOperation(operationID: string) {
    delete this.#partitionResponses[operationID];
    delete this.#partitionRequests[operationID];
  }

  /**
   * Awaits all parallel requests for a given operation ID and returns the
   * responses.
   * @param operationID - The ID of the operation.
   * @returns A promise that resolves to an array of responses, or undefined
   * if there are no requests for the given operation ID.
   */
  async #awaitAllRequests(
    operationID: string
  ): Promise<Response[] | undefined> {
    const requests = this.#partitionRequests[operationID];

    if (!requests) {
      return;
    }

    await requests;

    return this.#partitionResponses[operationID]?.filter((e) => e) ?? [];
  }

  /**
   * Checks if the given file is a PDF. First it checks the `.pdf` file extension, then
   * it tries to load the file as a PDF using the `PDFDocument.load` method.
   * @param file - The file to check.
   * @returns A promise that resolves to `true` if the file is a PDF, or `false` otherwise.
   */
  async #loadPdf(
    file: File | null
  ): Promise<[boolean, PDFDocument | null, number]> {
    if (!file?.name.endsWith(".pdf")) {
      console.warn("Given file is not a PDF. Continuing without splitting.");
      return [true, null, 0];
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pagesCount = pdf.getPages().length;
      return [false, pdf, pagesCount];
    } catch (e) {
      console.error(e);
      console.warn(
        "Attempted to interpret file as pdf, but error arose when splitting by pages. Reverting to non-split pdf handling path."
      );
      return [true, null, 0];
    }
  }

  // TODO: Marek Połom - Update function documentation
  #getIntegerParameter(
    formData: FormData,
    parameterName: string,
    defaultValue: number
  ): number {
    let numberParameter = defaultValue;
    const formDataNumberParameter = parseInt(
      formData.get(parameterName) as string
    );

    if (isNaN(formDataNumberParameter)) {
      console.warn(
        `'${parameterName}' is not a valid integer. Using default value '${defaultValue}'.`
      );
    } else {
      numberParameter = formDataNumberParameter;
    }

    return numberParameter;
  }

  /**
   * Gets the number of call threads to use when splitting a PDF.
   * - The number of call threads is determined by the value of the request parameter
   * `split_pdf_thread`.
   * - If the parameter is not set or has an invalid value, the default number of
   * parallel requests (5) is used.
   * - If the number of call threads is greater than the maximum allowed (15), it is
   * clipped to the maximum value.
   * - If the number of call threads is less than 1, the default number of parallel
   * requests (5) is used.
   *
   * @returns The number of call threads to use when calling the API to split a PDF.
   */
  #getSplitPdfCallThreads(formData: FormData): number {
    let splitPdfThreads = this.#getIntegerParameter(
      formData,
      PARTITION_FORM_SPLIT_PDF_THREADS,
      DEFAULT_NUMBER_OF_PARALLEL_REQUESTS
    );

    if (splitPdfThreads > MAX_NUMBER_OF_PARALLEL_REQUESTS) {
      console.warn(
        `Clipping '${PARTITION_FORM_SPLIT_PDF_THREADS}' to ${MAX_NUMBER_OF_PARALLEL_REQUESTS}.`
      );
      splitPdfThreads = MAX_NUMBER_OF_PARALLEL_REQUESTS;
    } else if (splitPdfThreads < 1) {
      console.warn(`'${PARTITION_FORM_SPLIT_PDF_THREADS}' is less than 1.`);
      splitPdfThreads = DEFAULT_NUMBER_OF_PARALLEL_REQUESTS;
    }

    console.info(
      `Splitting PDF by page on client. Using ${splitPdfThreads} threads when calling API.`
    );
    console.info(
      `Set ${PARTITION_FORM_SPLIT_PDF_THREADS} parameter if you want to change that.`
    );
    return splitPdfThreads;
  }

  /**
   * Retrieves the starting page number from the provided form data.
   * If the starting page number is not a valid integer or less than 1,
   * it will use the default value `1`.
   *
   * @param formData - Request form data.
   * @returns The starting page number.
   */
  #getStartingPageNumber(formData: FormData): number {
    let startingPageNumber = this.#getIntegerParameter(
      formData,
      PARTITION_FORM_STARTING_PAGE_NUMBER_KEY,
      DEFAULT_STARTING_PAGE_NUMBER
    );

    if (startingPageNumber < 1) {
      console.warn(
        `'${PARTITION_FORM_STARTING_PAGE_NUMBER_KEY}' is less than 1. Using default value '${DEFAULT_STARTING_PAGE_NUMBER}'.`
      );
      startingPageNumber = DEFAULT_STARTING_PAGE_NUMBER;
    }

    return startingPageNumber;
  }
}
