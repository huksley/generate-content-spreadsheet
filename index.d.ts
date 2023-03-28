/**
 * Parse spreadsheet and generate structured content. If no fileName is provided, will return parsed object.
 *
 * @param fs Filesystem module (i.e. require('fs'))
 * @param fileName Source code file to write.
 * @param variable Variable name
 * @param spreadsheetId Spreadsheet ID
 * @param sheetName Sheet name
 * @param sheetId Sheet ID
 * @returns Promise with parsed object
 */
export function parse(
  fs: unknown,
  fileName: string | undefined,
  variable: string | undefined,
  spreadsheetId: string,
  sheetName?: string,
  sheetId?: string
): Promise<Record<string, unknown>>;

/** Webpack plugin to parse spreadsheet. Automatically parses after compilation phase. Will write file only if content were changed. */
export class GenerateContentSpreadsheetPlugin {
  constructor(fileName: string, variable: string, spreadsheetId: string, sheetName?: string, sheetId?: string);
}
