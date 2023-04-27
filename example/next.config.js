const { GenerateContentSpreadsheetPlugin } = require("generate-content-spreadsheet");

const contentPlugin = new GenerateContentSpreadsheetPlugin(
  __dirname + "/components/Content.ts",
  "Strings",
  "1RXjhi32S2zIfFivybqL95tKybpN66z-d7skajXJ1jsM",
  "Strings"
);

/** Execute before build once so the linting and type checking will work */
contentPlugin.run();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    // Remove this check to enable the plugin
    process.env.EXAMPLE_DISABLE === "1" ? null : config.plugins?.push(contentPlugin);
    return config;
  },
};

module.exports = nextConfig;
