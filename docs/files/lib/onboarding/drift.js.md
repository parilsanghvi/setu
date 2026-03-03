---
source_hash: 11e52abfd4a3d317
facts_hash: 3cf2a52f61713a32
generated_at: 2026-03-03T07:24:14.354Z
generator_version: 1.0.0
model: cheap
quality_score: 98
---
# File: lib/onboarding/drift.js

## Purpose
This file, `drift.js`, is a critical component of the Drift system, responsible for analyzing code drift in a repository by detecting changes, identifying owners, and monitoring documentation updates. It utilizes various data sources, including `ONBOARDING.json` and `.github/CODEOWNERS`, to gather information about the repository's structure and content.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| getBaseRefUsed | function | Returns the base reference used for code drift analysis based on provided options or environment variables. |
| getIgnoreConfig | function | Retrieves the ignore configuration file path and returns its contents if found, otherwise provides a default configuration. |
| globToRegex | function | Converts a glob pattern to a regex string for use in ignoring files. |
| isTargetFile | function | Determines whether a given file path should be included in the drift analysis based on its extension, paths, and globs. |
| getOwnershipMap | function | Parses various data sources to determine ownership of files and modules. |
| checkPRContext | function | Analyzes the pull request context and returns information about strict diff warnings and failures. |
| filterChangedFiles | function | Filters changed files based on ignore configuration and returns source changed, ignored, and missing documents. |
| mapOwnershipAndDocs | function | Maps ownership and documentation status for each file in the drift analysis. |
| appendTelemetry | function | Appends telemetry data to the drift log file. |
| computeDrift | cjs_named | Performs a comprehensive code drift analysis by resolving changed files, checking PR context, mapping ownership, filtering ignored files, and appending telemetry data. |

## Internal Logic
The main execution flow of this file involves the following key functions:

1. `computeDrift`: This function initiates the entire code drift analysis process, starting from resolving changed files using `resolveChangedFiles`, checking the pull request context with `checkPRContext`, mapping ownership and documentation status with `mapOwnershipAndDocs`, filtering ignored files with `filterChangedFiles`, and appending telemetry data with `appendTelemetry`.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| ./changed-files | Yes | Provides a way to resolve changed files in the repository. |
| ./codeowners | Yes | Supplies code ownership rules for module owners. |
| ./governance-profiles | Yes | Offers governance profiles and configuration management. |
| ./paths | Yes | Defines constants for repository paths and directories. |
| ./status | Yes | Imports status-related utilities and functions. |
| child_process | No | Used by `execSync` to execute system commands. |
| fs | No | Used for file system operations, such as reading and writing files. |
| path | No | Used for file system operations, such as resolving paths and directories. |

## Side Effects
- env_access: The function uses environment variables for configuration settings.
- filesystem_read: This function reads files from the file system for analysis.
- filesystem_write: It writes data to files in the file system, including telemetry logs.
- network: There are no direct network interactions, but some functions may indirectly rely on external services or APIs through child process calls.
- subprocess: The `execSync` function runs system commands as a subprocess.

## Dependents
No known dependents.

## Cross-References
- [changed-files.js](./changed-files.js.md)
- [codeowners.js](./codeowners.js.md)
- [governance-profiles.js](./governance-profiles.js.md)
- [paths.js](./paths.js.md)
- [status.js](./status.js.md)
