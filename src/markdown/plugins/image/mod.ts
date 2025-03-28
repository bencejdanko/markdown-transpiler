import { Token, Plugin } from "@transpiler/mod.ts";

const ID = "Image";
const OPEN = "![";
const CLOSE = ")";

const match = (src: string, pos: number) => {
    return src.startsWith(OPEN, pos);
};

const lex = (src: string, pos: number) => {
    let buffer = "";
    const altStart = pos + OPEN.length;
    const altEnd = src.indexOf("]", altStart);

    if (altEnd === -1 || src[altEnd + 1] !== "(") {
        buffer = src.slice(pos, src.indexOf(" ", pos) !== -1 ? src.indexOf(" ", pos) : src.length);
        return {
            tokens: [{ id: "Text", value: buffer }],
            pos: pos + buffer.length,
        };
    }

    const srcStart = altEnd + 2;
    const srcEnd = src.indexOf(CLOSE, srcStart);

    if (srcEnd === -1) {
        buffer = src.slice(pos, src.indexOf(" ", pos) !== -1 ? src.indexOf(" ", pos) : src.length);
        return {
            tokens: [{ id: "Text", value: buffer }],
            pos: pos + buffer.length,
        };
    }

    const alt = src.slice(altStart, altEnd);
    const imageSrc = src.slice(srcStart, srcEnd);

    return {
        tokens: [
            {
                id: ID,
                value: JSON.stringify({ alt, src: imageSrc }),
            },
        ],
        pos: srcEnd + CLOSE.length,
    };
};

const render = (token: Token) => {
    if (!token.value) return "";
    const { alt, src } = JSON.parse(token.value);
    return `<img src="${src}" alt="${alt}" />`;
};

const plugin: Plugin = {
    id: ID,
    lex,
    match,
    render,
};

export default plugin;