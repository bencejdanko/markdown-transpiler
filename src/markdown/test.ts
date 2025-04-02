import { TestCase, TestCaseConfig } from "@transpiler/mod.ts";
import CadenceMarkdown from "./mod.ts";
import { assertEquals } from "@std/assert";

import { parse } from "jsr:@std/yaml";


async function readTestCase(path: string): Promise<TestCase | undefined> {
  try {
    const resolvedPath = new URL(path, import.meta.url).pathname;
    const md = await Deno.readFile(resolvedPath + "case.md");
    const html = await Deno.readFile(resolvedPath + "case.html");
    const tokens = await import(resolvedPath + "case.ts");

    let config: Uint8Array | undefined;
    try {
      config = await Deno.readFile(resolvedPath + "case.yml");
    } catch {
      config = undefined;
    }
    
    return {
      markdownInput: new TextDecoder().decode(md),
      expectedTokens: tokens.default,
      expectedHTML: new TextDecoder().decode(html),
      config: parse(new TextDecoder().decode(config)) as TestCaseConfig | undefined,
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
  { name: "THEMATIC BREAK TEST CASES", path: "./examples/thematic_break" },
  { name: "BLOCKQUOTE TEST CASES", path: "./examples/blockquote" },
  { name: "ESCAPE TEST CASES", path: "./examples/escape" },
  { name: "MATH TEST CASES", path: "./examples/math" },
  { name: "IMAGE TEST CASES", path: "./examples/image" },
  { name: "ANCHOR TEST CASES", path: "./examples/anchor" },
  { name: "FRONT MATTER TEST CASES", path: "./examples/frontmatter" },
];

for (const group of testCaseGroups) {
  const testCases = await readAllTestCases(group.path);

  console.log(`%c${group.name}`, "color: blue; font-weight: bold;");
  for (const [index, testCase] of testCases.entries()) {
    console.log(`CASE ${index}: %c${testCase.markdownInput.replace(/ /g, '→')}`, "color: green; font-weight: semibold;");
    if (testCase.config?.description) {
      console.log(`%cDescription: ${testCase.config.description}`, "color: orange; font-weight: normal;");
    }

    Deno.test(`${group.name} CASE ${index} TOKENS:`, () => {
      assertEquals(
        CadenceMarkdown.lex(testCase.markdownInput, 0).tokens,
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
