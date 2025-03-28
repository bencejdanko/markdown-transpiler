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
            value: "Basic blockquote,",
          },
          {
            id: "Text",
            value: " ",
          },
          {
            id: "Text",
            value: "with multiple lines.",
          },
        ],
      },
    ],
    value: "NOTE",
  },
];

export default tokens;
