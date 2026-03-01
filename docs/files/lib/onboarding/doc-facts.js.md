---
source_hash: bd6405ba22323f2d
facts_hash: 5a6647937ca6ceda
generated_at: 2026-02-25T12:10:10.139Z
generator_version: 1.0.0
model: cheap
quality_score: 91
---
# File: lib/onboarding/doc-facts.js

## Purpose
This file, `doc-facts.js`, is a deterministic fact extraction layer that parses source files with lightweight regex heuristics to produce structured JSON facts. It extracts information about symbols (functions and classes), imports, exports, side effects, and dependencies from the source code. The `extractFacts` function is the main entry point, which takes a file path and repo root as input.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| extractFacts | cjs_named | Extracts facts about a single source file. |
| extractExports | esm_destructured | Parses destructured exports from ES Modules. |
| extractImports | esm | Extracts import statements from ES Modules. |
| extractSideEffects | filesystem_write | Identifies side effects of file system operations. |
| extractSymbols | cjs_default | Extracts function and class definitions from CommonJS files. |

## Internal Logic
The main execution flow of this file is as follows:
1. The `extractFacts` function reads the content of a source file, extracts symbols, imports, exports, side effects, and dependencies using various regex patterns.
2. The `hashContent` function generates a SHA-256 hash of the source code content.
3. The `findDependents` function uses git grep to find files that import or require other files.

Key functions:
- `extractFacts`: Extracts facts from a single source file.
- `hashContent`: Generates a SHA-256 hash of source code content.
- `findDependents`: Finds dependent files using git grep.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| child_process | No | Provides subprocess execution functionality. |
| crypto | No | Offers cryptographic hash generation capabilities. |
| fs | No | Supplies file system operations and utilities. |
| path | No | Handles file path manipulation and normalization. |

## Side Effects
- database: The `extractSideEffects` function checks for database-related side effects by identifying occurrences of `db`, `database`, or similar keywords in the source code.
- filesystem_read: The `extractSideEffects` function identifies filesystem read operations using patterns that match functions like `fs.readFile()`.
- network: The `extractSideEffects` function detects network-related side effects by looking for keywords like `fetch`, `axios`, or similar HTTP client references.
- subprocess: The `extractSideEffects` function checks for subprocess-related side effects by identifying occurrences of `child_process.exec()` or similar functions.

## Dependents
No known dependents.

## Cross-References
- [status.js](./status.js.md)
