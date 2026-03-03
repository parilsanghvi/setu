---
source_hash: 0fc04e4d6daa9976
facts_hash: 701754ca06a17c13
generated_at: 2026-03-03T07:24:55.184Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: lib/onboarding/paths.js

## Purpose
This file provides a utility module for the onboarding system, exporting two functions: `getSetuPath`, which returns a set up directory path, and `REPO_ROOT`, which represents the root of the repository. It also creates the `.setu` directory if it doesn't exist.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `getSetuPath` | cjs_named | Returns a set up directory path by joining the `.setu` directory with a given filename. |
| `REPO_ROOT` | cjs_named | Represents the root of the repository, resolved as an absolute path using `path.resolve`. |

## Internal Logic
The main execution flow involves checking if the `.setu` directory exists and creating it if not. The `getSetuPath` function then joins this directory with a given filename to return the resulting set up directory path.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | Yes | Provides file system operations, such as checking existence and creating directories. |
| `path` | Yes | Provides path manipulation utilities, including resolving absolute paths. |

## Side Effects
- filesystem_read: No side effects are observed for reading from the file system.
- filesystem_write: The file system is written to when the `getSetuPath` function creates the `.setu` directory if it doesn't exist.

## Dependents
- [index.js](../../index.js.md)
- [drift.js](./drift.js.md)
- [governance-profiles.js](./governance-profiles.js.md)

## Cross-References
- [index.js](../../index.js.md)
- [drift.js](./drift.js.md)
- [governance-profiles.js](./governance-profiles.js.md)
