import { Token, Plugin } from "@transpiler/mod.ts";
import { inlineTranspiler } from "@markdown/mod.ts";

const OPEN = "# ";

const match = (src: string, pos: number) => {
    return src.startsWith(OPEN, pos);
}

const lex = (src: string, pos: number) => {
    let currentPos = pos + OPEN.length;
    const children: Token[] = [];
    const { tokens, pos: newPos } = inlineTranspiler.lex(src, currentPos, "\n");
    children.push(...tokens);
    currentPos = newPos;

    while (src[currentPos] === "\n") {
        currentPos += 1;
    }

    return { tokens: [{ id: "Header1", children }], pos: currentPos };
};

const render = (token: Token) => {
    if (!token.children || token.children.length === 0) {
        return "<h1></h1>";
    }
    return `<h1>${inlineTranspiler.renderTokens(token.children)}</h1>`;
} 

const plugin: Plugin = {
    id: "Header1",
    match,
    lex,
    render
}

export default plugin;