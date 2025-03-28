import { Token, Plugin, Match, Lex, Render } from "@transpiler/mod.ts";

const ID = "Escape";
const DOUBLE_SPACE_ESCAPE = "\\";

const match: Match = (src: string, pos: number) => {
    return src.startsWith(DOUBLE_SPACE_ESCAPE, pos);
}

const lex: Lex = (src: string, pos: number) => {
    let newPos = pos;
    // Move past the double space escape sequence
    newPos += DOUBLE_SPACE_ESCAPE.length;
    const value = src[newPos];
    newPos++;
    return { tokens: [{ id: "Text", value }], pos: newPos };
}

const render: Render = (_token: Token) => {
    return ``;
}

const plugin: Plugin = {
    id: ID,
    lex,
    match,
    render
}

export default plugin;