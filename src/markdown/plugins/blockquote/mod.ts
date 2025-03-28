import { Lex, Plugin, Token } from "@transpiler/mod.ts";
import transpiler from "@markdown/mod.ts";

const OPEN = ">";
const HIGHLIGHT_REGEX =
  /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*|\n)/;

const match: Plugin["match"] = (src: string, pos: number) => {
  if (src[pos] !== OPEN) return false;
  const nextChar = src[pos + 1];
  // Allow '>' followed by space, newline, highlight marker, or end of string
  return nextChar === " " || nextChar === "\n" || nextChar === "[" ||
    nextChar === undefined;
};

const lex: Lex = (src: string, pos: number) => {
  let currentPos = pos;
  const contentLines: string[] = [];
  let highlightType: string | undefined = undefined;
  let firstLineProcessed = false; // Track if we've processed the first potential '>' line
  let isInBlockquoteContext = false;

  while (currentPos < src.length) {
    const lineStartPos = currentPos;

    // Find the end of the current line
    let lineEndPos = src.indexOf("\n", lineStartPos);
    if (lineEndPos === -1) {
      lineEndPos = src.length; // Reached end of file
    }

    const currentLineFull = src.substring(lineStartPos, lineEndPos);
    const lineIsEmpty = currentLineFull.trim().length === 0;
    const startsWithMarker = src.startsWith(OPEN, lineStartPos);

    if (startsWithMarker) {
      isInBlockquoteContext = true; // Definitely in the quote

      // Move past the '>'
      let lineContentStartPos = lineStartPos + OPEN.length;
      // Skip *one* optional space immediately after '>'
      if (src[lineContentStartPos] === " ") {
        lineContentStartPos++;
      }

      const lineContent = src.substring(lineContentStartPos, lineEndPos);

      // Handle Highlight only on the very first line that starts with '>'
      if (!firstLineProcessed) {
        firstLineProcessed = true; // Mark as processed
        const highlightMatch = lineContent.match(HIGHLIGHT_REGEX);
        if (highlightMatch) {
          highlightType = highlightMatch[1];
          // Consume this line (advance position) and continue to the next line
          currentPos = lineEndPos + (lineEndPos < src.length ? 1 : 0); // Skip '\n' if it exists
          continue; // Go to the next iteration of the while loop
        }
        // If it wasn't a highlight, fall through to add content
      }

      // Add the content (if it wasn't a highlight line that we 'continue'd past)
      contentLines.push(lineContent);
      // Mark to advance position after adding content
      currentPos = lineEndPos + (lineEndPos < src.length ? 1 : 0);
    } else { // Line does NOT start with '>'
      // Check for lazy continuation or break
      if (isInBlockquoteContext && !lineIsEmpty) {
        // Lazy continuation: Add the whole line
        contentLines.push(currentLineFull);
        // Mark to advance position
        currentPos = lineEndPos + (lineEndPos < src.length ? 1 : 0);
        firstLineProcessed = true; // A lazy line means we are past the first line check
      } else {
        // Breaks the blockquote (blank line, or not following quote content)
        // Do *not* advance currentPos, just break the loop
        break;
      }
    }
  } // End while loop

  while (src[currentPos] === "\n") {
    currentPos++;
  }

  // We need to have consumed *something* (either found a highlight or added content lines)
  // If currentPos is still the original pos, nothing was consumed.
  if (currentPos === pos) {
    return { tokens: [], pos: pos }; // Return original position, indicating no match
  }

  // Join the collected lines to form the blockquote's inner content
  // Trim leading/trailing whitespace that might result from empty lines / spacing
  const blockquoteInnerContent = contentLines.join("\n").trim();

  // Use the main transpiler to lex the inner content
  // Handle empty content (e.g., "> [!NOTE]" followed by EOF or break)
  const children = blockquoteInnerContent
    ? transpiler.lex(blockquoteInnerContent, 0).tokens
    : [];

  return {
    tokens: [{
      id: "Blockquote",
      children,
      value: highlightType, // Store the highlight type (NOTE, TIP, etc.)
    }],
    pos: currentPos, // Return the final position *after* the consumed blockquote
  };
};

// Render function remains the same
const render: Plugin["render"] = (token: Token) => {
  const highlightType = token.value as string | undefined;
  const className = highlightType
    ? ` class="highlight-${highlightType.toLowerCase()}"`
    : "";
  const innerHTML = token.children && token.children.length > 0
    ? transpiler.renderTokens(token.children)
    : "";
  // Ensure blockquote has at least a non-breaking space if empty, common practice
  return `<blockquote${className}>${innerHTML || " "}</blockquote>`;
};

const plugin: Plugin = {
  id: "Blockquote",
  match,
  lex,
  render,
};

export default plugin;
