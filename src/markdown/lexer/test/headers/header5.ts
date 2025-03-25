import { Token, BlockTokens, InlineTokens } from "@/markdown/types/index.ts";

export const input = "##### Hello, world!";

export const expected: Token[] = [
  {
    type: BlockTokens.Header5,
    children: [{ type: InlineTokens.Text, value: "Hello, world!" }],
  },
];
