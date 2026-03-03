---
source_hash: 51de3b3e45682d7e
facts_hash: 4d708eb664e94676
generated_at: 2026-03-03T07:22:05.873Z
generator_version: 1.0.0
model: cheap
quality_score: 90
---
# File: lib/onboarding/codeowners.js

## Purpose
This file provides two functions, `parseCodeowners` and `matchCodeowners`, which are used to parse and match code ownership rules in a CODEOWNERS file. The `parseCodeowners` function reads a CODEOWNERS file, parses its contents, and returns an array of rule objects, while the `matchCodeowners` function takes a target path and a list of rules and returns the matching rule or null if no match is found.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `parseCodeowners` | cjs_named | Parses a CODEOWNERS file and returns an array of rule objects. |
| `matchCodeowners` | cjs_named | Matches a target path against a list of rules and returns the matching rule or null. |

## Internal Logic
The main execution flow is as follows:
- The `parseCodeowners` function reads a CODEOWNERS file, splits its contents into lines, and trims each line to remove whitespace and comments.
- It then iterates over each line, splitting it into parts using standard whitespace characters as delimiters. If the line does not contain at least two parts or starts with a comment, it is skipped.
- For each valid line, the function extracts the pattern and owners from the parts, creates a new rule object with these values, and adds it to the rules array.
- The `matchCodeowners` function takes a target path and the parsed rules array as input, iterates over each rule, and uses its regex pattern to test the target path. If a match is found, the matching rule is returned.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides access to file system functionality for reading CODEOWNERS files. |
| `path` | No | Provides utility functions for working with file paths and directories. |

## Side Effects
- filesystem_read: The `parseCodeowners` function reads the contents of a CODEOWNERS file from disk, which may cause I/O operations and potentially alter the original file's state.
- filesystem_write: Although not explicitly stated in this code snippet, any changes made by the parsed rules (e.g., assigning owners) would require writing back to the original file, which could also cause I/O operations.

## Dependents
- [drift.js](./drift.js.md)

## Cross-References
- [drift.js](./drift.js.md)
