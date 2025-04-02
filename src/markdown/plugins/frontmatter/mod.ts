import { Lex, Match, Plugin, Render, Token } from "@transpiler/mod.ts";
import { parse } from "jsr:@std/yaml";

const id = "Frontmatter";
const frontmatter = "---\n";
const close = "\n---\n";

const match: Match = (src: string, pos: number) => {
  return src.startsWith(frontmatter, pos) && pos === 0;
};

const lex: Lex = (src: string, pos: number) => {
  let newPos = pos += frontmatter.length;
  let meta = "";
  while (true) {
    if (newPos >= src.length) {
      return { tokens: [{ id: "Text", value: meta }], pos: newPos };
    }
    if (src[newPos] === close[0]) {
      if (src.slice(newPos, newPos + close.length) === close) {
        newPos += close.length;
        break;
      }
    }
    meta += src[newPos];
    newPos += 1;
  }

  // continue until all newlines are removed
  while (src[newPos] === "\n") {
    newPos++;
  }

  const tokens = parse(meta);

  return { tokens: [{ id, value: JSON.stringify(tokens) }], pos: newPos };
};

const render: Render = (_token: Token) => {
  return "";
};

const plugin: Plugin = {
  id,
  lex,
  match,
  render,
};

export default plugin;
