# context-builder.js

## Purpose
The `context-builder.js` file is responsible for assembling a structured documentation context for files in the repository. It gathers documentation chunks (headers, snippets) and metrics into a cohesive payload to help LLM agents understand the codebase.

## Exports
- `buildContext`: A function that generates the context string.

## Dependencies
- `fs`: For file system operations.
- `path`: For path manipulation.

## Side Effects
Reads from the `docs/` directory.
