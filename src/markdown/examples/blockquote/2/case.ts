import { Token } from "@transpiler/mod.ts";

const tokens: Token[] = [
  {
    id: "Blockquote",
    children: [
      {
        id: "Paragraph",
        children: [
          {
            id: "Text",
            value: "Basic blockquote.",
          },
        ],
      },
    ],
    value: undefined,
  },
  {
    id: "Blockquote",
    children: [
      {
        id: "Paragraph",
        children: [
          {
            id: "Text",
            value: "Basic blockquote.",
          },
        ],
      },
    ],
    value: undefined,
  },
  {
    id: "Paragraph",
    children: [
      {
        id: "Text",
        value: "Followed by a paragraph.",
      },
    ],
  },
];

export default tokens;
