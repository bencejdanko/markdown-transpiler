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
    ThematicBreak = "ThematicBreak"
}

export enum InlineTokens {
    Text = "Text",
    Emphasis = "Emphasis",
    Strong = "Strong",
    Strikethrough = "Strikethrough",
    Link = "Link",
    Image = "Image",
    HTML = "HTML",
}