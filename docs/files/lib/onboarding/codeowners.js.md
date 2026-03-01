---
source_hash: 51de3b3e45682d7e
facts_hash: eb652f7bc603ed9b
generated_at: 2026-02-25T12:09:06.010Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: lib/onboarding/codeowners.js

## Purpose
This file is responsible for parsing CODEOWNERS files and matching code ownership rules against given paths, serving as a crucial component in enforcing code ownership permissions in Git repositories.

| Export | Type | Description |
|--------|------|-------------|
| `parseCodeowners` | cjs_named | Parses a CODEOWNERS file at the specified path to extract pattern-owner pairs. |
| `matchCodeowners` | cjs_named | Matches a given target path against the patterns defined in the parsed CODEOWNERS rules and returns the corresponding rule or null if no match is found. |

## Internal Logic
The main execution flow of this file involves:
- `parseCodeowners`: reads the contents of the specified CODEOWNERS file, splits it into individual lines, trims and processes each line to extract pattern-owner pairs, and stores them in a rules array.
- `matchCodeowners`: iterates over the parsed rule array and checks if the target path matches any of the patterns defined in the rules. If a match is found, returns the corresponding rule; otherwise, returns null.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system functionality for reading CODEOWNERS files. |
| `path` | No | Offers path manipulation utilities to handle file paths in a standardized way. |

## Side Effects
- filesystem_read: The `fs.readFileSync` function reads the contents of the specified CODEOWNERS file, which can potentially cause the file to be loaded into memory if its size exceeds a certain threshold.
- potential regex performance impact: The `patternToRegex` function generates regular expressions from pattern strings, which can have significant performance implications for large numbers of patterns or complex patterns.

## Dependents
- [drift.js](./drift.js.md)

## Cross-References
- [drift.js](./drift.js.md)
