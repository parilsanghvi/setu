---
source_hash: 709285d70afc3c12
facts_hash: 0647a72e77809e1a
generated_at: 2026-03-03T07:23:41.374Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: lib/onboarding/doc-links.js

## Purpose
This file, `doc-links.js`, is a utility module that provides functions for resolving canonical doc paths and generating relative links between doc files in the Setu documentation system.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `fileDocPath` | function | Returns the canonical doc path for a source file. |
| `folderDocPath` | function | Returns the canonical doc path for a folder summary. |
| `relativeLink` | function | Generates a correct relative link from one doc file to another. |
| `fileLink` | function | Generates a markdown link to a file doc from the current doc location. |
| `folderLink` | function | Generates a markdown link to a folder summary from the current doc location. |
| `docExists` | function | Checks if a doc target exists on disk. |
| `safeLinkToFile` | function | Generates a link only if the target doc exists, otherwise emits plain text. |
| `safeLinkToFolder` | function | Safe link to a folder summary. |
| `extractLinks` | function | Extracts all markdown links from content. |
| `validateDocLinks` | function | Validates all internal links in a doc file. |
| `validateAllLinks` | function | Validates all doc links across the entire docs/ directory. |

## Internal Logic
The main execution flow of this module involves:

1. Resolving canonical doc paths using `fileDocPath` and `folderDocPath`.
2. Generating relative links between doc files using `relativeLink`.
3. Creating markdown links to file and folder docs using `fileLink` and `folderLink`.
4. Validating internal links in a doc file using `validateDocLinks`, which checks if the target exists on disk.
5. Extracting all markdown links from content using `extractLinks`.

Key functions include:

* `validateDocLinks`: validates internal links by checking existence on disk.
* `safeLinkToFile` and `safeLinkToFolder`: generate links only if the target doc exists.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides filesystem functionality. |
| `path` | No | Provides path manipulation functionality. |

## Side Effects
-filesystem_read: The module reads files on disk to check existence and validate links.
- database: There are no database operations in this module.

## Dependents
- [doc-enricher.js](./doc-enricher.js.md)

## Cross-References
- [doc-enricher.js](./doc-enricher.js.md)
