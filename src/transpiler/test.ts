import { Transpiler, TestCase, Plugin } from "@transpiler/mod.ts";
import { assertEquals } from "@std/assert";

const testCases: TestCase[] = [
  {
    markdownInput: "Hello, world!",
    expectedTokens: [
      { id: "Text", value: "Hello, world!" },
    ],
    expectedHTML: `Hello, world!`,
  },
];

const transpiler = new Transpiler();

for (const testCase of testCases) {
  Deno.test(`Token test case: ${testCase.markdownInput}`, () => {
    assertEquals(
      transpiler.lex(testCase.markdownInput, 0).tokens,
      testCase.expectedTokens,
    );
  });

  Deno.test(`Render HTML test case: ${testCase.markdownInput}`, () => {
    assertEquals(
      transpiler.renderHTML(testCase.markdownInput),
      testCase.expectedHTML,
    );
  });
}

Deno.test("Can't add duplicate plugin", () => {

  const match = (_src: string, _pos: number) => {
    return false; 
  }

  const lex = (_src: string, pos: number) => {
    return { tokens: [], pos };
  }

  const plugin: Plugin = {
    id: "Text",
    lex,
    match,
    render: () => {
      return "";
    },
  };

  transpiler.addPlugin(plugin);

  try {
    transpiler.addPlugin(plugin);
  } catch (e) {
    assertEquals((e as Error).message, `Plugin type ${plugin.id} already exists`);
  }

})
