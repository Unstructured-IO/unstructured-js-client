import {
  DEFAULT_NUMBER_OF_PARALLEL_REQUESTS,
  DEFAULT_STARTING_PAGE_NUMBER,
  MAX_NUMBER_OF_PARALLEL_REQUESTS,
  PARTITION_FORM_SPLIT_PDF_CONCURRENCY_LEVEL,
  PARTITION_FORM_STARTING_PAGE_NUMBER_KEY,
} from "../common";

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

  console.info(
    `Splitting PDF by page on client. Using ${splitPdfConcurrencyLevel} threads when calling API.`
  );
  console.info(
    `Set ${PARTITION_FORM_SPLIT_PDF_CONCURRENCY_LEVEL} parameter if you want to change that.`
  );
  return splitPdfConcurrencyLevel;
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
