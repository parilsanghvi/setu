---
source_hash: f59676842487a26c
facts_hash: adb5daf5eeb07bca
generated_at: 2026-03-03T07:28:38.913Z
generator_version: 1.0.0
model: cheap
quality_score: 88
---
# File: scripts/check-doc-links.js

## Purpose
This file, `check-doc-links.js`, is a command-line utility that scans all documentation files in the repository for internal markdown links and validates their integrity. It checks if links are valid, reports broken links, and provides options to auto-fix these issues.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `validateAllLinks` | function | `repoRoot` | Validates all internal markdown links in a repository. |
| `fixDir` | function | `dir` | Fixes broken links in a directory by removing GitHub blob URLs and empty link targets. |

## Internal Logic
The main execution flow involves:
- Loading command-line arguments and determining if the "--json" or "--fix" options are used.
- Validating all internal markdown links in the repository using the `validateAllLinks` function.
- If the "--fix" option is used, fixing broken links by modifying file contents and updating a report of fixed issues.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/onboarding/doc-links` | Yes | Provides the logic for validating internal markdown links. |

## Side Effects
- console_output: The utility prints JSON-formatted data to the console in both debug mode and when fixing issues, as well as regularized output in non-debug mode.
- filesystem_read: The utility reads file contents using `fs.readFileSync` when scanning files.
- filesystem_write: The utility writes modified file contents back to disk using `fs.writeFileSync` when fixing broken links.
- process_control: The utility exits the process with a zero or one status code based on whether all links were valid.

## Dependents
No known dependents.

## Cross-References
- [doc-links.js](../lib/onboarding/doc-links.js.md)
