---
source_hash: f59676842487a26c
facts_hash: 951e723271d2680b
generated_at: 2026-02-25T12:13:38.880Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: scripts/check-doc-links.js

## Purpose
This file is responsible for scanning all documentation links in a repository and validating their internal markdown links. It provides two main modes of operation: validation-only and auto-fix. The `validateAllLinks` function from the `../lib/onboarding/doc-links` module is used to perform the link validation.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `validateAllLinks` | function |  | Returns a report object containing various link validation metrics. |
| `fixDir` | function | `dir` | Automatically fixes broken markdown links in the specified directory. |

## Internal Logic
The main execution flow of this file is as follows:

1. It reads command-line arguments to determine whether to perform validation-only or auto-fix mode.
2. It calls the `validateAllLinks` function from the `../lib/onboarding/doc-links` module, passing the repository root directory as an argument.
3. If auto-fix mode is enabled, it defines a recursive function `fixDir` that traverses the directory tree, reads markdown files, and applies fixes to broken links.
4. After fixing links in all directories, it generates a report object containing various link validation metrics.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `path` | No | Provides path manipulation utilities for resolving directory paths. |
| `fs` | No | Provides file system utilities for reading and writing files. |

## Side Effects
- console_output: The script outputs a JSON-formatted report to the console in validation-only mode, or a human-readable summary with links fixed in auto-fix mode.
- filesystem_read: The script reads markdown files from the directory tree using `fs.readFileSync` or `fs.readdirSync`.
- filesystem_write: In auto-fix mode, the script writes back modified markdown files to disk using `fs.writeFileSync`.
- process_control: The script exits with a status code indicating success (0) if all links are valid, or failure (1) if broken links are found.

## Dependents
No known dependents.

## Cross-References
- [doc-links.js](../lib/onboarding/doc-links.js.md)
