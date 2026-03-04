---
source_hash: f59676842487a26c
facts_hash: 8139745df61e6060
generated_at: 2026-03-04T05:47:56.518Z
generator_version: 1.0.0
model: cheap
quality_score: 88
---
# File: scripts/check-doc-links.js

## Purpose
This file, `check-doc-links.js`, is a script that scans all documentation files in the repository and validates internal Markdown links. It uses the `validateAllLinks` function from the `../lib/onboarding/doc-links` module to perform the validation. The script provides an option to fix broken links automatically.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `validateAllLinks` | function |  | Validates all internal Markdown links in a repository |
| `fixDir` | function | `dir` | Fixes broken links in the specified directory |
| `for` | method | `const entry of entries` | Iterates over the files and subdirectories in the current directory |
| `if` | method | `isFix` | Evaluates whether to run the fix script or just report errors |

## Internal Logic
The main execution flow is as follows:

- The script reads command-line arguments to determine which action to take (`--json` for compact output, `--fix` to fix broken links).
- It uses the `validateAllLinks` function to scan all documentation files in the repository and reports the validation results.
- If `--fix` is specified, it runs the `fixDir` function on each directory containing Markdown files, fixing broken links automatically.
- The script then outputs the results of the link validation and fix operation (if applicable) using JSON or plain text.

Key functions include:

- `validateAllLinks`: Validates all internal Markdown links in a repository.
- `fixDir`: Fixes broken links in the specified directory.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/onboarding/doc-links` | Yes | Provides the `validateAllLinks` function for link validation. |
| `fs` | No | Used to read and write files, but it's not a dependency because its functions are not used directly in this script. |

## Side Effects
- console_output: The script outputs JSON or plain text to the console indicating the results of the link validation and fix operation.
- filesystem_read: The script reads the contents of Markdown files using `fs.readFileSync`.
- filesystem_write: The script writes the modified contents of Markdown files back to disk after fixing broken links using `fs.writeFileSync`.

## Dependents
No known dependents.

## Cross-References
- [doc-links.js](../lib/onboarding/doc-links.js.md)
