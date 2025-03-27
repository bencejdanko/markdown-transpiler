import { Token, Plugin } from "@transpiler/mod.ts";
import { inlineTranspiler } from "@markdown/mod.ts";

const match = (_src: string, _pos: number) => {
    return true; //catchall
}

const lex = (src: string, pos: number) => {
    const children: Token[] = [];
    const { tokens, pos: newPos } = inlineTranspiler.lex(src, pos, "\n\n");
    children.push(...tokens);
    pos = newPos;

    if (children.length === 0) {
        return { tokens: [], pos };
    }
    
    return { tokens: [{ id: "Paragraph", children }], pos };    
};

const render = (token: Token) => {
    if (!token.children || token.children.length === 0) {
        return "";
    }
    return `<p>${inlineTranspiler.renderTokens(token.children)}</p>`;
} 

const plugin: Plugin = {
    id: "Paragraph",
    lex,
    match,
    render
}

export default plugin;