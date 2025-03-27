import { Token, Plugin, Match, Lex, Render } from "@transpiler/mod.ts";
import { inlineTranspiler } from "@markdown/mod.ts";

const ID = "ThematicBreak";
const line = "===";
const starline = "***";
const underline = "___";

const match: Match = (src: string, pos: number) => {
    return src.startsWith(line, pos) || src.startsWith(starline, pos) || src.startsWith(underline, pos);
}

const lex: Lex = (src: string, pos: number) => {
    let newPos = pos;
    let hasContent = false;

    // Check for any non-whitespace characters within the break
    while (newPos < src.length && src[newPos] !== '\n') {
        if (!['=', '*', '_', ' '].includes(src[newPos])) {
            hasContent = true;
        }
        newPos++;
    }

    if (hasContent) {
        // Recover from the start and use the provided logic
        const { tokens, pos: recoveredPos } = inlineTranspiler.lex(src, pos, "\n\n");
        return { tokens: [{ id: "Paragraph", children: tokens}], pos: recoveredPos };
    }

    // Skip newlines until content is reached
    while (src[newPos] === '\n') {
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