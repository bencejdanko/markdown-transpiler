import { Token, BlockTokens, InlineTokens } from "@markdown/types/mod.ts";
import { TestCase } from "@markdown/types/mod.ts"

const markdownInput = "# Hello, world!";

const expectedTokens: Token[] = [
  {
    type: BlockTokens.Header1,
    children: [{ type: InlineTokens.Text, value: "Hello, world!" }],
  },
];

const expectedRender = `<h1>Hello, world!</h1>`;

export default new TestCase(markdownInput, expectedTokens, expectedRender);
