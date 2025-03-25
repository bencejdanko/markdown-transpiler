import { Token } from "@markdown/types/mod.ts";
import { InlineTokens } from "@markdown/types/mod.ts";
import { Inline } from "@markdown/constants.ts";

function lexInline(
  src: string,
  pos: number,
  terminator: string,
  skipOnTerminate: boolean = true,
): { tokens: Token[]; pos: number } {
  const tokens: Token[] = [];
  let buffer = "";

  function flushBuffer() {
    if (buffer) {
      tokens.push({ type: InlineTokens.Text, value: buffer });
      buffer = "";
    }
  }

  function skipPos() {
    if (skipOnTerminate) {
      pos += terminator.length;
    }
  }

  while (true) {
    if (src.startsWith(terminator, pos)) {
      flushBuffer();
      skipPos();
      return { tokens, pos };
    } else if (src.startsWith(Inline.ITALIC, pos)) {
      flushBuffer();
      const { pos: newPos, tokens: newTokens } = lexInline(
        src,
        pos + Inline.ITALIC.length,
        Inline.ITALIC,
      );
      tokens.push({ type: InlineTokens.Italic, children: newTokens });
      pos = newPos;
      continue;
    }

    if (pos >= src.length) break;
    buffer += src[pos];
    pos++;
  }

  flushBuffer();
  return { tokens, pos };
}

export { lexInline };
