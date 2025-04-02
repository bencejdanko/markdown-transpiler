/** 
 * This script will render a markdown file to html to a specified output path.
 */

import { renderTemplate } from "./index.js";

if (Deno.args.length < 2) {
    console.error("Please provide a file path and an output path as arguments.");
    Deno.exit(1);
}

const filePath = Deno.args[0];
const outputPath = Deno.args[1];
const fileContent = await Deno.readTextFile(filePath);
const rendered = renderTemplate(fileContent);

await Deno.writeTextFile(outputPath, rendered);
console.log(`Rendered ${filePath} to ${outputPath}.`);