/**
 * Parse spreadsheet and generate structured content.
 * If no fileName is provided, will return parsed object.
 *
 * @param spreadsheetId Spreadsheet ID
 * @param sheetName Sheet name, optional, if not provided will use first sheet
 * @param sheetId Sheet ID, optional, if not provided will use first sheet
 * @param fs Filesystem module (i.e. require('fs')) only when running as Webpack plugin
 * @param fileName Source code file to write.
 * @param variable Variable name
 * @returns Promise with parsed object
 */
export function parse(
  spreadsheetId: string,
  sheetName?: string,
  sheetId?: string,
  fs?: unknown,
  fileName?: string,
  variable?: string
): Promise<Record<string, unknown>>;

/**
 * From key, value array, creates a structured object, with support for array notation.
 */
export function createStructuredObject(data: { key: string; value: string }[]): Record<string, unknown>;
