const HEADER = "\n# ";
const HEADER2 = "\n## ";
const HEADER3 = "\n### ";
const HEADER4 = "\n#### ";
const HEADER5 = "\n##### ";
const HEADER6 = "\n###### ";

const IMAGE = "![";
const IMAGE_CLOSE = "]";
const IMAGE_URL = "(";
const IMAGE_URL_CLOSE = ")";

const BLOCKQUOTE = "\n> ";
const ALERT = "\n! ";
const TIP = "\n? ";

const LIST = "\n- ";
const INNER_LIST = "\n  - ";
const INNER_INNER_LIST = "\n    - ";
const INNER_INNER_INNER_LIST = "\n      - ";
const QUOTATION = '\n\t'; // todo
const YAML = "\n---";
const IEEE_BLOCK_REGEX = /^\n\[\d+\] /;

const ORDERED_LIST = "\n#. ";
const INNER_ORDERED_LIST = "\n  #. ";
const BLOCK_ID = "\n@";
const CODE_BLOCK = "\n\`\`\`";

const TABLE = "\n| ";
const HORIZONTAL = "\n===";
const CENTER = "\n!!";

//Inline tokens
const BOLD = "**";
const ITALIC = "*";
const CODE = "`";
const TOOLTIP = "??";
const ANCHOR = "[";
const ANCHOR_CLOSE = "]";
const ANCHOR_URI = "(";
const ANCHOR_URI_CLOSE = ")";
const QUIP = "__"

const EMPTY_CHECKBOX_REGEX = /^\[ \]/;

const CHECKBOX = "[";
const CHECKBOX_TICK = "x";
const CHECKBOX_CLOSE = "]";
const SUPERSCRIPT = "^";
const SUBSCRIPT = "~";
const TABLE_CELL = "|";
const SMALL = "^^";
const BIG = "++";
const MATH = "\\[";
const MATH_CLOSE = "\\]";
const EMOJI = "::";

const TAB = ">>";
const BREAK = "\\";
const EM_DASH = "--"
const ATTRIBUTES = "{";
const ATTRIBUTES_CLOSE = "}";

import { BlockType, InlineType } from "./types.js";

// export interface Token {
//     type: BlockType | InlineType;
//     value?: string;
//     tokens?: Token[];
// }

