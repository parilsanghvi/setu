---
source_hash: bd6405ba22323f2d
facts_hash: 01d6ec6d6c9721e5
generated_at: 2026-03-04T05:42:51.221Z
generator_version: 1.0.0
model: cheap
quality_score: 97
---
# File: lib/onboarding/doc-facts.js

## Purpose
This file, `doc-facts.js`, is a critical component of the system that extracts deterministic facts from source files using lightweight regex heuristics. It parses source code with language-agnostic patterns to produce structured JSON facts without involving large language models (LLMs). The results are deterministic, meaning stable ordering and normalized paths.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `extractFacts` | function | Extracts all facts from a single source file. |
| `extractExports` | cjs_named | Extracts exported variables and functions from source code. |
| `extractImports` | cjs_named | Extracts imported modules and variables from source code. |
| `extractSideEffects` | cjs_named | Identifies side effects in source code, such as filesystem writes or network requests. |
| `extractSymbols` | cjs_named | Analyzes function and class definitions to extract symbols (names). |
| `findDependents` | cjs_named | Finds files that import or require a given file, using git grep when available. |
| `hashContent` | cjs_named | Computes the SHA-256 hash of source code content. |
| `length` | cjs_prop | Returns the number of lines in the source file. |

## Internal Logic
The main execution flow involves reading the source file, applying language-agnostic regex patterns to extract facts and symbols, and then processing the extracted data.

1. The `extractFacts` function reads the source file content and applies regex patterns to extract facts such as file metadata, imported modules, exported variables, side effects, and symbols.
2. The `hashContent` function computes the SHA-256 hash of the source code content.
3. The `findDependents` function searches for files that import or require a given file using git grep when available.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./status` | Yes | 
| `child_process` | No | Used by the system but not directly by this file. |
| `crypto` | No | Used to compute SHA-256 hashes of source code content. |
| `fs` | No | Used to read and manipulate file paths and contents. |
| `path` | No | Used to normalize and manipulate file paths. |

## Side Effects
The extracted facts and symbols can trigger various side effects in the system, including:
* Database: When a fact or symbol is imported from an external module, it may be stored in the database for later use.
* Filesystem_read: The extraction process involves reading file contents, which can trigger filesystem reads.
* Network: Some functions, like `extractFacts`, involve network requests to retrieve additional data or information.
* Subprocess: The system uses subprocesses to execute external commands, such as git grep, when searching for dependent files.

## Dependents
- [doc-enricher.js](./doc-enricher.js.md)

## Cross-References
- [status.js](./status.js.md)
- [doc-enricher.js](./doc-enricher.js.md)
