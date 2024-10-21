import {
  EXTRACT_IMAGE_BLOCK_TYPES,
  PARTITION_FORM_FILES_KEY,
  PARTITION_FORM_SPLIT_PDF_PAGE_KEY,
  PARTITION_FORM_STARTING_PAGE_NUMBER_KEY,
} from "../common.js";

/**
 * Removes the "content-length" header from the passed response headers.
 *
 * @param response - The response object.
 * @returns The modified headers object.
 */
export function prepareResponseHeaders(response: Response): Headers {
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
export async function prepareResponseBody(
  responses: Response[]
): Promise<string> {
  const allElements: any[] = [];
  let index = 1;
  for (const res of responses) {
    if (res.status != 200) {
      console.warn("Failed to partition set #%d, its elements will be omitted in the final result.", index);
    }

    const resElements = await res.json();
    allElements.push(resElements);
    index++;
  }
  return JSON.stringify(allElements.flat());
}

/**
 * Removes the "content-type" header from the given request headers.
 *
 * @param request - The request object containing the headers.
 * @returns The modified headers object.
 */
export function prepareRequestHeaders(request: Request): Headers {
  const headers = new Headers(request.headers);
  headers.delete("content-type");
  return headers;
}

/**
 * Prepares the request body for splitting a PDF.
 *
 * @param formData - The original form data.
 * @param fileContent - The content of the pages to be split.
 * @param fileName - The name of the file.
 * @param startingPageNumber - Real first page number of the split.
 * @returns A Promise that resolves to a FormData object representing
 * the prepared request body.
 */
export async function prepareRequestBody(
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

  if (formData.has(EXTRACT_IMAGE_BLOCK_TYPES)) {
    newFormData.delete(EXTRACT_IMAGE_BLOCK_TYPES);
    const extractImageBlockTypes = (formData.get(EXTRACT_IMAGE_BLOCK_TYPES)?.toString() || "").split(",");
    for(const blockType of extractImageBlockTypes) {
      newFormData.append(EXTRACT_IMAGE_BLOCK_TYPES, blockType);
    }
  }

  return newFormData;
}
