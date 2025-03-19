import { Application, Router } from "jsr:@oak/oak";

import {
  bundledLanguages,
  createHighlighter,
  makeSingletonHighlighter,
} from "npm:shiki";

import { setup, tw } from "npm:twind"
import { virtualSheet, getStyleTag } from "npm:twind/sheets";


const getHighlighter = makeSingletonHighlighter(createHighlighter);

let highlighter: Awaited<ReturnType<typeof getHighlighter>>;

// Initialize highlighter once at startup with only needed languages
(async () => {
  highlighter = await getHighlighter({
    themes: ["github-light", "github-dark"],
    langs: ["javascript"], // Only load necessary languages
  });
})();

const codeToHtml = async (
  { code, language }: { code: string; language: string },
) => {
  const result = highlighter.codeToHtml(code, {
    lang: language,
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
  });

  return result;
};

const sheet = virtualSheet();
setup({ sheet });

const router = new Router();

router.get("/", async (ctx) => {
  const highlightedCode = await codeToHtml({
    code: "console.log('Hello, world!')",
    language: "javascript",
  });
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>SSR Example</title>
        ${getStyleTag(sheet)}
    </head>
    <body>
    <div class="${tw`p-4`}">${highlightedCode}</div>
    </body>
    </html>`;

    sheet.reset();

    ctx.response.body = html;
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
