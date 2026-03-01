---
source_hash: 9e7b6a214d0ded26
facts_hash: 7865918d43709eac
generated_at: 2026-02-25T12:12:16.085Z
generator_version: 1.0.0
model: cheap
quality_score: 88
---
# File: lib/onboarding/status.js

## Purpose
This file provides functions for checking the quality of documentation in a repository, including detecting populated doc files, scoring doc quality, and computing repo-wide documentation quality reports.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `isDocPopulated` | function | Returns true if a doc file has real content. |
| `scoreDocQuality` | function | Scores a doc file's quality on multiple dimensions. |
| `getRepoQuality` | function | Computes repo-wide documentation quality report. |
| `IGNORE_DIRS` | array | Array of directories to ignore when scanning for docs. |
| `MIN_MEANINGFUL_LENGTH` | number | Minimum meaningful content length threshold. |
| `PLACEHOLDER_MARKERS` | array | Array of placeholder markers to detect in doc files. |
| `TARGET_EXTS` | array | Array of file extensions to consider when scanning for docs. |

## Internal Logic
The main execution flow involves calling the `getRepoQuality` function, which scans the repository's docs directory and uses the `scoreDocQuality` function to score each individual doc file. The scores are then aggregated to compute the repo-wide documentation quality report.

Key functions include:
- `isDocPopulated`: checks if a doc file has real content
- `scoreDocQuality`: scores a doc file's quality on multiple dimensions
- `getRepoQuality`: computes repo-wide documentation quality report

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system utilities. |
| `path` | No | Provides path manipulation utilities. |
| `child_process` | No | Provides subprocess execution utilities. |

## Side Effects
- filesystem_read: The file system is read when checking if a doc file exists and reading its content.
- subprocess: The child process `git rev-parse HEAD` is executed to retrieve the current Git commit hash, which is used to verify the completeness of the repository's onboarding status.

## Dependents
- [index.js](../../index.js.md)
- [drift.js](./drift.js.md)
- [generator.js](./generator.js.md)

## Cross-References
- [index.js](../../index.js.md)
- [drift.js](./drift.js.md)
- [generator.js](./generator.js.md)
