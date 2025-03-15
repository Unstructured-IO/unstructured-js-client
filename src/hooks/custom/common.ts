import {HTTPClient} from "../../lib/http.js";

/**
 * Regular expression pattern for matching base hostnames in the form of "*.unstructuredapp.io".
 */
export const BASE_HOSTNAME_REGEX = /^.*\.unstructuredapp\.io$/;

/**
 * The base protocol used for HTTPS requests.
 */
export const BASE_PROTOCOL = "https:";

export const PARTITION_FORM_FILES_KEY = "files";
export const PARTITION_FORM_SPLIT_PDF_PAGE_KEY = "split_pdf_page";
export const PARTITION_FORM_SPLIT_PDF_ALLOW_FAILED_KEY = "split_pdf_allow_failed";
export const PARTITION_FORM_STARTING_PAGE_NUMBER_KEY = "starting_page_number";
export const PARTITION_FORM_SPLIT_PDF_PAGE_RANGE_KEY = "split_pdf_page_range";
export const PARTITION_FORM_SPLIT_PDF_CONCURRENCY_LEVEL =
  "split_pdf_concurrency_level";

export const EXTRACT_IMAGE_BLOCK_TYPES = "extract_image_block_types";

export const DEFAULT_STARTING_PAGE_NUMBER = 1;
export const DEFAULT_NUMBER_OF_PARALLEL_REQUESTS = 10;
export const DEFAULT_SPLIT_PDF_ALLOW_FAILED_KEY = false;
export const MAX_NUMBER_OF_PARALLEL_REQUESTS = 50;

export const MIN_PAGES_PER_THREAD = 2;
export const MAX_PAGES_PER_THREAD = 20;

export class HTTPClientExtension extends HTTPClient {
  constructor() {
    super();
  }

  override async request(request: Request): Promise<Response> {
    if (request.url === "https://no-op/") {
      return new Response('{}', {
        headers: [
            ["fake-response", "fake-response"]
        ],
        status: 200,
        statusText: 'OK_NO_OP'
      });
    }
    return super.request(request);
   }
}

export function generateGuid() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}