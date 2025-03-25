import { Token, BlockTokens, InlineTokens } from "@markdown/types/mod.ts";
import { TestCase } from "@markdown/types/mod.ts"

const markdownInput = "##### Hello, world!";

const expectedTokens: Token[] = [
  {
    type: BlockTokens.Header5,
    children: [{ type: InlineTokens.Text, value: "Hello, world!" }],
  },
];

const expectedRender = `<h5>Hello, world!</h5>`;

export default new TestCase(markdownInput, expectedTokens, expectedRender);
