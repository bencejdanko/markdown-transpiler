import { Token, Plugin } from "@transpiler/mod.ts"; // Assuming this path is correct
import { inlineTranspiler } from "@markdown/mod.ts"; // Assuming this path is correct

const ID = "Anchor"; // Changed ID
const TEXT_OPEN = "[";
const TEXT_CLOSE = "]";
const URL_OPEN = "(";
const URL_CLOSE = ")";

/**
 * Checks if the source string starts with the opening bracket for a link text.
 */
const match = (src: string, pos: number): boolean => {
    return src.startsWith(TEXT_OPEN, pos);
};

/**
 * Lexes a hyperlink token `[text](url)`.
 * Returns the token and the position after the hyperlink, or undefined if not a valid hyperlink.
 */
const lex: Plugin["lex"] = (src: string, pos: number): { tokens: Token[]; pos: number } => {
    // 1. Lex the link text inside []
    
    const { tokens: childrenTokens, pos: textEndPos } = inlineTranspiler.lex(src, pos + TEXT_OPEN.length, TEXT_CLOSE);

    // 2. Check for and parse the URL part ()
    // Expect URL_OPEN immediately after TEXT_CLOSE
    if (src[textEndPos] !== URL_OPEN) {
        // Not a valid link structure, missing '(' after ']'
        return { tokens: [], pos: textEndPos }; // Return empty tokens and current position
    }

    const urlStartIndex = textEndPos + URL_OPEN.length;
    const urlEndIndex = src.indexOf(URL_CLOSE, urlStartIndex);

    if (urlEndIndex === -1) {
        // Closing ')' not found
        return { tokens: [], pos: textEndPos }; // Return empty tokens and current position
    }

    // Extract the URL
    const urlValue = src.substring(urlStartIndex, urlEndIndex);
    // Calculate the final position after the URL part
    const finalPos = urlEndIndex + URL_CLOSE.length;

    // 3. Construct the Hyperlink token
    const token: Token = {
        id: ID,
        children: childrenTokens, // Tokens for the link text
        value: urlValue,         // The URL string
    };

    return { tokens: [token], pos: finalPos };
};

/**
 * Renders a Hyperlink token to an HTML <a> tag.
 */
const render = (token: Token): string => {
    // Ensure value is a string (should be if lexing was successful)
    if (typeof token.value !== 'string') {
        console.warn(`Hyperlink token is missing or has an invalid 'value' (URL):`, token);
        // Fallback: render children text content without a link
        return token.children ? inlineTranspiler.renderTokens(token.children) : "";
    }

    const href = token.value; // In a real-world scenario, you might want to sanitize/encode this URL
    const linkText = (token.children && token.children.length > 0)
        ? inlineTranspiler.renderTokens(token.children)
        : ""; // Render empty string if no link text

    // Basic HTML escaping for the href attribute to prevent injection issues
    const escapedHref = href.replace(/"/g, '"');

    return `<a href="${escapedHref}">${linkText}</a>`;
};

// Define the plugin object
const plugin: Plugin = {
    id: ID,
    match,
    lex,
    render,
};

export default plugin;