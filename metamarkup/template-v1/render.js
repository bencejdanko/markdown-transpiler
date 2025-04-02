import { BlockType, InlineType } from "./types.js";

import temml from "./Temml-0.10.30/dist/temml.mjs";
import { nameToEmoji } from "./gemoji.js";

import he from "he";

export function renderTokens(tokens) {
    return tokens.map(renderToken).join("");
}

function escapeHTML(str) {
    const escaped = he.encode(str, { useNamedReferences: true });
    return escaped.replace(/{/g, "&#123;").replace(/}/g, "&#125;");
}

const alertCircle =
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8"/></svg>`;
const lightbulb =
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22m-3-3q-.425 0-.712-.288T8 18t.288-.712T9 17h6q.425 0 .713.288T16 18t-.288.713T15 19zm-.75-3q-1.725-1.025-2.738-2.75T4.5 9.5q0-3.125 2.188-5.312T12 2t5.313 2.188T19.5 9.5q0 2.025-1.012 3.75T15.75 16zm.6-2h6.3q1.125-.8 1.738-1.975T17.5 9.5q0-2.3-1.6-3.9T12 4T8.1 5.6T6.5 9.5q0 1.35.613 2.525T8.85 14M12 14"/></svg>`;
const ai_line =
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM11 6.094l-.806 2.36a6 6 0 0 1-3.49 3.649l-.25.091l-2.36.806l2.36.806a6 6 0 0 1 3.649 3.49l.091.25l.806 2.36l.806-2.36a6 6 0 0 1 3.49-3.649l.25-.09l2.36-.807l-2.36-.806a6 6 0 0 1-3.649-3.49l-.09-.25zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"/></g></svg>`;

