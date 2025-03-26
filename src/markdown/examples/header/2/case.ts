import { Token } from "@transpiler/mod.ts";

const tokens: Token[] = [
  {
    id: "Header1",
    children: [{
      id: "Emphasis",
      children: [{ id: "Text", value: "Hello, world!" }],
    }],
  },
];

export default tokens;
