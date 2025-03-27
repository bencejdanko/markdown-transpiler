import { Token, Plugin } from "@transpiler/mod.ts";
import { inlineTranspiler } from "@markdown/mod.ts";

const ID = "Emphasis";
const OPEN = "*";
const CLOSE = "*";

const match = (src: string, pos: number) => {
    return src.startsWith(OPEN, pos);
}

const lex = (src: string, pos: number) => {
    const { tokens, pos: newPos } = inlineTranspiler.lex(src, pos + OPEN.length, CLOSE);
    return { tokens: [{ id: ID, children: tokens }], pos: newPos }
}

const render = (token: Token) => {
    if (!token.children || token.children.length === 0) {
        return "<em></em>";
    }
    return `<em>${inlineTranspiler.renderTokens(token.children)}</em>`;
}

const plugin: Plugin = {
    id: ID,
    lex,
    match,
    render
}

export default plugin;