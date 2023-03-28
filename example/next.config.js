const { GenerateContentSpreadsheetPlugin } = require("generate-content-spreadsheet");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    config.plugins?.push(
      new GenerateContentSpreadsheetPlugin(
        __dirname + "/components/Content.ts",
        "Strings",
        "1RXjhi32S2zIfFivybqL95tKybpN66z-d7skajXJ1jsM",
        "Strings"
      )
    );
    return config;
  },
};

module.exports = nextConfig;
