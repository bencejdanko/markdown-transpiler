import { lexCadenceMarkdown } from "@markdown/lexer/mod.ts";
import { render } from "@markdown/render/mod.ts";

function renderHTML(src: string): string {
  return render(lexCadenceMarkdown(src));
}

export { lexCadenceMarkdown, render, renderHTML };