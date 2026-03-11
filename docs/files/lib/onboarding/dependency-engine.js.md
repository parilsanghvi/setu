## Purpose
This file implements a rule-based engine for resolving symbol dependencies across the codebase. It maps function and class calls back to their original source definitions by relying on static facts extracted during documentation generation. It runs entirely deterministically without the use of LLMs.

## Exports
- `buildGlobalRegistry`
- `resolveFileDependencies`
- `computeImpactMap`

## Dependencies
- `fs`
- `path`

## Side Effects
Reads from the file system, processes arrays, and generates mappings of caller and callee dependencies.
