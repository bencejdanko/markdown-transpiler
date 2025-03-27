export interface Token {
  id: string;
  children?: Token[];
  value?: string;
}

export class Transpiler {
  private renderers = new Map<string, (token: Token, renderTokens: (tokens: Token[]) => string) => string>();
  plugins: Plugin[] = [];

  constructor() {
    this.addRenderer("Text", (token) => token.value || "");
  }

  addPlugin(plugin: Plugin): void {
    if (this.plugins.find((p) => p.id === plugin.id)) {
      throw new Error(`Plugin type ${plugin.id} already exists`);
    }

    this.plugins.push(plugin);
    this.addRenderer(plugin.id, plugin.render);
  }

  lex(src: string, pos: number, terminator?: string): { tokens: Token[]; pos: number } {
    const tokens: Token[] = [];
    let buffer = "";

    const flushBuffer = () => {
      if (buffer) {
        if (buffer.trim().length > 0) {
          tokens.push({ id: "Text", value: buffer.trim() });
        }
        buffer = "";
      }
    };

    while (true) {
      if (terminator && src.startsWith(terminator, pos)) {
        flushBuffer();
        return { tokens, pos: pos + terminator.length };
      }

      let matched = false; // Track if a plugin matched
      for (const plugin of this.plugins) {
        if (!plugin.match(src, pos)) continue;
        flushBuffer(); // Ensure buffer is flushed before processing the plugin
        const { tokens: newTokens, pos: newPos } = plugin.lex(src, pos);
        tokens.push(...newTokens);
        pos = newPos;
        if (pos >= src.length) break;
        matched = true; // Mark that a plugin matched
        break;
      }

      if (matched) continue; // Restart the loop after processing a plugin match

      if (pos >= src.length) {
        flushBuffer();
        break;
      };
      buffer += src[pos];
      pos++;
    }

    flushBuffer();
    return { tokens, pos };
  }

  private addRenderer(tokenType: string, renderer: (token: Token, renderTokens: (tokens: Token[]) => string) => string): void {
    this.renderers.set(tokenType, renderer);
  }

  renderTokens(tokens: Token[]): string {
    return tokens.map(this.renderToken.bind(this)).join("");
  }

  private renderToken(token: Token): string {
    const renderer = this.renderers.get(token.id);
    return renderer ? renderer(token, this.renderTokens.bind(this)) : "";
  }

  renderHTML(src: string): string {
    const { tokens } = this.lex(src, 0);
    return this.renderTokens(tokens);
  }
}

export interface Plugin {
  match: Match;
  lex: Lex;
  render: Render;
  id: string;
}

export interface Match {
  (src: string, pos: number): boolean;
}

export interface Lex {
  (src: string, pos: number): { pos: number; tokens: Token[] };
}

export interface Render {
  (token: Token): string;
}

export interface TestCaseConfig {
  description: string;
}

export interface TestCase {
  config?: TestCaseConfig;
  markdownInput: string;
  expectedTokens: Token[];
  expectedHTML: string;
}