import transpiler, { Metadata } from "@markdown/mod.ts";
const example = "# hello world"
// lex the example, extract the id="Frontmatter" token, json dump it, and use the title and description for metadata
Deno.serve({ port: 4242 }, (_req) => {
    // lex the example
    const { tokens } = transpiler.lex(example, 0);
    // extract the id="Frontmatter" token
    const frontmatter = tokens.find((token) => token.id === "Frontmatter");
    // json dump it
    const meta: Metadata = frontmatter ? JSON.parse(frontmatter.value || "") : {};

    // generate HTML with additional metadata
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${meta.title || "Default Title"}</title>
            <meta name="description" content="${meta.description || "Default Description"}">
        </head>
        <body>
            ${transpiler.renderHTML(example)}
        </body>
        </html>
    `;

    return new Response(html, {
        headers: {
            "content-type": "text/html; charset=utf-8",
        },
    });
});
