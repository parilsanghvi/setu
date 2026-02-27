---
source_hash: 709285d70afc3c12
facts_hash: fb2cc3817ae4aca8
generated_at: 2026-02-25T12:10:38.128Z
generator_version: 1.0.0
model: cheap
quality_score: 81
---
# File: lib/onboarding/doc-links.js

## Purpose
This file provides a set of utility functions for generating canonical doc paths and relative links between docs, ensuring deterministic and correct documentation formatting.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `fileDocPath` | cjs_named | Resolves source file paths to canonical doc paths. |
| `folderDocPath` | cjs_named | Resolves folder paths to canonical doc paths for summaries. |
| `relativeLink` | cjs_named | Generates correct relative links between docs. |
| `fileLink` | cjs_named | Creates markdown links to specific files within a doc. |
| `folderLink` | cjs_named | Creates markdown links to summary pages of folders. |
| `docExists` | cjs_named | Checks if a target doc file or folder exists on disk. |
| `safeLinkToFile` | cjs_named | Generates safe markdown links to files, returning plain text if the file does not exist. |
| `safeLinkToFolder` | cjs_named | Generates safe markdown links to folder summaries, returning plain text if the summary does not exist. |
| `validateAllLinks` | cjs_named | Scans the entire docs/ directory for broken or non-existent links and returns a report on their status. |
| `validateDocLinks` | cjs_named | Validates links within a single doc file against existing files on disk, returning details of valid and invalid links. |

## Internal Logic
The main execution flow involves:
- Resolving source paths to canonical doc paths using `fileDocPath` or `folderDocPath`.
- Generating relative links between docs using `relativeLink`.
- Creating markdown links to specific files within a doc using `fileLink`, and folder summaries using `folderLink`.
- Checking if target docs exist on disk using `docExists`.
- Validating links within a single doc file against existing files on disk, returning details of valid and invalid links with `validateDocLinks`.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fileDocPath` | Yes | 
| `folderDocPath` | Yes | 
| `relativeLink` | Yes | Provides utility to generate relative paths. |
| `fs` | No | Accesses the file system for path manipulation and existence checks. |
| `path` | No | Provides utilities for working with file paths, such as resolving and manipulating them. |

## Side Effects
- database: 
- filesystem_read: The functions read files from disk to check their existence.
- subprocess: None

## Dependents
No known dependents.

## Cross-References
No cross-references.
