import { Token, Plugin, Match, Lex, Render } from "@transpiler/mod.ts";

const match: Match = (src: string, pos: number) => {
    return src.startsWith("\n", pos);
}

const lex: Lex = (_src: string, pos: number) => {
    const newPos = pos += 1
    return { tokens: [{ id: "Text", value: " " }], pos: newPos };
}

const render: Render = (_token: Token) => {
    return "";
}

const plugin: Plugin = {
    id: "NewlineSpace",
    lex,
    match,
    render
}

export default plugin;