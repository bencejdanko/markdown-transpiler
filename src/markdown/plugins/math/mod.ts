import { Plugin, Token } from "@transpiler/mod.ts";

import temml from "npm:temml";

const ID = "Math";
const OPEN = "$";
const CLOSE = "$";

const match = (src: string, pos: number) => {
  return src.startsWith(OPEN, pos);
};

const lex = (src: string, pos: number) => {
  let value = "";
  pos += OPEN.length;
  while (src[pos] !== CLOSE && src[pos] !== undefined) {
    value += src[pos];
    pos++;
  }
  pos += CLOSE.length;
  return { tokens: [{ id: ID, value: value }], pos };
};

const render = (token: Token) => {
  return `${temml.renderToString(token.value || "")}`;
};

const plugin: Plugin = {
  id: ID,
  lex,
  match,
  render,
};

export default plugin;
