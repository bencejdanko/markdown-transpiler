export interface Token {
  id: string;
  children?: Token[];
  value?: string;
}

export class Lexer {
  lexers: LexNode[] = [];

  constructor() {
    this.lex = this.lex.bind(this);
  }

  addLexer(lexer: LexNode): void {
    this.lexers.push(lexer);
  }

  lex(
    src: string,
    pos: number,
    terminator?: string,
  ): { tokens: Token[]; pos: number } {
    const tokens: Token[] = [];
    let buffer = "";

    function flushBuffer() {
      if (buffer) {
        tokens.push({ id: "Text", value: buffer });
        buffer = "";
      }
    }

    while (true) {
      if (terminator && src.startsWith(terminator, pos)) {
        flushBuffer();
        return { tokens, pos: pos + terminator.length };
      }

      for (const lexer of this.lexers) {
        if (!lexer.match(src, pos)) continue;
        flushBuffer();
        const { tokens: newTokens, pos: newPos } = lexer.lexer(src, pos);
        tokens.push(newTokens[0]);
        pos = newPos;
        break;
      }

      if (pos >= src.length) break;
      buffer += src[pos];
      pos++;
    }

    flushBuffer();
    return { tokens, pos };
  }
}

export class Renderer {
  private renderers = new Map<
    string,
    (token: Token, renderTokens: (tokens: Token[]) => string) => string
  >();

  constructor() {
    this.addRenderer("Text", (token) => token.value || "");
  }

  addRenderer(
    tokenType: string,
    renderer: (
      token: Token,
      renderTokens: (tokens: Token[]) => string,
    ) => string,
  ): void {
    this.renderers.set(tokenType, renderer);
  }

  renderTokens(tokens: Token[]): string {
    return tokens.map(this.renderToken.bind(this)).join("");
  }

  private renderToken(token: Token): string {
    const renderer = this.renderers.get(token.id);
    if (renderer) {
      return renderer(token, this.renderTokens.bind(this));
    }
    return "";
  }
}

export class Transpiler {
  lexer: Lexer;
  renderer: Renderer;
  plugins: Plugin[] = [];

  constructor() {
    this.lexer = new Lexer();
    this.renderer = new Renderer();
  }

  addPlugin(plugin: Plugin): void {
    if (this.plugins.find((p) => p.id === plugin.id)) {
      throw new Error(`Plugin type ${plugin.id} already exists`);
    }

    this.plugins.push(plugin);
    this.lexer.addLexer(plugin.lex);
    this.renderer.addRenderer(plugin.id, plugin.render);
  }

  renderHTML(src: string): string {
    const { tokens } = this.lexer.lex(src, 0);
    return this.renderer.renderTokens(tokens);
  }

  lex(src: string): Token[] {
    const { tokens } = this.lexer.lex(src, 0);
    return tokens;
  }
}

export interface TestCase {
  description?: string;
  markdownInput: string;
  expectedTokens: Token[];
  expectedHTML: string;
}

export interface Plugin {
  lex: LexNode;
  render: RenderFunction;
  id: string;
}

export interface MatchFunction {
  (src: string, pos: number): boolean;
}

export interface LexFunction {
  (
    src: string,
    pos: number,
  ): { pos: number; tokens: Token[] };
}

export interface LexNode {
  match: MatchFunction;
  lexer: LexFunction;
}

export interface RenderFunction {
  (token: Token): string;
}
