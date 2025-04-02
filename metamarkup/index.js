import { lex, lexInline } from "./template-v1/lexer.js";
import { renderTokens } from "./template-v1/render.js";

function renderTemplate(content) {
    let tokens = lex("\n" + content);
    let result = renderTokens(tokens);
    return result;
}

function renderTemplateTokens(content) {
    let tokens = lex("\n" + content);
    return tokens;
}

function renderTemplateInline(content) {
    let { tokens } = lexInline(content, 0);
    let result = renderTokens(tokens);
    return result;
}

export { renderTemplateInline, renderTemplate, renderTemplateTokens }