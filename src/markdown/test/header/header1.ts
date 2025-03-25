import { BlockTokens, InlineTokens } from "@markdown/types/mod.ts";
import { TestCase } from "@markdown/types/mod.ts";

const testCases: TestCase[] = [
  // Test case 1: Header with plain text
  new TestCase(
    "# Hello, world!",
    [
      {
        type: BlockTokens.Header1,
        children: [{ type: InlineTokens.Text, value: "Hello, world!" }],
      },
    ],
    `<h1>Hello, world!</h1>`
  ),

  // Test case 2: Header with italics
  new TestCase(
    "# *Hello, world!*",
    [
      {
        type: BlockTokens.Header1,
        children: [
          {
            type: InlineTokens.Italic,
            children: [{ type: InlineTokens.Text, value: "Hello, world!" }],
          },
        ],
      },
    ],
    `<h1><em>Hello, world!</em></h1>`
  ),
];

export default testCases;
