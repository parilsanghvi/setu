---
source_hash: 42dd63161caae646
facts_hash: 159bb0acb5fc9e00
generated_at: 2026-03-04T05:45:00.940Z
generator_version: 1.0.0
model: cheap
quality_score: 92
---
# File: lib/onboarding/status.js

## Purpose
This file contains functions for evaluating the quality of documentation within a repository, specifically focusing on detecting populated doc files and calculating coverage.

## Exports / API Surface

| Export | Type | Description |
|--------|------|-------------|
| `isDocPopulated` | function | Checks if a doc file has real content (not just a placeholder template). |
| `scoreDocQuality` | function | Scores a doc file's quality on multiple dimensions, including structure, factuality, specificity, and cross-references. |
| `getRepoQuality` | function | Computes repo-wide documentation quality report, including aggregate scores, missing documents, and low-quality files. |
| `calculateCoverage` | function | Scans the repository for documentation coverage, identifying missing docs and folders with summaries. |
| `IGNORE_DIRS` | array | Array of directories to ignore during documentation evaluation. |
| `MIN_MEANINGFUL_LENGTH` | number | Minimum meaningful content length threshold for doc file population detection. |
| `PLACEHOLDER_MARKERS` | array | Array of placeholder markers used in doc file templates. |
| `TARGET_EXTS` | array | Array of file extensions targeted by the documentation evaluation system. |

## Internal Logic
The main execution flow involves scanning the repository for doc files, evaluating their quality using `scoreDocQuality`, and calculating coverage using `calculateCoverage`. Key functions include `getRepoQuality`, which aggregates scores from individual files and folders, and `calculateCoverage`, which identifies missing docs and folders with summaries.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system access. |
| `path` | No | Provides path manipulation utilities. |
| `child_process` | No | Allows execution of subprocesses (e.g., for git commands). |

## Side Effects

- env_access: The function accesses environment variables, specifically for determining the repository root.
- filesystem_read: The functions read files from the file system to access doc file content and repository metadata.
- network: None, as all operations are local file system interactions.
- subprocess: The `child_process` module is used to execute git commands (e.g., for HEAD resolution), but no external networks are accessed.

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
