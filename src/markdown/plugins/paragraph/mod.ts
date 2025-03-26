import { LexFunction, RenderFunction, Token, Plugin, LexNode, MatchFunction } from "@transpiler/mod.ts";
import { inlineTranspiler } from "@markdown/mod.ts";

const match: MatchFunction = (_src: string, _pos: number) => {
    return true; //catchall
}

const lexer: LexFunction = (src: string, pos: number) => {
    const children: Token[] = [];

    while (pos < src.length) {
        const { tokens, pos: newPos } = inlineTranspiler.lexer.lex(src, pos, "\n");

        if (src[newPos] === "\n") {
            // Check for two spaces before the newline
            if (src[pos - 2] === " " && src[pos - 1] === " ") {
                children.push({ id: "Break" });
            } else if (src[newPos] !== "\n") {
                // Add a space if there's content after the newline
                children.push({ id: "Text", value: " " });
            }
            break;
        }

        children.push(...tokens);
        pos = newPos;
    }

    return { tokens: [{ id: "Paragraph", children }], pos };    
};

const render: RenderFunction = (token: Token) => {
    if (!token.children || token.children.length === 0) {
        return "";
    }
    return `<p>${inlineTranspiler.renderer.renderTokens(token.children)}</p>`;
} 

const lex: LexNode = {
    lexer,
    match
}

const plugin: Plugin = {
    id: "Paragraph",
    lex,
    render
}

export default plugin;