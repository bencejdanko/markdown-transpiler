import { lexBlock } from "@markdown/lexer/block.ts";
import { Token } from "@markdown/types/mod.ts";

export function lex(src: string): Token[] {
  const tokens = lexBlock(src, 0, "\n");
  return tokens;
}
