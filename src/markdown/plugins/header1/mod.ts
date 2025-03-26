import { LexFunction, RenderFunction, Token, Plugin, LexNode, MatchFunction } from "@transpiler/mod.ts";
import { inlineTranspiler } from "@markdown/mod.ts";

const OPEN = "# ";

const match: MatchFunction = (src: string, pos: number) => {
    return src.startsWith(OPEN, pos);
}

const lexer: LexFunction = (src: string, pos: number) => {
    if (src.startsWith(OPEN, pos)) {
        let currentPos = pos + OPEN.length;
        const children: Token[] = [];

        while (currentPos < src.length) {
            const { tokens, pos: newPos } = inlineTranspiler.lexer.lex(src, currentPos, "\n");

            if (tokens.length === 0 || src[newPos] === "\n") {
                break;
            }

            children.push(...tokens);

            if (src[newPos] === "\n") {
                children.push({ id: "Text", value: " " });
            }

            currentPos = newPos;
        }

        return { matched: true, tokens: [{ id: "Header1", children }], pos: currentPos };
    }

    return { matched: false, tokens: [], pos };
};

const render: RenderFunction = (token: Token) => {
    if (!token.children || token.children.length === 0) {
        return "<h1></h1>";
    }
    return `<h1>${inlineTranspiler.renderer.renderTokens(token.children)}</h1>`;
} 

const lex: LexNode = {
    lexer,
    match
}

const plugin: Plugin = {
    id: "Header1",
    lex,
    render
}

export default plugin;