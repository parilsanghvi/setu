---
source_hash: 51de3b3e45682d7e
facts_hash: 50f15aa3f82de336
generated_at: 2026-03-04T05:41:43.386Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: lib/onboarding/codeowners.js

## Purpose
This file is responsible for parsing and matching codeowners rules in a CODEOWNERS file, allowing the system to determine ownership of files based on patterns and owners specified.

| Export | Type | Description |
|--------|------|-------------|
| `parseCodeowners` | cjs_named | Parses a CODEOWNERS file and returns an array of rules. |
| `matchCodeowners` | cjs_named | Matches a target path against the parsed codeowner rules and returns the matching rule, if any. |

## Internal Logic
The main execution flow involves parsing the CODEOWNERS file using the `parseCodeowners` function, which reads the file contents, splits it into lines, and extracts the pattern and owners for each line. The extracted rules are then passed to the `matchCodeowners` function, which tests each rule against a target path and returns the matching rule, if any.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system functionality. |
| `path` | No | Provides path manipulation utilities. |

## Side Effects
- filesystem_read: Reads the contents of a CODEOWNERS file using `fs.readFileSync`.

## Dependents
- [drift.js](./drift.js.md)

## Cross-References
- [drift.js](./drift.js.md)
