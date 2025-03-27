import { Token, Plugin, Match, Lex, Render } from "@transpiler/mod.ts";

const ID = "Break";
const DOUBLE_SPACE_BREAK = "  \n";
const BACKSLASH_BREAK = "\\\n";

const match: Match = (src: string, pos: number) => {
    return src.startsWith(DOUBLE_SPACE_BREAK, pos) || src.startsWith(BACKSLASH_BREAK, pos);
}

const lex: Lex = (src: string, pos: number) => {
    let newPos = pos;
    if (src.slice(pos).startsWith(DOUBLE_SPACE_BREAK)) {
        newPos += DOUBLE_SPACE_BREAK.length;
    } else if (src.slice(pos).startsWith(BACKSLASH_BREAK)) {
        newPos += BACKSLASH_BREAK.length;
    }
    return { tokens: [{ id: ID }], pos: newPos };
}

const render: Render = (_token: Token) => {
    return `<br />`;
}

const plugin: Plugin = {
    id: ID,
    lex,
    match,
    render
}

export default plugin;