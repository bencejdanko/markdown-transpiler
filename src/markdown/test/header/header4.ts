import { Token, BlockTokens, InlineTokens } from "@markdown/types/mod.ts";
import { TestCase } from "@markdown/types/mod.ts"

const markdownInput = "#### Hello, world!";

const expectedTokens: Token[] = [
  {
    type: BlockTokens.Header4,
    children: [{ type: InlineTokens.Text, value: "Hello, world!" }],
  },
];

const expectedRender = `<h4>Hello, world!</h4>`;

export default new TestCase(markdownInput, expectedTokens, expectedRender);
