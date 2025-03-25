import { lexFunction } from "@markdown/types/mod.ts";
import { Block } from "@markdown/constants.ts";
import { BlockTokens } from "@markdown/types/mod.ts";
import { lexInline } from "@markdown/lexer/inline.ts";

const header5: lexFunction = (src: string, pos: number) => {
    if (src.startsWith(Block.HEADER5, pos)) {
        const { tokens, pos: newPos } = lexInline(src, pos + Block.HEADER5.length, "\n");
        return { matched: true, tokens: [{ type: BlockTokens.Header5, children: tokens }], pos: newPos }
    }

    return { matched: false, tokens: [], pos}
}

export { header5 }