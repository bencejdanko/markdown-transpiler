import { Token } from "@markdown/types/mod.ts";
import { InlineTokens } from "@markdown/types/mod.ts";
import { lexFunction } from "@markdown/types/mod.ts";

import {
  header1,
  header2,
  header3,
  header4,
  header5,
  header6,
} from "@markdown/lexer/header/mod.ts";

function lex(
  src: string,
  pos: number,
  lexers: lexFunction[],
  terminator: string,
): { tokens: Token[]; pos: number } {
  const tokens: Token[] = [];
  let buffer = "";

  function flushBuffer() {
    if (buffer) {
      tokens.push({ type: InlineTokens.Text, value: buffer });
      buffer = "";
    }
  }

  while (true) {
    if (src.startsWith(terminator, pos)) {
      flushBuffer();
      pos += terminator.length;
      return { tokens, pos };
    }

    let match = false;
    for (const lexer of lexers) {
      const { matched, tokens: newTokens, pos: newPos } = lexer(src, pos);
      if (matched) {
        tokens.push(newTokens[0]);
        pos = newPos;
        match = true;
        break;
      }
    }
    if (match) continue;

    if (pos >= src.length) break;
    buffer += src[pos];
    pos++;
  }

  flushBuffer();
  return { tokens, pos };
}

function lexCadenceMarkdown(src: string): Token[] {
  const lexers = [header1, header2, header3, header4, header5, header6];
  const { tokens } = lex(src, 0, lexers, "\n");
  return tokens;
}

export { lex, lexCadenceMarkdown };
