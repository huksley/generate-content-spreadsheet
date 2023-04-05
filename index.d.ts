/**
 * Parse spreadsheet and generate structured content.
 * If no fileName is provided, will return parsed object.
 *
 * @param spreadsheetId Spreadsheet ID
 * @param sheetName Sheet name, optional, if not provided will use first sheet
 * @param sheetId Sheet ID, optional, if not provided will use first sheet
 * @param fs Filesystem module (i.e. require('fs'))
 * @param fileName Source code file to write.
 * @param variable Variable name
 * @returns Promise with parsed object
 */
export function parse(
  spreadsheetId: string,
  sheetName?: string,
  sheetId?: string,
  fs: unknown,
  fileName: string | undefined,
  variable: string | undefined
): Promise<Record<string, unknown>>;

/**
 * Webpack plugin to parse spreadsheet.
 * Automatically parses after compilation phase.
 * Will write file only if content were changed.
 * */
export class GenerateContentSpreadsheetPlugin {
  constructor(fileName: string, variable: string, spreadsheetId: string, sheetName?: string, sheetId?: string);
}
