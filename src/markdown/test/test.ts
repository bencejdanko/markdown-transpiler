import { lex, renderHTML } from "@markdown/mod.ts";
import { assertEquals } from "@std/assert";
import { TestCase } from "@markdown/types/mod.ts"

// Import all test cases
import Header1Case from "./header/header1.ts";
import Header2Case from "./header/header2.ts";
import Header3Case from "./header/header3.ts";
import Header4Case from "./header/header4.ts";
import Header5Case from "./header/header5.ts";
import Header6Case from "./header/header6.ts";
import HeaderThematicBreakCase from "./header/thematic_break.ts";

const headerCases: TestCase[] = [
  Header1Case,
  Header2Case,
  Header3Case,
  Header4Case,
  Header5Case,
  Header6Case,
  HeaderThematicBreakCase
];

// Load and run all test cases
for (const testCase of headerCases) {
  Deno.test(`Token test case: ${testCase.description || testCase.markdownInput}`, () => {
    assertEquals(lex(testCase.markdownInput), testCase.expectedTokens);
  });

  Deno.test(`Render test case: ${testCase.description || testCase.markdownInput}`, () => {
    assertEquals(renderHTML(testCase.markdownInput), testCase.expectedRender);
  });
}