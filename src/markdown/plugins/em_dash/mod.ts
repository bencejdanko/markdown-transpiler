import { Token, Plugin, Match, Lex, Render } from "@transpiler/mod.ts";

const em = "--";

const match: Match = (src: string, pos: number) => {
    return src.startsWith(em, pos);
}

const lex: Lex = (_src: string, pos: number) => {
    const newPos = pos += em.length
    return { tokens: [{ id: "Text", value: "—" }], pos: newPos };
}

const render: Render = (_token: Token) => {
    return "";
}

const plugin: Plugin = {
    id: "EmDash",
    lex,
    match,
    render
}

export default plugin;