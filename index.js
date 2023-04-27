const { parse, createStructuredObject } = require("./parse");

const logger = console;
logger.verbose = process.env.LOG_VERBOSE === "1" ? logger.info : () => {};

/** Plugs into WebPack to generate after compilation */
class GenerateContentSpreadsheetPlugin {
  constructor(file, variable, spreadsheetId, sheetName, sheetId) {
    this.file = file;
    this.variable = variable;
    this.spreadsheetId = spreadsheetId;
    this.sheetName = sheetName;
    this.sheetId = sheetId;
    this.dependencies = [];
  }

  run(fs) {
    if (fs === undefined) {
      const { statSync, readFileSync, writeFileSync } = require("fs");
      fs = {
        statSync,
        readFileSync,
        writeFileSync,
      };
    }
    return parse(this.spreadsheetId, this.sheetName, this.sheetId, fs, this.file, this.variable);
  }

  apply(compiler) {
    if (compiler.hooks?.afterCompile) {
      compiler.hooks.afterCompile.tap(GenerateContentSpreadsheetPlugin.name, (compilation) => {
        logger.verbose("Adding dependencies", this.dependencies);
        this.dependencies.forEach((file) => compilation.fileDependencies.add(file));
      });
    }

    if (compiler.hooks && compiler.hooks.beforeCompile) {
      compiler.hooks.beforeCompile.tapAsync(GenerateContentSpreadsheetPlugin.name, (context, callback) => {
        this.dependencies = [];
        this.dependencies.push(this.file);
        this.run({
          ...compiler.inputFileSystem,
          ...compiler.outputFileSystem,
        })
          .then(() => callback())
          .catch((e) => {
            logger.warn("Failed to write", e);
          });
      });
    } else {
      logger.warn("Cannot find compiler.hooks.beforeRun hook");
    }
  }
}

module.exports = {
  parse,
  createStructuredObject,
  GenerateContentSpreadsheetPlugin,
};
