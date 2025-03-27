import { Token, Plugin, Lex } from "@transpiler/mod.ts";
import transpiler from "@markdown/mod.ts";

const OPEN = ">";
const HIGHLIGHT_REGEX = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*|\n)/;

const match: Plugin['match'] = (src: string, pos: number) => {
    // Optimization: Also check if it's followed by a space or end of line/string,
    // although the main lex handles the actual consumption.
    // return src.startsWith(OPEN, pos);
    // Let's be slightly more robust for the initial match: '>' followed by space or EOL/EOF
     if (src[pos] !== OPEN) return false;
     const nextChar = src[pos + 1];
     return nextChar === ' ' || nextChar === '\n' || nextChar === undefined;

};

const lex: Lex = (src: string, pos: number) => {
    let currentPos = pos;
    const contentLines: string[] = [];
    let highlightType: string | undefined = undefined;
    let firstLine = true;
    let isInBlockquoteContext = false; // Start assuming we are not, the first '>' line will set this

    while (currentPos < src.length) {
        const lineStartPos = currentPos;

        // Find the end of the current line
        let lineEndPos = src.indexOf('\n', lineStartPos);
        if (lineEndPos === -1) {
            lineEndPos = src.length; // Reached end of file
        }

        // Extract the full current line to check for blankness
        const currentLineFull = src.substring(lineStartPos, lineEndPos);

        let lineContentToAdd: string | null = null; // What content to add, null if line breaks quote
        let startsWithMarker = src.startsWith(OPEN, lineStartPos);

        if (startsWithMarker) {
            // Line starts with '>'
            isInBlockquoteContext = true; // We are definitely in the quote now

            // Move past the '>'
            let lineContentStartPos = lineStartPos + OPEN.length;
            // Skip *one* optional space immediately after '>'
            if (src[lineContentStartPos] === ' ') {
                lineContentStartPos++;
            }

            // Extract the raw content of this line (part after '>')
            let lineContent = src.substring(lineContentStartPos, lineEndPos);

            // Handle Highlight only on the very first line that starts with '>'
            if (firstLine) {
                firstLine = false; // Don't check highlight again
                const highlightMatch = lineContent.match(HIGHLIGHT_REGEX);
                if (highlightMatch) {
                    highlightType = highlightMatch[1];
                    // Remove the highlight syntax from the line content
                    lineContent = lineContent.substring(highlightMatch[0].length);
                }
            }
            lineContentToAdd = lineContent;

        } else {
            // Line does NOT start with '>'
            // Check for lazy continuation:
            // 1. Must be following a line that was part of the quote (isInBlockquoteContext is true)
            // 2. Must not be a blank line (interrupts the quote)
            if (isInBlockquoteContext && currentLineFull.trim().length > 0) {
                // It's a lazy continuation line
                // Add the entire line content as is
                lineContentToAdd = currentLineFull;
                // We remain in the blockquote context
            } else {
                // Not a lazy line (blank line, or not following quote content)
                // This line breaks the blockquote. Set context false and prepare to exit.
                isInBlockquoteContext = false;
                lineContentToAdd = null; // Signal to break loop
            }
        }

        // --- Loop Control ---
        if (lineContentToAdd !== null) {
            // Consume the line and add its content
            contentLines.push(lineContentToAdd);
            // Move currentPos to the start of the next line (or end of src)
            currentPos = lineEndPos + (lineEndPos < src.length ? 1 : 0); // Skip '\n' if it exists
            // If the line started *without* '>', firstLine flag becomes irrelevant (can't check highlight anymore)
            if(!startsWithMarker) {
                firstLine = false;
            }
        } else {
            // Line breaks the blockquote, break the loop without advancing currentPos
            break;
        }
    } // End while loop

    // If we didn't consume any lines (e.g., just '>' at EOF, or failed lazy check immediately)
    // The check should be if contentLines is empty, as currentPos might advance over the initial '>'
    if (contentLines.length === 0) {
      return { tokens: [], pos: pos }; // Return original position
    }

    // Join the collected lines to form the blockquote's inner content
    const blockquoteInnerContent = contentLines.join('\n');

    // Use the main transpiler to lex the inner content
    const { tokens: children } = transpiler.lex(blockquoteInnerContent, 0);

    return {
        tokens: [{
            id: "Blockquote",
            children,
            value: highlightType
        }],
        // currentPos is already correctly positioned after the last consumed line
        pos: currentPos
    };
};

// Render function remains the same
const render: Plugin['render'] = (token: Token) => {
    const highlightType = token.value as string | undefined;
    const className = highlightType ? ` class="highlight-${highlightType.toLowerCase()}"` : "";
    const innerHTML = token.children && token.children.length > 0
        ? transpiler.renderTokens(token.children)
        : "";
    return `<blockquote${className}>${innerHTML}</blockquote>`;
};


const plugin: Plugin = {
    id: "Blockquote",
    match,
    lex,
    render
};

export default plugin;