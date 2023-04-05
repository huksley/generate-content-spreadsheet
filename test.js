const { createStructuredObject, parse } = require("./index");
const assert = require("assert");

const str = (str) => {
  const result = [];
  str = str.trim();
  for (const line of str.split("\n")) {
    const [key, value] = line.split("=");
    result.push({ key, value });
  }
  return result;
};

console.log(
  createStructuredObject([
    {
      key: "a.b.c",
      value: "1",
    },
  ])
);

console.log(
  JSON.stringify(
    createStructuredObject(
      str(`
title=asdasdas
root.title=dasdsa
root.description[]=dasdsads
root.yc.url=dasdsadsa1
root.yc.title=dasdsadsa2
root.yc.enabled=TRUE
root.yc.description[]=dasdsadsa3
root.yc.description[]=dasdsadsa4
ph.url=dasdsa
ph.image=dsdsds
footer.notice=dsdsds
footer.url=dsdsds
twitterHandle=1111
`)
    ),
    null,
    2
  )
);

if (process.env.SPREADSHEET_ID) {
  parse(process.env.SPREADSHEET_ID).then((values) => {
    console.log(JSON.stringify(values, null, 2));
  });
}
