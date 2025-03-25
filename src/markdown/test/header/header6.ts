import { Token, BlockTokens, InlineTokens } from "@markdown/types/mod.ts";
import { TestCase } from "@markdown/types/mod.ts"

const markdownInput = "###### Hello, world!";

const expectedTokens: Token[] = [
  {
    type: BlockTokens.Header6,
    children: [{ type: InlineTokens.Text, value: "Hello, world!" }],
  },
];

const expectedRender = `<h6>Hello, world!</h6>`;

export default new TestCase(markdownInput, expectedTokens, expectedRender);
