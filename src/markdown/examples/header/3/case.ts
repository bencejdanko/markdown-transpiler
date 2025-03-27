import { Token } from "@transpiler/mod.ts";

const tokens: Token[] = [
  {
    id: "Header1",
    children: [
      {
        id: "Text",
        value: "A header",
      },
    ],
  },
  {
    id: "Paragraph",
    children: [
      {
        id: "Text",
        value: "Followed by a paragraph",
      },
    ],
  },
  {
    id: "Header1",
    children: [
      {
        id: "Text",
        value: "This will",
      },
    ],
  },
  {
    id: "Paragraph",
    children: [
      {
        id: "Text",
        value: "also work.",
      },
    ],
  },
];

export default tokens;
