---
source_hash: 0fc04e4d6daa9976
facts_hash: 398b265f38b976b3
generated_at: 2026-02-25T12:11:49.582Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: lib/onboarding/paths.js

## Purpose
This file provides a utility function `getSetuPath` to construct paths within the `.setu` directory of the repository, as well as an exported constant `REPO_ROOT` that represents the root path of the repository.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `getSetuPath` | cjs_named | Returns a joined path within the `.setu` directory of the repository. |
| `REPO_ROOT` | cjs_named | Exports the root path of the repository as a constant. |

## Internal Logic
The main execution flow involves creating the `.setu` directory if it does not exist, and then returning a constructed path using `path.join`. The key function is `getSetuPath`, which takes an optional filename parameter to construct a specific path.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Enables file system operations. |
| `path` | No | Provides utilities for manipulating paths and directories. |

## Side Effects
- filesystem_read: None
- filesystem_write: Creates the `.setu` directory and its contents if they do not exist.

## Dependents
- [index.js](../../index.js.md)
- [drift.js](./drift.js.md)
- [governance-profiles.js](./governance-profiles.js.md)

## Cross-References
- [index.js](../../index.js.md)
- [drift.js](./drift.js.md)
- [governance-profiles.js](./governance-profiles.js.md)
