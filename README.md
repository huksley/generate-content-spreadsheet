# Generate content spreadsheet

Use Google Spreadsheet as simple, painless, robust CMS for text and structured content!

From your (publicly shared) Google Spreadsheet, creates content as JavaScript (TypeScript) object and allows it to be automatically updated whenever you recompile your code.

Works beautifully with NextJS or any Webpack environment where you can add Webpack plugin!

Creates typed content structure so your DevEx is great, as you can just discover the content object as you type.

Based on [public-google-sheets-parser](https://www.npmjs.com/package/public-google-sheets-parser) JavaScript package, which can parse publically available spreadsheets without the need of authorization.

## Example usage (NextJS)

Add to your ./next.config.js:

```js
const { GenerateContentSpreadsheetPlugin } = require("generate-content-spreadsheet");

const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    config.plugins?.push(
      new GenerateContentSpreadsheetPlugin(
        // Script it will write
        __dirname + "/components/Content.ts",
        // Variable in source file
        "Strings",
        // Spreadsheet id, see https://www.npmjs.com/package/public-google-sheets-parser
        "MY_SPREADSHEET_ID",
        // Spreadsheet tab name
        "Sheet1",
        // Spreadsheet tab gid
        undefined
      )
    );
    return config;
  },
};
```

Then, in your code, you can use it like this:

```js
import { Strings } from "../components/Content";

const MyComponent = () => {
  return <div>{Strings.title}</div>;
};
```

## How it works

It uses [public-google-sheets-parser](https://www.npmjs.com/package/public-google-sheets-parser) to parse your spreadsheet and then writes it to a TypeScript file.

It expects spreadsheet to have following REQUIRED columns:

- key - JQ path to the object where to put the value, for example "title" or "content.title" or event "content.description[]"
- value - String value to put in the object. WARNING: Only string values are supported!

### Example spreadsheet format:

Create Google Spreadsheet with following columns, and then share it publicly (File => Share => Anyone with the link can view).

| key                | value                       |
| ------------------ | --------------------------- |
| title              | My title                    |
| root.title         | My index page title         |
| root.description[] | My index page description 1 |
| root.description[] | My index page description 2 |

### Example output:

```js
export const Strings = {
  title: "My title",
  root: {
    title: "My index page title",
    description: ["My index page description 1", "My index page description 2"],
  },
};
```

### Ready-to-use example

You can find ready-to-use example in the [example](./example) folder.

[Click here]() to clone it as new git repository.

## Installation

```
npm i generate-content-spreadsheet
```

## FAQ

### Why?

I needed a simple way to manage content for my NextJS website. I wanted to use Google Spreadsheet as a CMS, but I didn't want to use any of the existing solutions, because they were either too complicated, too expensive, or too limited.

### Why not use Headless CMS?

If you have lots of images, videos, or other files, then you will need to use fully featured CMS. But if you only need to manage simple text content, then you can use this package.

### I am getting wrong columns

- Make sure you have "key" and "value" columns in your spreadsheet. If you have different column names, then you can change them in the plugin options.
- Make sure your content is forced to be TEXT. If you have numbers, Google Sheets returns wrong data.

### License

MIT License (c) 2023 Ruslan Gainutdinov
