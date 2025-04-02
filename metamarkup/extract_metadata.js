/**
 * This script will extract metadata from the markdown,
 * and will store it as a json object.
 * 
 * YAML from markdown:
 * ---
 * title: ""
 * description: ""
 * authors: [""]
 * tags: [""]
 * date: ""
 * ---
 * 
 * In addition, we want to extract sections, and figures.
 * 
 * Here is an example:
 * sections: [
 *      "1. Introduction",
 *      "2. Background",
 *      [
 *          "2a". "Subsection 1", 
 *          "2b". "Subsection 2", 
 *          ["2b1". "Subsubsection 1"]
 *      ],   
 *     "3. Conclusion"
 *  ]
 * 
 * figures: [
 *    {
 *      "content": "![description](path/to/image)",
 *      "description: "*Figure 1*: example figure"
 *    }
 * ]
 */

import { lex } from "./template-v1/lexer.js";
import { renderTokens } from "./template-v1/render.js";
import { renderTemplateInline } from "./index.js";
import { BlockType, InlineType } from "./template-v1/types.js";

import { parseArgs } from "jsr:@std/cli/parse-args";

const flags = parseArgs(Deno.args, {
    string: ["input", "output", "title", "parent"],
    boolean: ["children"],
    default: { children: false }
})

if (!flags.input || !flags.output || !flags.title) {
    console.error("Please provide input, output, and title flags.");
    let missing = [];
    if (!flags.input) missing.push("input");
    if (!flags.output) missing.push("output");
    if (!flags.title) missing.push("title");
    console.error(`Missing flags: ${missing.join(", ")}`);

    Deno.exit(1);
}

if (Deno.args.length < 2) {
    console.error("Please provide a file path and an output path as arguments.");
    Deno.exit(1);
}

const filePath = flags.input;
const outputPath = flags.output;
const fileContent = await Deno.readTextFile(filePath);

// Helper function to collect tokens of certain types
function collectTokensOfType(tokens, types) {
    let collectedTokens = [];

    function collect(tokens) {
        for (const token of tokens) {
            if (types.includes(token.type)) {
                collectedTokens.push(token);
            }
            if (token.tokens) {
                collect(token.tokens);
            }
        }
    }

    collect(tokens);
    return collectedTokens;
}

// Function to parse header tokens into a nested list format
function parseHeaderTokens(headerTokens) {
    const sections = [];
    const stack = [{ level: 0, children: sections }];

    headerTokens.forEach(token => {
        const level = parseInt(token.type.replace('Header', '').replace('Block', ''), 10);
        const text = renderTokens(token.tokens);

        const newSection = text;

        while (stack.length > 1 && stack[stack.length - 1].level >= level) {
            stack.pop();
        }

        const parent = stack[stack.length - 1].children;
        const section = { level, text: newSection, children: [] };
        parent.push(section);
        stack.push(section);
    });

    function formatSections(sections) {
        return sections.map(section => {
            if (section.children.length > 0) {
                return [section.text, formatSections(section.children)];
            }
            return section.text;
        });
    }

    return formatSections(sections);
}

const tokens = lex(`\n${fileContent}`);
const headerTokens = collectTokensOfType(tokens, [BlockType.HeaderBlock, BlockType.Header2Block, BlockType.Header3Block, BlockType.Header4Block, BlockType.Header5Block, BlockType.Header6Block]);

const sections = parseHeaderTokens(headerTokens);

const YAMLTokens = collectTokensOfType(tokens, [BlockType.YAMLBlock]);
//const figureTokens = collectTokensOfType(tokens, [BlockType.ImageBlock]);
// task 1: parser for getting YAML - simple, we just need to filter for tokens of type 

const references = collectTokensOfType(tokens, [BlockType.IEEEBlock]);

const referencesList = references.map(token => renderTemplateInline(token.tokens[0].value.trim()));

import './js-yaml.min.js'

const json = jsyaml.load(YAMLTokens[0].tokens[0].value);

json.title = renderTemplateInline(flags.title ? flags.title : "");
json.description = renderTemplateInline(json.description ? json.description : "");

if (flags.parent) {
    json.parent = renderTemplateInline(flags.parent);
}


json.sections = sections;

if (json.children) {
    json.sections.push("Directory");
}

if (referencesList.length > 0) {
    json.references = referencesList
    json.sections.push("References")
}


// Write the tokens to the output file as JSON
await Deno.writeTextFile(outputPath, JSON.stringify(json, null, 2));
console.log(`Metadata written to ${outputPath}`);