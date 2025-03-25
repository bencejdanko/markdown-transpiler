import { lexFunction } from "@markdown/types/mod.ts";
import { Block } from "@markdown/constants.ts";
import { BlockTokens } from "@markdown/types/mod.ts";
import { lexInline } from "@markdown/lexer/inline.ts";

const header6: lexFunction = (src: string, pos: number) => {
    if (src.startsWith(Block.HEADER6, pos)) {
        const { tokens, pos: newPos } = lexInline(src, pos + Block.HEADER6.length, "\n");
        return { matched: true, tokens: [{ type: BlockTokens.Header6, children: tokens }], pos: newPos }
    }

    return { matched: false, tokens: [], pos}
}

export { header6 }