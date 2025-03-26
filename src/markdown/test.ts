import { TestCase } from "@transpiler/mod.ts";
import CadenceMarkdown from "./mod.ts";
import { assertEquals } from "@std/assert";

async function readTestCase(path: string): Promise<TestCase | undefined> {
  try {
    const resolvedPath = new URL(path, import.meta.url).pathname;
    const md = await Deno.readFile(resolvedPath + "case.md");
    const html = await Deno.readFile(resolvedPath + "case.html");
    const tokens = await import(resolvedPath + "case.ts");
    
    return {
      markdownInput: new TextDecoder().decode(md),
      expectedTokens: tokens.default,
      expectedHTML: new TextDecoder().decode(html),
    };
  } catch (e) {
    console.error(e);
    return undefined
  }
}

async function readAllTestCases(basePath: string): Promise<TestCase[]> {
  const resolvedBasePath = new URL(basePath, import.meta.url).pathname;
  const testCases: TestCase[] = [];
  for await (const entry of Deno.readDir(resolvedBasePath)) {
    if (entry.isDirectory) {
      const testCase = await readTestCase(`${resolvedBasePath}/${entry.name}/`);
      if (testCase) {
        testCases.push(testCase);
      }
    }
  }
  return testCases;
}

const testCaseGroups = [
  { name: "HEADER TEST CASES", path: "./examples/header" },
  { name: "PARAGRAPH TEST CASES", path: "./examples/paragraph" },
];

for (const group of testCaseGroups) {
  const testCases = await readAllTestCases(group.path);

  console.log(`%c${group.name}`, "color: blue; font-weight: bold;");
  for (const [index, testCase] of testCases.entries()) {
    console.log(`CASE ${index}: %c${testCase.markdownInput}`, "color: green; font-weight: semibold;");

    Deno.test(`${group.name} CASE ${index} TOKENS:`, () => {
      assertEquals(
        CadenceMarkdown.lex(testCase.markdownInput),
        testCase.expectedTokens,
      );
    });

    Deno.test(`${group.name} CASE ${index} HTML:`, () => {
      assertEquals(
        CadenceMarkdown.renderHTML(testCase.markdownInput),
        testCase.expectedHTML,
      );
    });
  }
}
