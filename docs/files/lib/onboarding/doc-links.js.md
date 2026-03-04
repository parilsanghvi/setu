---
source_hash: 709285d70afc3c12
facts_hash: 3a5b1bf4f0314ce3
generated_at: 2026-03-04T05:43:18.578Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: lib/onboarding/doc-links.js

## Purpose
The doc-links.js file is a JavaScript module that provides functions for resolving canonical links to documentation files and generating relative links between them.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `fileDocPath` | cjs_named | Resolves the canonical path of a source file to a doc file. |
| `folderDocPath` | cjs_named | Resolves the canonical path of a folder summary to a doc folder. |
| `relativeLink` | cjs_named | Generates a relative link from one doc file to another. |
| `fileLink` | cjs_named | Generates a markdown link to a file doc from the current doc location. |
| `folderLink` | cjs_named | Generates a markdown link to a folder summary from the current doc location. |
| `docExists` | cjs_named | Checks if a doc target exists on disk. |
| `safeLinkToFile` | cjs_named | Generates a markdown link to a file doc only if the target doc exists. |
| `safeLinkToFolder` | cjs_named | Generates a markdown link to a folder summary only if the target folder exists. |
| `validateAllLinks` | cjs_named | Validates all internal links in a doc file across the entire docs/ directory. |
| `validateDocLinks` | cjs_named | Validates the internal links in a single doc file. |

## Internal Logic
The main execution flow involves calling various functions to resolve canonical paths, generate relative links, and validate links.

Key functions include:
- `fileDocPath`: Resolves the canonical path of a source file.
- `folderDocPath`: Resolves the canonical path of a folder summary.
- `relativeLink`: Generates a relative link from one doc file to another.
- `extractLinks`: Extracts markdown links from content.
- `validateDocLinks`: Validates the internal links in a single doc file.
- `validateAllLinks`: Validates all internal links in a doc file across the entire docs/ directory.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides functions for interacting with the filesystem. |
| `path` | No | Provides functions for manipulating paths and file names. |

## Side Effects
- filesystem_read: The module reads files from disk to validate link existence.
- subprocess: None

## Dependents
- [doc-enricher.js](./doc-enricher.js.md)

## Cross-References
- [doc-enricher.js](./doc-enricher.js.md)
