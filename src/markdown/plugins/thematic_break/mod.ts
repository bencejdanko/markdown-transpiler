import { Token, Plugin, Match, Lex, Render } from "@transpiler/mod.ts";

const ID = "ThematicBreak";
const line = "===";
const starline = "***";
const underline = "___";

const match: Match = (src: string, pos: number) => {
    return src.startsWith(line, pos) || src.startsWith(starline, pos) || src.startsWith(underline, pos);
}

const lex: Lex = (src: string, pos: number) => {
    let newPos = pos;
    while (newPos < src.length && src[newPos] !== '\n') {
        newPos++;
    }
    return { tokens: [{ id: ID }], pos: newPos };
}

const render: Render = (_token: Token) => {
    return `<hr />`;
}

const plugin: Plugin = {
    id: ID,
    lex,
    match,
    render
}

export default plugin;