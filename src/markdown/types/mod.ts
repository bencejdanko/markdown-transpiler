export interface Token {
  type: string;
  children?: Token[];
  value?: string;
}

export enum BlockTokens {
  Header1 = "Header1",
  Header2 = "Header2",
  Header3 = "Header3",
  Header4 = "Header4",
  Header5 = "Header5",
  Header6 = "Header6",
  Paragraph = "Paragraph",
  Blockquote = "Blockquote",
  UnorderedList = "UnorderedList",
  OrderedList = "OrderedList",
  ListItem = "ListItem",
  CodeBlock = "CodeBlock",
  HorizontalRule = "HorizontalRule",
  Table = "Table",
  TableRow = "TableRow",
  TableCell = "TableCell",
}

export enum InlineTokens {
  Text = "Text",
  Italic = "Italic",
  Strong = "Strong",
  Strikethrough = "Strikethrough",
  Link = "Link",
  Image = "Image",
  HTML = "HTML",
}

export class TestCase {
  description?: string;
  markdownInput: string;
  expectedTokens: Token[];
  expectedHTML: string;

  constructor(
    markdownInput: string,
    expectedTokens: Token[],
    expectedHTML: string,
    description?: string,
  ) {
    this.description = description;
    this.markdownInput = markdownInput;
    this.expectedTokens = expectedTokens;
    this.expectedHTML = expectedHTML;
  }
}

export interface lexFunction {
  (
    src: string,
    pos: number,
  ): { matched: boolean; pos: number; tokens: Token[] };
}
