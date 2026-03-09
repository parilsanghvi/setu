---
source_hash: a04e0e5621fb7a6b
facts_hash: f9a08ea2cb95dfd0
generated_at: 2026-03-09T20:10:00.000Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: lib/onboarding/dependency-engine.js

## Purpose
This file provides a deterministic, rule-based engine for resolving symbol dependencies across the project. It maps function and class calls to their source definitions using static facts collected during documentation generation, without relying on external LLM calls. It helps understand cross-file interactions programmatically.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `buildGlobalRegistry` | function | Builds a map of all exported symbols and the files that export them. |
| `resolveFileDependencies` | function | Resolves call sites within a file to their likely source files. |
| `computeImpactMap` | function | Computes a downstream impact map showing which files call a given file's symbols. |

## Internal Logic
The file contains three primary functions:
1. `buildGlobalRegistry`: Iterates over an array of file facts and maps each exported symbol to the file(s) that export it.
2. `resolveFileDependencies`: Takes a single file's facts and the global registry, looking up each symbol called in the file to determine which external file provides it, sorting the results deterministically.
3. `computeImpactMap`: Runs `resolveFileDependencies` across all files to build a reverse mapping: for each file, it lists the callers and the specific symbols they use.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `path` | No | Node.js built-in path module. |
| `fs` | No | Node.js built-in filesystem module. |

## Side Effects
None. This file contains pure functions for processing data structures (arrays and maps of symbols/facts).

## Dependents
- [lib/onboarding/doc-enricher.js](./doc-enricher.js.md)
- [lib/onboarding/generator.js](./generator.js.md)

## Cross-References
- [lib/onboarding/doc-enricher.js](./doc-enricher.js.md)
- [lib/onboarding/generator.js](./generator.js.md)