function lexTemplate(src, pos, terminator) {
    const tokens = [];
    let buffer = "";

    while (true) {
        if (terminator && src.startsWith(terminator, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            pos += terminator.length;
            return { tokens, pos };
        }

        if (src.startsWith(CODE_BLOCK, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: code_block_tokens } = lexCodeBlock(
                src,
                pos + CODE_BLOCK.length,
            );
            tokens.push({
                type: BlockType.CodeBlock,
                tokens: code_block_tokens,
            });
            pos = newPos;
            continue;
        } else if (src.startsWith(QUOTATION, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            pos += QUOTATION.length;

            let author = "";
            while (true) {
                if (src.startsWith("\n", pos)) {
                    if (buffer) {
                        author = buffer;
                        buffer = "";
                    }
                    pos++;
                    break;
                }

                if (pos >= src.length) break;
                buffer += src[pos];
                pos++;
            }

            let { pos: newPos, tokens: quote_tokens } = lexTemplate(
                src,
                pos,
                QUOTATION,
            );
            tokens.push({
                type: BlockType.Quotation,
                tokens: [...quote_tokens, {
                    type: InlineType.QuoteAuthor,
                    value: author,
                }],
            });
            pos = newPos;
        } else if (src.startsWith(YAML, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            pos += YAML.length;

            let { pos: newPos, tokens: yaml_tokens } = lexRawText(
                src,
                pos,
                YAML,
            );
            tokens.push({ type: BlockType.YAMLBlock, tokens: yaml_tokens });
            pos = newPos;
            continue;
        } else if (IEEE_BLOCK_REGEX.test(src.slice(pos))) {
            const match = src.slice(pos).match(IEEE_BLOCK_REGEX);
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: ieee_tokens } = lexRawText(
                src,
                pos + match[0].length,
                "\n",
                false
            );

            tokens.push({ type: BlockType.IEEEBlock, tokens: ieee_tokens });
            pos = newPos;
            continue;
        } else if (src.startsWith(BLOCK_ID, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: block_id_tokens } = lexRawText(
                src,
                pos + BLOCK_ID.length,
                "\n",
            );
            tokens.push({ type: BlockType.BlockId, tokens: block_id_tokens });
            pos = newPos;
            continue;
        } else if (src.startsWith(ALERT, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: alert_tokens } = lexInline(
                src,
                pos + ALERT.length,
            );

            tokens.push({ type: BlockType.AlertBlock, tokens: alert_tokens });
            pos = newPos;
            continue;
        } else if (src.startsWith(TIP, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: tip_tokens } = lexInline(
                src,
                pos + ALERT.length,
            );

            tokens.push({ type: BlockType.TipBlock, tokens: tip_tokens });
            pos = newPos;
            continue;
        } else if (src.startsWith(HEADER, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: header_tokens } = lexInline(
                src,
                pos + HEADER.length,
                '\n',
                false,
            );
            tokens.push({ type: BlockType.HeaderBlock, tokens: header_tokens });
            pos = newPos;
            continue;
        } else if (src.startsWith(HEADER2, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: header_tokens } = lexInline(
                src,
                pos + HEADER2.length,
                '\n',
                false,
            );
            tokens.push({
                type: BlockType.Header2Block,
                tokens: header_tokens,
            });
            pos = newPos;
            continue;
        } else if (src.startsWith(HEADER3, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: header_tokens } = lexInline(
                src,
                pos + HEADER3.length,
                '\n',
                false,
            );
            tokens.push({
                type: BlockType.Header3Block,
                tokens: header_tokens,
            });
            pos = newPos;
            continue;
        } else if (src.startsWith(HEADER4, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: header_tokens } = lexInline(
                src,
                pos + HEADER4.length,
                '\n',
                false,
            );
            tokens.push({
                type: BlockType.Header4Block,
                tokens: header_tokens,
            });
            pos = newPos;
            continue;
        } else if (src.startsWith(HEADER5, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: header_tokens } = lexInline(
                src,
                pos + HEADER5.length,
                '\n',
                false,
            );
            tokens.push({
                type: BlockType.Header5Block,
                tokens: header_tokens,
            });
            pos = newPos;
            continue;
        } else if (src.startsWith(HEADER6, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: header_tokens } = lexInline(
                src,
                pos + HEADER6.length,
                '\n',
                false,
            );
            tokens.push({
                type: BlockType.Header6Block,
                tokens: header_tokens,
            });
            pos = newPos;
            continue;
        } else if (src.startsWith(CENTER, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: center_tokens } = lexInline(
                src,
                pos + CENTER.length,
            );
            tokens.push({ type: BlockType.Center, tokens: center_tokens });
            pos = newPos;
            continue
        } else if (src.startsWith(BLOCKQUOTE, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: blockquote_tokens } = lexInline(
                src,
                pos + BLOCKQUOTE.length,
            );
            tokens.push({
                type: BlockType.BlockquoteBlock,
                tokens: blockquote_tokens,
            });
            pos = newPos;
            continue;
        } else if (src.startsWith(LIST, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: list_tokens } = lexList(src, pos);
            tokens.push({ type: BlockType.ListBlock, tokens: list_tokens });
            pos = newPos;
            continue;
        } else if (src.startsWith(ORDERED_LIST, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: list_tokens } = lexOrderedList(src, pos);
            tokens.push({
                type: BlockType.OrderedListBlock,
                tokens: list_tokens,
            });
            pos = newPos;
            continue;
        } else if (src.startsWith(TABLE, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: table_tokens } = lexTable(
                src,
                pos + TABLE.length,
            );
            tokens.push({ type: BlockType.TableBlock, tokens: table_tokens });
            pos = newPos;
            continue;
        } else if (src.startsWith(HORIZONTAL, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            tokens.push({ type: BlockType.HorizontalRule, tokens: [] });
            pos += HORIZONTAL.length;
            continue;
        } else if (src.startsWith('\n', pos)) {
            // Flush any buffered text before processing the newline.
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let paragraphTokens = [];

            // Process one or more newline-separated lines into the same paragraph.
            while (pos < src.length && src[pos] === '\n') {
                pos++; // Skip the newline

                // If the next character is a newline, this indicates an empty line (paragraph break).
                if (pos < src.length && src[pos] === '\n') {
                    // Consume the extra newline (if desired) and break out.
                    break;
                }

                // Process the inline content for the current line.
                let { pos: newPos, tokens: lineTokens } = lexInline(src, pos, '\n', false);

                // If inline tokens were returned, add them to the paragraph tokens.
                if (lineTokens.length > 0) {
                    // Optionally add a space between lines if this is not the first line.
                    if (paragraphTokens.length > 0) {
                        paragraphTokens.push({ type: InlineType.Text, value: " " });
                    }
                    paragraphTokens.push(...lineTokens);
                }
                pos = newPos;
            }

            // If any inline content was accumulated, wrap it as a paragraph block.
            if (paragraphTokens.length > 0) {
                tokens.push({
                    type: BlockType.ParagraphBlock,
                    tokens: paragraphTokens,
                });
            }
            continue;
        }

        if (pos >= src.length) break;
        buffer += src[pos];
        pos++;
    }

    if (buffer) {
        tokens.push({ type: InlineType.Text, value: buffer });
    }

    return { tokens, pos };
}

/**
 * Helper: Reads a line (until "\n") from src starting at pos.
 * Returns an object with the line content and the updated position.
 */
function readLine(src, pos) {
    let line = "";
    if (src[pos] === "\n") pos++;
    while (pos < src.length && src[pos] !== "\n") {
        line += src[pos];
        pos++;
    }
    // Skip the newline if present.
    return { line, pos };
}

/**
 * Helper: Splits a table row by the pipe (|) character,
 * trimming spaces and removing a leading/trailing empty cell if present.
 */
function splitRow(row) {
    row = row.trim();
    // Remove a leading/trailing pipe if it exists.
    if (row.startsWith("|")) row = row.slice(1);
    if (row.endsWith("|")) row = row.slice(0, -1);
    return row.split("|").map((cell) => cell.trim());
}

/**
 * Parses a markdown table from src starting at pos.
 * Expects:
 *   - A header row,
 *   - A delimiter row (for column alignment),
 *   - And then one or more table rows.
 */
function lexTable(src, pos) {
    const tokens = [];

    // ----- 1. Process header row -----
    let result = readLine(src, pos);
    let headerLine = result.line;
    pos = result.pos;

    // If no header line exists, this is not a table.
    if (!headerLine) {
        return { tokens, pos };
    }

    const headerCells = splitRow(headerLine);
    const headerTokens = headerCells.map((cell) => ({
        type: InlineType.TableCell,
        tokens: lexInline(cell, 0).tokens,
    }));
    tokens.push({
        type: InlineType.TableHeader,
        tokens: headerTokens,
    });

    // ----- 2. Process delimiter row (for alignment) -----
    result = readLine(src, pos);
    let delimiterLine = result.line;
    pos = result.pos;
    const delimiterCells = splitRow(delimiterLine);

    // Determine alignment per cell using a regex.
    const alignments = delimiterCells.map((cell) => {
        // Valid delimiter cells match something like: ":---", "---:", or ":---:".
        if (/^:?-{3,}:?$/.test(cell)) {
            if (cell.startsWith(":") && cell.endsWith(":")) {
                return "center";
            } else if (cell.startsWith(":")) {
                return "left";
            } else if (cell.endsWith(":")) {
                return "right";
            }
        }
        // Fallback (or invalid delimiter): no explicit alignment.
        return null;
    });
    tokens.push({
        type: InlineType.TableDelimiter,
        alignments,
    });

    // ----- 3. Process remaining rows -----
    // We continue until we hit a blank line or the end of src.
    while (pos < src.length) {
        result = readLine(src, pos);
        let rowLine = result.line;
        pos = result.pos;

        // Stop if we hit an empty line.
        if (!rowLine.trim()) break;

        const cells = splitRow(rowLine);
        const rowTokens = cells.map((cell) => ({
            type: InlineType.TableCell,
            tokens: lexInline(cell, 0).tokens,
        }));
        tokens.push({
            type: InlineType.TableRow,
            tokens: rowTokens,
        });
    }

    return { tokens, pos };
}

export function lexInline(
    src,
    pos,
    customTerminator = '\n',
    skipOnTerminate = true,
) {
    const tokens = [];
    let buffer = "";

    while (true) {
        if (src.startsWith(customTerminator, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            if (skipOnTerminate) {
                pos += customTerminator.length;
            }

            return { tokens, pos };
        } else if (src.startsWith(TAB, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            tokens.push({ type: InlineType.Tab });
            pos += TAB.length;
            continue;
        } else if (src.startsWith(EM_DASH, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            tokens.push({ type: InlineType.Text, value: "–" });
            pos += EM_DASH.length;
            continue;
        } else if (src.startsWith(IMAGE, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: image_tokens } = lexImage(
                src,
                pos + IMAGE.length,
            );
            tokens.push({ type: BlockType.ImageBlock, tokens: image_tokens });
            pos = newPos;
            continue
         } else if (src.startsWith(EMOJI, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: emoji_tokens } = lexRawText(
                src,
                pos + EMOJI.length,
                EMOJI,
            );
            tokens.push({ type: InlineType.Emoji, value: emoji_tokens[0].value });
            pos = newPos;
            continue;
        } else if (src.startsWith(SUBSCRIPT, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: subscript_tokens } = lexInline(
                src,
                pos + SUBSCRIPT.length,
                SUBSCRIPT,
            );

            tokens.push({
                type: InlineType.Subscript,
                tokens: subscript_tokens,
            });

            pos = newPos;
            continue;
        } else if (src.startsWith(QUIP, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: quip_tokens } = lexInline(
                src,
                pos + QUIP.length,
                QUIP,
            );
            tokens.push({ type: InlineType.Quip, tokens: quip_tokens });
            pos = newPos;
            continue;
        
        } else if (src.startsWith(SMALL, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: small_tokens } = lexInline(
                src,
                pos + SMALL.length,
                SMALL,
            );
            tokens.push({ type: InlineType.Small, tokens: small_tokens });
            pos = newPos;
            continue;
        } else if (src.startsWith(BIG, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: big_tokens } = lexInline(
                src,
                pos + BIG.length,
                BIG,
            );
            tokens.push({ type: InlineType.Big, tokens: big_tokens });
            pos = newPos;
            continue;
        } else if (src.startsWith(BOLD, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: bold_tokens } = lexInline(
                src,
                pos + BOLD.length,
                BOLD,
            );
            tokens.push({ type: InlineType.Bold, tokens: bold_tokens });
            pos = newPos;
            continue;
        } else if (src.startsWith(ITALIC, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: italic_tokens } = lexInline(
                src,
                pos + ITALIC.length,
                ITALIC,
            );
            tokens.push({ type: InlineType.Italic, tokens: italic_tokens });
            pos = newPos;
            continue;
        } else if (src.startsWith(MATH, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: math_tokens } = lexRawText(
                src,
                pos + MATH.length,
                MATH_CLOSE
            );
            tokens.push({ type: InlineType.Math, tokens: math_tokens });
            pos = newPos;
            continue;
        } else if (src.startsWith(CODE, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: code_tokens } = lexRawText(
                src,
                pos + CODE.length,
                CODE,
            );
            tokens.push({ type: InlineType.Code, tokens: code_tokens });
            pos = newPos;
            continue;
        } else if (src.startsWith(TOOLTIP, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: tooltip_tokens } = lexRawText(
                src,
                pos + TOOLTIP.length,
                TOOLTIP,
            );
            tokens.push({ type: InlineType.Tooltip, tokens: tooltip_tokens });
            pos = newPos;
            continue;
        } else if (src.startsWith(ANCHOR, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: anchor_tokens } = lexInline(
                src,
                pos + ANCHOR.length,
                ANCHOR_CLOSE,
            );

            pos = newPos;

            if (src.startsWith(ANCHOR_URI, pos)) {
                let { pos: newPos, tokens: anchor_uri_tokens } = lexRawText(
                    src,
                    pos + ANCHOR_URI.length,
                    ANCHOR_URI_CLOSE,
                );

                anchor_tokens.push({
                    type: InlineType.AnchorUri,
                    value: anchor_uri_tokens[0].value,
                });

                pos = newPos;

                if (src.startsWith(ATTRIBUTES, pos)) {
                    let { pos: newPos, tokens: attributes_tokens } = lexRawText(
                        src,
                        pos + ATTRIBUTES.length,
                        ATTRIBUTES_CLOSE,
                    );

                    anchor_tokens.push({
                        type: InlineType.Attributes,
                        value: attributes_tokens[0].value,
                    });

                    pos = newPos;
                }

                tokens.push({
                    type: InlineType.Anchor,
                    tokens: anchor_tokens,
                });

            } else {
                tokens.push({
                    type: InlineType.Reference,
                    tokens: anchor_tokens,
                });
            }
            continue;
        } else if (src.startsWith(SUPERSCRIPT, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            let { pos: newPos, tokens: superscript_tokens } = lexInline(
                src,
                pos + SUPERSCRIPT.length,
                SUPERSCRIPT,
            );
            tokens.push({
                type: InlineType.Superscript,
                tokens: superscript_tokens,
            });
            pos = newPos;
            continue;
        } else if (src.startsWith(BREAK, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            tokens.push({ type: InlineType.Break, value: "\n" });
            pos += BREAK.length;
            continue;
            
        }

        if (pos >= src.length) break;
        buffer += src[pos];
        pos++;
    }

    if (buffer) {
        tokens.push({ type: InlineType.Text, value: buffer });
    }

    return { tokens, pos };
}

function lexImage(src, pos) {
    const tokens = [];
    let buffer = "";

    while (true) {
        if (src.startsWith(IMAGE_CLOSE, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            pos += IMAGE_CLOSE.length;

            if (src.startsWith(IMAGE_URL, pos)) {
                pos += IMAGE_URL.length;

                while (true) {
                    if (src.startsWith(IMAGE_URL_CLOSE, pos)) {
                        if (buffer) {
                            tokens.push({
                                type: InlineType.Href,
                                value: buffer,
                            });
                            buffer = "";
                        }

                        pos += IMAGE_URL_CLOSE.length;
                        return { tokens, pos };
                    }

                    if (pos >= src.length) break;
                    buffer += src[pos];
                    pos++;
                }
            }

            return { tokens, pos };
        }

        if (pos >= src.length) break;
        buffer += src[pos];
        pos++;
    }

    if (buffer) {
        tokens.push({ type: InlineType.Text, value: buffer });
    }

    return { tokens, pos };
}

function lexList(src, pos, customIterator = LIST) {
    const tokens = [];
    let buffer = "";

    while (true) {
        if (src.startsWith(customIterator, pos)) {
            let { pos: newPos, tokens: list_tokens } = lexInline(
                src,
                pos + customIterator.length,
                '\n',
                false,
            );
            tokens.push({ type: InlineType.ListItem, tokens: list_tokens });
            pos = newPos;
            continue;
        } else if (customIterator === LIST && src.startsWith(INNER_LIST, pos)) {
            let { pos: newPos, tokens: inner_list_tokens } = lexList(
                src,
                pos,
                INNER_LIST,
            );

            pos = newPos;

            tokens.push({
                type: BlockType.ListBlock,
                tokens: inner_list_tokens,
            });

            continue;
        } else if (
            customIterator === INNER_LIST &&
            src.startsWith(INNER_INNER_LIST, pos)
        ) {
            let { pos: newPos, tokens: inner_inner_list_tokens } = lexList(
                src,
                pos,
                INNER_INNER_LIST,
            );

            pos = newPos;

            tokens.push({
                type: BlockType.ListBlock,
                tokens: inner_inner_list_tokens,
            });

            continue;
        } else if (
            customIterator === INNER_INNER_LIST &&
            src.startsWith(INNER_INNER_INNER_LIST, pos)
        ) {
            let { pos: newPos, tokens: inner_inner_list_tokens } = lexList(
                src,
                pos,
                INNER_INNER_INNER_LIST,
            );

            pos = newPos;

            tokens.push({
                type: BlockType.ListBlock,
                tokens: inner_inner_list_tokens,
            });

            continue;
        } else if (src.startsWith("\n", pos)) {
            return { tokens, pos };
        }

        if (pos >= src.length) break;
        buffer += src[pos];
        pos++;
    }

    if (buffer) {
        tokens.push({ type: InlineType.Text, value: buffer });
    }

    return { tokens, pos };
}

function lexOrderedList(src, pos) {
    const tokens = [];
    let buffer = "";

    while (true) {
        if (src.startsWith(ORDERED_LIST, pos)) {
            let { pos: newPos, tokens: list_tokens } = lexInline(
                src,
                pos + ORDERED_LIST.length,
                '\n',
                false,
            );
            tokens.push({ type: InlineType.ListItem, tokens: list_tokens });
            pos = newPos;
            continue;
        } else if (src.startsWith(INNER_ORDERED_LIST, pos)) {
            let { pos: newPos, tokens: list_block_tokens } =
                lexOrderedInnerList(
                    src,
                    pos,
                );
            tokens.push({
                type: BlockType.OrderedListBlock,
                tokens: list_block_tokens,
            });
            pos = newPos;
            continue;
        } else if (src.startsWith(INNER_LIST, pos)) {
            let { pos: newPos, tokens: list_block_tokens } =
                lexOrderedInnerList(
                    src,
                    pos,
                );
            tokens.push({
                type: BlockType.ListBlock,
                tokens: list_block_tokens,
            });
            pos = newPos;
            continue;
        } else if (src.startsWith("\n", pos)) {
            return { tokens, pos };
        }

        if (pos >= src.length) break;
        buffer += src[pos];
        pos++;
    }

    if (buffer) {
        tokens.push({ type: InlineType.Text, value: buffer });
    }

    return { tokens, pos };
}

function lexOrderedInnerList(src, pos) {
    const tokens = [];
    let buffer = "";

    while (true) {
        if (src.startsWith(INNER_ORDERED_LIST, pos)) {
            let { pos: newPos, tokens: list_tokens } = lexInline(
                src,
                pos + INNER_ORDERED_LIST.length,
                '\n',
                false,
            );
            tokens.push({ type: InlineType.ListItem, tokens: list_tokens });
            pos = newPos;
            continue;
        } else if (src.startsWith("\n", pos)) {
            return { tokens, pos };
        }

        if (pos >= src.length) break;
        buffer += src[pos];
        pos++;
    }

    if (buffer) {
        tokens.push({ type: InlineType.Text, value: buffer });
    }

    return { tokens, pos };
}

function lexCodeBlock(src, pos) {
    const tokens = [];
    let buffer = "";

    // Initially, try and determine the language and filename the user provides
    // (example, extract html, test.html from ```html:test.html\n. Optionally,
    // the user can also leave out the filename, such as ```html\n)
    let argument_list = [];
    while (true) {
        if (src.startsWith("\n", pos)) {
            if (buffer) {
                argument_list = buffer.split(":");
                buffer = "";
            }
            pos++;
            break;
        }

        if (pos >= src.length) break;
        buffer += src[pos];
        pos++;
    }

    tokens.push(
        { type: InlineType.CodeBlockFilename, value: argument_list[0] },
        { type: InlineType.CodeBlockLineNumbers, value: argument_list[1] },
    );

    buffer = "";

    while (true) {
        if (src.startsWith(CODE_BLOCK, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }
            pos += CODE_BLOCK.length;
            return { tokens, pos };
        }

        if (pos >= src.length) break;
        buffer += src[pos];
        pos++;
    }

    if (buffer) {
        tokens.push({ type: InlineType.Text, value: buffer });
    }

    return { tokens, pos };
}

function lexRawText(src, pos, terminator, skipOnTerminate = true) {
    const tokens = [];
    let buffer = "";

    while (true) {
        if (src.startsWith(terminator, pos)) {
            if (buffer) {
                tokens.push({ type: InlineType.Text, value: buffer });
                buffer = "";
            }

            if (skipOnTerminate) {
                pos += terminator.length;
            }

            return { tokens, pos };
        }

        if (pos >= src.length) break;
        buffer += src[pos];
        pos++;
    }

    if (buffer) {
        tokens.push({ type: InlineType.Text, value: buffer });
    }

    return { tokens, pos };
}

export function lex(src) {
    let { tokens } = lexTemplate(src, 0);
    return tokens;
}
