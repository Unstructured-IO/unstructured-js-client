import {
  DEFAULT_NUMBER_OF_PARALLEL_REQUESTS, DEFAULT_SPLIT_PDF_ALLOW_FAILED_KEY,
  DEFAULT_STARTING_PAGE_NUMBER,
  MAX_NUMBER_OF_PARALLEL_REQUESTS, PARTITION_FORM_SPLIT_PDF_ALLOW_FAILED_KEY,
  PARTITION_FORM_SPLIT_PDF_CONCURRENCY_LEVEL,
  PARTITION_FORM_SPLIT_PDF_PAGE_RANGE_KEY,
  PARTITION_FORM_STARTING_PAGE_NUMBER_KEY,
} from "../common.js";

/**
 * Retrieves an integer parameter from the given form data.
 * If the parameter is not found or is not a valid integer, the default value is returned.
 *
 * @param formData - The form data object.
 * @param parameterName - The name of the parameter to retrieve.
 * @param defaultValue - The default value to use if the parameter is not found or is not
 * a valid integer.
 * @returns The integer value of the parameter.
 */
function getIntegerParameter(
  formData: FormData,
  parameterName: string,
  defaultValue: number
): number {
  let numberParameter = defaultValue;
  const formDataParameter = formData.get(parameterName);

  if (formDataParameter === null) {
    return numberParameter;
  }

  const formDataNumberParameter = parseInt(formDataParameter as string);

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
 * Retrieves a boolean parameter from the given form data.
 * If the parameter is not found or does not have true/false value, the default value is returned.
 *
 * @param formData - The form data object.
 * @param parameterName - The name of the parameter to retrieve.
 * @param defaultValue - The default value to use if the parameter is not found or is not
 * a true/false string.
 * @returns The boolean value of the parameter.
 */
function getBooleanParameter(
  formData: FormData,
  parameterName: string,
  defaultValue: boolean
): boolean {
  let booleanParameter = defaultValue;
  const formDataParameter = formData.get(parameterName);

  if (formDataParameter === null) {
    return booleanParameter;
  }

  const formDataBooleanParameterString = formDataParameter as string;

  if (formDataBooleanParameterString.toLowerCase() === "true") {
    booleanParameter = true;
  } else if (formDataBooleanParameterString.toLowerCase() === "false") {
    booleanParameter = false;
  } else {
    console.warn(
      `'${parameterName}' is not a valid boolean. Using default value '${defaultValue}'.`
    );
  }

  return booleanParameter;
}

/**
 * Retrieves and validates a page range from FormData, ensuring that the start and end values are defined and within bounds.
 *
 * @param formData - The FormData object containing the page range parameter.
 * @param maxPages - The maximum number of pages in the document.
 * @returns {[number, number]} - A tuple containing the validated start and end page numbers.
 *
 * @throws Will throw an error if the page range is invalid or out of bounds.
 */
export function getSplitPdfPageRange(formData: FormData, maxPages: number): [number, number] {
  const formDataParameter = formData.get(PARTITION_FORM_SPLIT_PDF_PAGE_RANGE_KEY);
  const pageRange = String(formDataParameter).split(",").map(Number)

  const start = pageRange[0] || 1;
  const end = pageRange[1] || maxPages;

  if (!(start > 0 && start <= maxPages) || !(end > 0 && end <= maxPages) || !(start <= end)) {
    const msg = `Page range (${start} to ${end}) is out of bounds. Values should be between 1 and ${maxPages}.`;
    console.error(msg);
    throw new Error(msg);
  }

  return [start, end];
}

/**
 * Gets the number of maximum requests that can be made when splitting PDF.
 * - The number of maximum requests is determined by the value of the request parameter
 * `split_pdf_thread`.
 * - If the parameter is not set or has an invalid value, the default number of
 * parallel requests (5) is used.
 * - If the number of maximum requests is greater than the maximum allowed (15), it is
 * clipped to the maximum value.
 * - If the number of maximum requests is less than 1, the default number of parallel
 * requests (5) is used.
 *
 * @returns The number of maximum requests to use when calling the API to split a PDF.
 */
export function getSplitPdfConcurrencyLevel(formData: FormData): number {
  let splitPdfConcurrencyLevel = getIntegerParameter(
    formData,
    PARTITION_FORM_SPLIT_PDF_CONCURRENCY_LEVEL,
    DEFAULT_NUMBER_OF_PARALLEL_REQUESTS
  );

  if (splitPdfConcurrencyLevel > MAX_NUMBER_OF_PARALLEL_REQUESTS) {
    console.warn(
      `Clipping '${PARTITION_FORM_SPLIT_PDF_CONCURRENCY_LEVEL}' to ${MAX_NUMBER_OF_PARALLEL_REQUESTS}.`
    );
    splitPdfConcurrencyLevel = MAX_NUMBER_OF_PARALLEL_REQUESTS;
  } else if (splitPdfConcurrencyLevel < 1) {
    console.warn(
      `'${PARTITION_FORM_SPLIT_PDF_CONCURRENCY_LEVEL}' is less than 1.`
    );
    splitPdfConcurrencyLevel = DEFAULT_NUMBER_OF_PARALLEL_REQUESTS;
  }
  return splitPdfConcurrencyLevel;
}

/**
 * Gets the allowFailed parameter which decides whether the partial requests can fail or not
 * when using splitPdfPage parameter.
 * - The number of maximum requests is determined by the value of the request parameter
 * `split_pdf_thread`.
 * - If the parameter is not set or has an invalid value, the default number of
 * parallel requests (5) is used.
 * - If the number of maximum requests is greater than the maximum allowed (15), it is
 * clipped to the maximum value.
 * - If the number of maximum requests is less than 1, the default number of parallel
 * requests (5) is used.
 *
 * @returns The number of maximum requests to use when calling the API to split a PDF.
 */
export function getSplitPdfAllowFailed(formData: FormData): boolean {
  const splitPdfAllowFailed = getBooleanParameter(
    formData,
    PARTITION_FORM_SPLIT_PDF_ALLOW_FAILED_KEY,
    DEFAULT_SPLIT_PDF_ALLOW_FAILED_KEY
  );
  return splitPdfAllowFailed;
}

/**
 * Retrieves the starting page number from the provided form data.
 * If the starting page number is not a valid integer or less than 1,
 * it will use the default value `1`.
 *
 * @param formData - Request form data.
 * @returns The starting page number.
 */
export function getStartingPageNumber(formData: FormData): number {
  let startingPageNumber = getIntegerParameter(
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
