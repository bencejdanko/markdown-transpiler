import { LexFunction, RenderFunction, Token, Plugin, LexNode, MatchFunction } from "@transpiler/mod.ts";
import { inlineTranspiler } from "@markdown/mod.ts";

const ID = "Emphasis";
const OPEN = "*";
const CLOSE = "*";

const match: MatchFunction = (src: string, pos: number) => {
    return src.startsWith(OPEN, pos);
}

const lexer: LexFunction = (src: string, pos: number) => {
    if (src.startsWith(OPEN, pos)) {
        const { tokens, pos: newPos } = inlineTranspiler.lexer.lex(src, pos + OPEN.length, CLOSE);
        return { matched: true, tokens: [{ id: ID, children: tokens }], pos: newPos }
    }
    return { matched: false, tokens: [], pos}
}

const render: RenderFunction = (token: Token) => {
    if (!token.children || token.children.length === 0) {
        return "<em></em>";
    }
    return `<em>${inlineTranspiler.renderer.renderTokens(token.children)}</em>`;
}

const lex: LexNode = {
    lexer,
    match
}

const plugin: Plugin = {
    id: ID,
    lex,
    render
}

export default plugin;