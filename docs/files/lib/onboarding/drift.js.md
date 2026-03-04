---
source_hash: 11e52abfd4a3d317
facts_hash: e40dd175ff283d2f
generated_at: 2026-03-04T05:43:51.392Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: lib/onboarding/drift.js

## Purpose
This file is responsible for computing the drift in a codebase, specifically determining which files have changed and identifying owners of those changes. It uses various configuration settings to determine the scope of the analysis and reports back on the results, including any missing documentation.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `getBaseRefUsed` | function | Returns the base reference used for the drift computation. |
| `getIgnoreConfig` | function | Returns an ignore configuration object. |
| `globToRegex` | function | Converts a glob pattern to a regex pattern. |
| `isTargetFile` | function | Determines whether a file is target or ignored based on the ignore configuration and file extensions. |
| `getOwnershipMap` | function | Returns an ownership map, including owners of modules and codeowners rules. |
| `checkPRContext` | function | Checks if the PR context meets certain conditions for strict diff warnings. |
| `filterChangedFiles` | function | Filters changed files based on the ignore configuration. |
| `mapOwnershipAndDocs` | function | Maps ownership to documentation status for each file. |
| `appendTelemetry` | function | Appends telemetry data to a log file. |
| `computeDrift` | cjs_named | Computes the drift in a codebase and returns the results. |

## Internal Logic
The main execution flow of this file is as follows:
- The `computeDrift` function calls `getBaseRefUsed` to determine the base reference used for the computation.
- It then calls `resolveChangedFiles` to get the list of changed files.
- The `computeDrift` function checks if the PR context meets certain conditions for strict diff warnings using `checkPRContext`.
- If all conditions are met, it calls `getOwnershipMap` to get the ownership map and `filterChangedFiles` to filter the changed files based on the ignore configuration.
- It then calls `mapOwnershipAndDocs` to map ownership to documentation status for each file.
- Finally, it calls `appendTelemetry` to append telemetry data to a log file.

Key functions include:
- `computeDrift`: The main computation function that returns the results of the drift analysis.
- `checkPRContext`: A helper function that checks if the PR context meets certain conditions for strict diff warnings.
- `getOwnershipMap`: A function that returns an ownership map, including owners of modules and codeowners rules.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./changed-files` | Yes | Provides a way to resolve changed files. |
| `./codeowners` | Yes | Provides a way to parse codeowners rules. |
| `./governance-profiles` | Yes | Provides an active governance profile. |
| `./paths` | Yes | Provides constants for repository paths. |
| `./status` | Yes | Provides constants for status and ignore configurations. |

## Side Effects
- env_access: None.
- filesystem_read: Reads various configuration files, including `drift-ignore.json`, `ONBOARDING.json`, and `governance-profiles.json`.
- filesystem_write: Writes telemetry data to a log file named `drift-history.jsonl`.

## Dependents
No known dependents.

## Cross-References
- [changed-files.js](./changed-files.js.md)
- [codeowners.js](./codeowners.js.md)
- [governance-profiles.js](./governance-profiles.js.md)
- [paths.js](./paths.js.md)
- [status.js](./status.js.md)
