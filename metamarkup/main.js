import { renderTemplate, renderTemplateTokens, renderTemplateInline } from "./index.js";

const test = await Deno.readTextFile('./test.txt');

console.log(renderTemplate(test));