const PublicGoogleSheetsParser = require("public-google-sheets-parser");

const logger = console;
logger.verbose = process.env.LOG_VERBOSE === "1" ? logger.info : () => {};

/**
 * From key, value array, creates a structured object, with support for array notation.
 * Example:
 * ```
 * [
 *   { key: "a.b.c", value: "1" },
 *   { key: "a.b.d", value: "2" },
 *   { key: "a.b.e[]", value: "3" },
 *   { key: "a.b.c", value: 1 }
 * ]
 *
 * // becomes
 * {
 *  a: {
 *   b: {
 *     c: "1"
 *     d: "2"
 *   },
 *   e: ["3"]
 * }
 * ```
 * @param {{ key: string, value: string }[]} data
 * @returns {Record<string, unknown>}
 */
function createStructuredObject(data) {
  const result = {};

  for (let i = 0; i < data.length; i++) {
    const { key, value } = data[i];
    const keys = key?.split(".") ?? [];
    let obj = result;

    let val = value;
    if (typeof val === "string") {
      val = val.trim();
      if (val === "TRUE" || val === "true") {
        val = true;
      } else if (val === "FALSE" || val === "false") {
        val = false;
      } else if (value === "NULL") {
        val = null;
      } else if (val.match(/^-?\d+\.?\d*$/)) {
        // match number
        val = Number(val);
      }
      // Match hexadecimal in format 0x123456
      else if (val.match(/^0x[0-9a-fA-F]+$/)) {
        val = Number(val);
      }
    }

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const last = i === keys.length - 1;

      if (last) {
        if (k.endsWith("[]")) {
          const arrayKey = k.slice(0, -2);
          const narr = obj[arrayKey] || [];
          narr.push(val);
          obj[arrayKey] = narr;
        } else {
          obj[k] = val;
        }
      } else {
        let nobj = obj[k] || {};
        if (typeof nobj === "string") {
          console.warn("Unexpected string value", keys.slice(0, i + 1).join("."));
          nobj = {};
        }
        obj[k] = nobj;
        obj = nobj;
        if (i === 0) {
          result[k] = obj;
        }
      }
    }
  }

  return result;
}

const parse = async (spreadsheetId, sheetName, sheetId, fs, file, variable) => {
  logger.verbose("Parsing", spreadsheetId, "tab", sheetName ?? sheetId);
  const parser = new PublicGoogleSheetsParser(spreadsheetId, { sheetName });
  const rows = await parser.parse();
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("Spreadsheet" + spreadsheetId + " tab " + sheetName ?? sheetId + " have no rows");
  }

  let data = {};
  try {
    data = createStructuredObject(rows);
  } catch (e) {
    console.error("Failed to parse spreadsheetId", spreadsheetId, "error", e);
  }

  if (Object.keys(data).length === 0) {
    throw new Error("Spreadsheet" + spreadsheetId + " tab " + sheetName ?? sheetId + " is empty");
  }

  if (fs && file !== undefined) {
    const types =
      file.endsWith(".ts") || file.endsWith(".tsx")
        ? {
            asConst: " as const",
            declareType: `
type ${variable}Type = typeof ${variable};
`,
            castToType: ` as unknown as ${variable}Type`,
          }
        : {
            asConst: "",
            declareType: "",
            castToType: "",
          };

    const content = `// prettier-ignore\n// eslint-disable
// AUTOGENERATED!!! Do not change
import { parse } from "generate-content-spreadsheet";

/**
 * Content from spreadsheet ${spreadsheetId} tab ${sheetName ?? sheetId}
 * @link https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit
 */
export let ${variable} = ${JSON.stringify(data, null, 2)}${types.asConst};
${types.declareType}
/**
 * Update ${variable}.
 * Will fetch new strings and update ${variable} in-place
 */
export const update = async () => {
  try {
    const data = await parse("${spreadsheetId}", ${sheetName ? '"' + sheetName + '"' : "undefined"}, ${
      sheetId ? '"' + sheetId + '"' : "undefined"
    }, undefined, undefined, undefined);
    const updated = data${types.castToType};
    ${variable} = updated;
    return updated;
  } catch (e) {
    console.warn("Failed to update", e);
    return ${variable};
  }
}
`;
    const existing = fs.statSync(file, { throwIfNoEntry: false }) ? fs.readFileSync(file, { encoding: "utf-8" }) : "";

    if (existing != content) {
      logger.info("Writing", file, "from spreadsheet", spreadsheetId, "tab", sheetName ?? sheetId);
      fs.writeFileSync(file, content);
    }

    return data;
  } else {
    return data;
  }
};

module.exports = {
  parse,
  createStructuredObject,
};
