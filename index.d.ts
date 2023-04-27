import type { parse, createStructuredObject } from "./parse.d.ts";

declare module "generate-content-spreadsheet/parse" {
  export { parse, createStructuredObject };
}

/**
 * Webpack plugin to parse spreadsheet.
 * Automatically parses after compilation phase.
 * Will write file only if content were changed.
 * */
export class GenerateContentSpreadsheetPlugin {
  constructor(fileName: string, variable: string, spreadsheetId: string, sheetName?: string, sheetId?: string);
}

declare module "generate-content-spreadsheet" {
  export { parse, createStructuredObject, GenerateContentSpreadsheetPlugin };
}
