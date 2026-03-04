---
source_hash: 0fc04e4d6daa9976
facts_hash: 06b6460511e62ab4
generated_at: 2026-03-04T05:44:32.709Z
generator_version: 1.0.0
model: cheap
quality_score: 95
---
# File: lib/onboarding/paths.js

## Purpose
This file provides two exports: `getSetuPath` and `REPO_ROOT`, which are utility functions for managing the setu directory within the repository. The `getSetuPath` function creates the setu directory if it doesn't exist and returns a path to a specified filename, while `REPO_ROOT` is a named constant representing the root of the repository.

| Export | Type | Description |
|--------|------|-------------|
| getSetuPath | cjs_named | Returns a path to a file in the setu directory. |
| REPO_ROOT | cjs_named | A named constant representing the root of the repository. |

## Internal Logic
The main execution flow involves creating the setu directory if it doesn't exist, then returning a path to a specified filename. The `getSetuPath` function uses `path.join` and `fs.existsSync` to determine the existence of the setu directory.

| Function | Description |
|----------|-------------|
| `getSetuPath` | Checks for the existence of the setu directory and creates it if necessary, then returns a path to a specified filename. |

## Dependencies
The file imports `path` and `fs`, with the following purposes:

| Module | Local | Why |
|--------|-------|-----|
| path | No | Provides path manipulation utilities. |
| fs | No | Provides file system functions. |

## Side Effects
- filesystem_write: The `getSetuPath` function creates the setu directory using `fs.mkdirSync`, which writes to the file system.
- filesystem_read: There are no explicit reads in this file, but the use of `fs.existsSync` implies that it may read from the file system to check for the existence of a directory.

## Dependents
- [index.js](../../index.js.md)
- [drift.js](./drift.js.md)
- [governance-profiles.js](./governance-profiles.js.md)

## Cross-References
- [index.js](../../index.js.md)
- [drift.js](./drift.js.md)
- [governance-profiles.js](./governance-profiles.js.md)
