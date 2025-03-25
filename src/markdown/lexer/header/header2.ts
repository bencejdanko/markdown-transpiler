import { lexFunction } from "@markdown/types/mod.ts";
import { Block } from "@markdown/constants.ts";
import { BlockTokens } from "@markdown/types/mod.ts";
import { lexInline } from "@markdown/lexer/inline.ts";

const header2: lexFunction = (src: string, pos: number) => {
    if (src.startsWith(Block.HEADER2, pos)) {
        const { tokens, pos: newPos } = lexInline(src, pos + Block.HEADER2.length, "\n");
        return { matched: true, tokens: [{ type: BlockTokens.Header2, children: tokens }], pos: newPos }
    }

    return { matched: false, tokens: [], pos}
}

export { header2 }