function renderToken(token) {
    switch (token.type) {
        case InlineType.Text:
            return token.value || "";
        case BlockType.TemplateBlock:
            return `<div>${renderTokens(token.tokens || [])}</div>`;
        case BlockType.ParagraphBlock:
            return `<p>${renderTokens(token.tokens || [])}</p>`;
        case BlockType.HeaderBlock:
            const inner = renderTokens(token.tokens || []);
            return `<h1 id="${inner}">${inner}</h1>`;
        case InlineType.Italic:
            return `<i>${renderTokens(token.tokens || [])}</i>`;
        case InlineType.Bold:
            return `<b>${renderTokens(token.tokens || [])}</b>`;
        case InlineType.Emoji:
            return nameToEmoji[token.value];
        case InlineType.Tab:
            return "&nbsp;&nbsp;&nbsp;&nbsp;";
        case InlineType.Break:
            return "<br>";
        case InlineType.Reference:
            return `<a class='template-reference' href="#reference-${renderTokens(token.tokens || [])}">${renderTokens(token.tokens || [])}</a>`;
        case InlineType.Code:
            return `<code>${
                escapeHTML(renderTokens(token.tokens || []))
            }</code>`;
        case InlineType.Anchor:
            const uriToken = token.tokens?.find((t) =>
                t.type === InlineType.AnchorUri
            );
            const attributes = token.tokens?.find((t) =>
                t.type === InlineType.Attributes
            );


            const uri = uriToken ? uriToken.value : "#";
            const anchorText = renderTokens(
                token.tokens?.filter((t) => t.type !== InlineType.AnchorUri) ||
                    [],
            );
            return `<a ${attributes?.value || ""} href='${uri}'>${anchorText}</a>`;
        case InlineType.Tooltip:
            return `<swc-glossary-tooltip term="${
                renderTokens(token.tokens)
            }"></swc-glossary-tooltip>`;
        case BlockType.ImageBlock:
            const srcToken = token.tokens?.find((t) =>
                t.type === InlineType.Href
            );
            const src = srcToken ? srcToken.value : "";
            const alt = renderTokens(
                token.tokens?.filter((t) => t.type !== InlineType.Href) || [],
            );
            return `<div class='images'><img src="${src}" alt="${alt}"></div>`;
        case BlockType.BlockquoteBlock:
            return `<blockquote>${
                renderTokens(token.tokens || [])
            }</blockquote>`;
        case InlineType.Quip:
            return `<span class='quip font-light'>${renderTokens(token.tokens || [])}</span>`;
        case BlockType.Quotation:
            const authorToken = token.tokens?.find((t) =>
                t.type === InlineType.QuoteAuthor
            );
            return `<div class='template-quote'><div class='template-quote-author'><span class='flex items-center gap-1 text-primary text-xs font-mono'>AI-GENERATED${ai_line}</span>${authorToken.value}</div><div class='quote-content'>${
                renderTokens(token.tokens)
            }</div></div>`;
        case BlockType.ListBlock:
            return `<div class='list'><ul>${
                renderTokens(token.tokens || [])
            }</ul></div>`;
        case InlineType.IEEEItem:
            const idToken2 = token.tokens?.find((t) =>
                t.type === InlineType.Id
            );
            const id2 = idToken2 ? idToken2.value : "";
            return `<li id='${id2}'>${renderTokens(token.tokens || [])}</li>`;
        case InlineType.ListItem:
            return `<li>${renderTokens(token.tokens || [])}</li>`;
        case InlineType.Checkbox:
            if (token.value === "checked") {
                return `<input type='checkbox' checked disabled>${
                    renderTokens(token.tokens || [])
                }`;
            } else {
                return `<input type='checkbox' disabled>${
                    renderTokens(token.tokens || [])
                }`;
            }
        case InlineType.Superscript:
            return `<sup>${renderTokens(token.tokens || [])}</sup>`;
        case BlockType.TableBlock:
            return renderTableBlock(token);
        case InlineType.TableHeader:
            return `<th>${renderTokens(token.tokens || [])}</th>`;
        case InlineType.TableRow:
            return `<tr>${renderTokens(token.tokens || [])}</tr>`;
        case InlineType.TableCell:
            return `<td>${renderTokens(token.tokens || [])}</td>`;
        case BlockType.HorizontalRule:
            return "<hr>";
        case BlockType.Center:
            return `<div class='center'>${
                renderTokens(token.tokens || [])
            }</div>`;
        case InlineType.Small:
            return `<small>${renderTokens(token.tokens || [])}</small>`;
        case BlockType.OrderedListBlock:
            return `<div class='list'><ol>${
                renderTokens(token.tokens || [])
            }</ol></div>`;
        case InlineType.Math:
            return `${temml.renderToString(renderTokens(token.tokens || []))}`;
        case InlineType.Big:
            return `<big>${renderTokens(token.tokens || [])}</big>`;
        case BlockType.Header2Block:
            const inner2 = renderTokens(token.tokens || []);
            return `<h2 id="${inner2}">${inner2}</h2>`;
        case BlockType.Header3Block:
            const inner3 = renderTokens(token.tokens || []);
            return `<h3 id="${inner3}">${inner3}</h3>`;
        case BlockType.Header4Block:
            const inner4 = renderTokens(token.tokens || []);
            return `<h4 id="${inner4}">${inner4}</h4>`;
        case BlockType.Header5Block:
            const inner5 = renderTokens(token.tokens || []);
            return `<h5 id="${inner5}">${inner5}</h5>`;
        case BlockType.Header6Block:
            const inner6 = renderTokens(token.tokens || []);
            return `<h6 id="${inner6}">${inner6}</h6>`;
        case InlineType.Subscript:
            return `<sub>${renderTokens(token.tokens || [])}</sub>`;
        case BlockType.BlockId:
            return `<div id="${renderTokens(token.tokens)}"></div>`;
        case BlockType.AlertBlock:
            return `<div class='alert'><div class='shrink-0'>${alertCircle}</div><div class='alert-content'>${
                renderTokens(token.tokens)
            }</div></div>`;
        case BlockType.TipBlock:
            return `<div class='tip'><div class='shrink-0'>${lightbulb}</div><div class='tip-content'>${
                renderTokens(token.tokens)
            }</div></div>`;
        case BlockType.CodeBlock:
            const filename = token.tokens?.find((t) =>
                t.type === InlineType.CodeBlockFilename
            )?.value;
            const lineNumbers = token.tokens?.find((t) =>
                t.type === InlineType.CodeBlockLineNumbers
            )?.value;

            if (filename === "mermaid") {
                return `<div class='template-mermaid'><pre class='mermaid'>${
                    renderTokens(token.tokens)
                }</pre></div>`;
            }

            if (filename === "openapi") {
                return `<div class='openapi' id='${lineNumbers}' spec="${
                    escapeHTML(renderTokens(token.tokens))
                }"></div>`;
            }

            if (filename) {
                return `<div class='swc-code-block'><swc-code-block code="${
                    escapeHTML(renderTokens(token.tokens))
                }" filename="${filename}" ${
                    lineNumbers ? "lineNumbers=true" : ""
                }></swc-code-block></div>`;
            } else {
                return `<div class='code-block'><pre><code>${
                    escapeHTML(renderTokens(token.tokens))
                }</code></pre></div>`;
            }
        default:
            return "";
    }
}

function renderTableBlock(token) {
    // Extract the delimiter token that contains the alignment info.
    const delimiterToken = token.tokens.find(
        (child) => child.type === InlineType.TableDelimiter,
    );
    // The delimiter token holds an array of alignments.
    const alignments = delimiterToken ? delimiterToken.alignments : [];

    // Render the table rows. We ignore the delimiter token here.
    const rowsHtml = token.tokens
        .map((child) => {
            if (child.type === InlineType.TableHeader) {
                // Render the header row.
                const headerHtml = child.tokens
                    .map((cell, idx) => {
                        const alignment = alignments[idx];
                        // Use a style attribute (or you could use align="...").
                        return `<th>${renderTokens(cell.tokens || [])}</th>`;
                    })
                    .join("");
                return `<tr>${headerHtml}</tr>`;
            } else if (child.type === InlineType.TableRow) {
                // Render a normal table row.
                const rowHtml = child.tokens
                    .map((cell, idx) => {
                        const alignment = alignments[idx];
                        const styleAttr = alignment
                            ? ` style="text-align: ${alignment};"`
                            : "";
                        return `<td${styleAttr}>${
                            renderTokens(cell.tokens || [])
                        }</td>`;
                    })
                    .join("");
                return `<tr>${rowHtml}</tr>`;
            }
            // Skip tokens like TableDelimiter.
            return "";
        })
        .join("");

    return `<table class='template-table'><tbody>${rowsHtml}</tbody></table>`;
}
