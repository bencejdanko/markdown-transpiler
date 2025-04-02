# Markdown Transpiler Experiments

This repo contains two versions of a custom Markdown transpiler, initially built for a Svelte preprocessor used on my personal website, then moved to running in a pre-build step using the Deno runtime. The project was initially inspired by a [state-machine lexical scanning](https://www.youtube.com/watch?v=HxaD_trXwRE) presentation by Rob Pike.

## Versions & Evolution

1. Template-v1 – A pure JavaScript-based transpiler that used a state-machine approach for parsing. While effective, it suffered from large file sizes and stability issues.

2. Plugin-based transpiler – A more extensible and flexible system that allowed developers to create their own transpilers by registering matcher, lexer, and renderer functions as plugins. This modular approach made iteration easy and felt like a major breakthrough.

Proud of my plugin system, I sought ways to refine it, only to have an LLM just replace my implementation with the `Marked.js` library, which already had a mature plugin-based architecture with more features. I've moved onto using `marked` for all future projects.

Feel free to explore this repository as a learning reference!

