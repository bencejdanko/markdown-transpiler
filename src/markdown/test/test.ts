import { lexCadenceMarkdown, renderHTML } from "@markdown/mod.ts";
import { assertEquals } from "@std/assert";

// Import all test cases
import headerCases from "./header/header1.ts";

// Load and run all test cases
for (const testCase of headerCases) {
  Deno.test(`Token test case: ${testCase.description || testCase.markdownInput}`, () => {
    assertEquals(lexCadenceMarkdown(testCase.markdownInput), testCase.expectedTokens);
  });

  Deno.test(`Render HTML test case: ${testCase.description || testCase.markdownInput}`, () => {
    assertEquals(renderHTML(testCase.markdownInput), testCase.expectedHTML);
  });
}