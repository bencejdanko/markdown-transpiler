import { lex } from "@markdown/lexer/mod.ts";
import { render } from "@markdown/render/mod.ts";

function renderHTML(src: string): string {
  return render(lex(src));
}

export { lex, render, renderHTML };