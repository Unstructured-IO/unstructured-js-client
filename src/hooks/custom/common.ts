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

export const DEFAULT_STARTING_PAGE_NUMBER = 1;
export const DEFAULT_NUMBER_OF_PARALLEL_REQUESTS = 8;
export const DEFAULT_SPLIT_PDF_ALLOW_FAILED_KEY = false;
export const MAX_NUMBER_OF_PARALLEL_REQUESTS = 15;

export const MIN_PAGES_PER_THREAD = 2;
export const MAX_PAGES_PER_THREAD = 20;
