---
source_hash: a2d3fae994e82eb2
facts_hash: eec68829aeefad49
generated_at: 2026-03-03T07:25:25.910Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: lib/onboarding/status.js

## Purpose
This file is responsible for computing the quality of documentation within a repository, specifically by scoring the content and structure of individual doc files. The `getRepoQuality` function aggregates these scores to provide an overall quality report.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `calculateCoverage` | cjs_named | Calculates repository coverage statistics. |
| `getOnboardingStatus` | cjs_named | Returns the onboarding status of a repository. |
| `getRepoQuality` | cjs_named | Computes the quality report for a repository's documentation. |
| `IGNORE_DIRS` | cjs_named | Array of directories to ignore during doc file scanning. |
| `isDocPopulated` | cjs_named | Checks if a doc file contains real content (not just placeholder templates). |
| `MIN_MEANINGFUL_LENGTH` | cjs_named | Minimum length required for meaningful doc content. |
| `PLACEHOLDER_MARKERS` | cjs_named | Array of placeholder markers to detect in doc files. |
| `scoreDocQuality` | cjs_named | Scores a doc file's quality on multiple dimensions. |
| `TARGET_EXTS` | cjs_named | Array of target file extensions for doc scanning. |

## Internal Logic
The main execution flow involves:
- Scanning the repository's docs directory and its subdirectories to find relevant doc files.
- For each doc file, checking if it is populated with real content using `isDocPopulated`.
- If populated, scoring its quality using `scoreDocQuality`.
- Aggregating these scores to provide an overall quality report for the repository.

Key functions include:
- `calculateCoverage`: computes repository coverage statistics.
- `getRepoQuality`: aggregates doc file scores to provide an overall quality report.
- `isDocPopulated`: checks if a doc file contains real content (not just placeholder templates).
- `scoreDocQuality`: scores a doc file's quality on multiple dimensions.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `child_process` | No | Provides the execSync function for running Git commands. |
| `fs` | No | Provides functions for interacting with the file system, such as fs.readFileSync and fs.existsSync. |
| `path` | No | Provides utilities for working with file paths, such as path.join and path.relative. |

## Side Effects
- env_access: None.
- filesystem_read: The script reads files from the repository's docs directory and its subdirectories.
- network: The script runs Git commands to retrieve repository information and compute coverage statistics.
- subprocess: The script uses the child_process module to run external Git commands for computing coverage.

## Dependents
- [index.js](../../index.js.md)
- [doc-enricher.js](./doc-enricher.js.md)
- [doc-facts.js](./doc-facts.js.md)
- [drift.js](./drift.js.md)
- [generator.js](./generator.js.md)

## Cross-References
- [index.js](../../index.js.md)
- [doc-enricher.js](./doc-enricher.js.md)
- [doc-facts.js](./doc-facts.js.md)
- [drift.js](./drift.js.md)
- [generator.js](./generator.js.md)
