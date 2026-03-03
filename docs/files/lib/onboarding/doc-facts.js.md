---
source_hash: bd6405ba22323f2d
facts_hash: 8f5dee0e23367660
generated_at: 2026-03-03T07:23:14.060Z
generator_version: 1.0.0
model: cheap
quality_score: 97
---
# File: lib/onboarding/doc-facts.js

## Purpose
This file, `doc-facts.js`, is a deterministic fact extraction layer that parses source files with lightweight regex heuristics to produce structured JSON facts without involving Large Language Models (LLMs). It extracts symbols, imports, exports, and side effects from the source code, providing a stable ordering and normalized paths. The extracted facts can be used for various purposes such as dependency analysis and debugging.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| extractFacts | cjs_named | Extracts all facts from a single source file. |
| extractExports | esm_named | Parses destructured exports and finds individual export statements. |
| extractImports | esm_named | Finds import statements with relative or absolute paths. |
| extractSideEffects | filesystem_write | Identifies side effects using regular expressions. |
| extractSymbols | function | Extracts functions, classes, and arrow functions from the source code. |
| findDependents | cjs_named | Finds files that import or require a given file. |
| hashContent | cjs_prop | Generates a SHA-256 hash of the content as a property. |

## Internal Logic
The main execution flow involves:

1. `extractFacts`: Reads the source file, extracts facts, and returns an object containing various properties such as file path, extension, lines, symbols, imports, exports, dependents, side effects, and confidence level.
2. `hashContent`: Uses the SHA-256 algorithm to generate a hash of the content.
3. `extractSymbols`, `extractImports`, and `extractExports` functions work together to extract relevant information from the source code by matching patterns with regular expressions.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| crypto | Yes | Provides cryptographic functions. |
| fs | No | Offers file system operations. |
| path | No | Manages file paths and directories. |
| child_process | No | Allows execution of external commands. |

## Side Effects
- Database: Extracts database-related side effects using regular expressions.
- Filesystem_read: Identifies filesystem-read related side effects by matching patterns with `fs.readFile` or similar functions.
- Network: Detects network-related side effects by matching patterns with HTTP requests (e.g., `fetch`, `axios`, or `https.request`).
- Subprocess: Finds subprocess-related side effects by identifying function calls to `child_process.exec`, `child_process.spawn`, or similar methods.

## Dependents
- [doc-enricher.js](./doc-enricher.js.md)

## Cross-References
- [status.js](./status.js.md)
- [doc-enricher.js](./doc-enricher.js.md)
