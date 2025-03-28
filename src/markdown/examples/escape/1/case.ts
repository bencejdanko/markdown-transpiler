import { Token } from "@transpiler/mod.ts";

const tokens: Token[] = [
  {
    children: [
      {
        id: "Text",
        value: "We can escape ",
      },
      {
        id: "Text",
        value: "*",
      },
      {
        id: "Text",
        value: " an astericks ",
      },
      {
        id: "Text",
        value: "*",
      },
    ],
    id: "Paragraph",
  },
];

export default tokens;
