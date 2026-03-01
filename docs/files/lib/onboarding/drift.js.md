---
source_hash: 30cc9c8147858bb2
facts_hash: 454783f2c8b6275f
generated_at: 2026-02-25T12:11:13.909Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: lib/onboarding/drift.js

## Purpose
This file, drift.js, is a critical component of the onboarding process in a GitHub repository, responsible for analyzing changes to the codebase and determining which files require attention. It utilizes various data sources, including the ONBOARDING.json file, to identify changed files and detect potential issues with dependencies or documentation. By executing the computeDrift function, drift.js generates a comprehensive report detailing the status of the repository.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `getBaseRefUsed` | cjs_named | Returns the base reference used for drifting based on configuration and environment variables. |
| `getIgnoreConfig` | cjs_named | Retrieves the ignore configuration from a JSON file or returns a default configuration. |
| `globToRegex` | function | Converts standard ignores to regex patterns. |
| `isTargetFile` | function | Determines whether a file is a target for drifting based on its path, extensions, and glob patterns. |
| `getOwnershipMap` | function | Creates an ownership map by parsing codeowners files or the ONBOARDING.json file. |
| `computeDrift` | cjs_named | Analyzes changes to the repository, determines required documentation, and generates a drift report. |

## Internal Logic
The main execution flow of this file is as follows:

1.  The computeDrift function initializes by calling getBaseRefUsed to determine the base reference used for drifting.
2.  It then calls resolveChangedFiles to retrieve the list of changed files based on the base reference and repository root.
3.  After that, it calls getOwnershipMap to create an ownership map by parsing codeowners files or the ONBOARDING.json file.
4.  Next, it uses the ownership map to identify ownership sources, required documentation, and potential issues with dependencies or documentation.
5.  Finally, it generates a comprehensive report detailing the status of the repository using the information gathered from previous steps.

Key functions in this file include:

*   `getBaseRefUsed`: Determines the base reference used for drifting based on configuration and environment variables.
*   `getIgnoreConfig`: Retrieves the ignore configuration from a JSON file or returns a default configuration.
*   `globToRegex`: Converts standard ignores to regex patterns.
*   `isTargetFile`: Determines whether a file is a target for drifting based on its path, extensions, and glob patterns.
*   `getOwnershipMap`: Creates an ownership map by parsing codeowners files or the ONBOARDING.json file.
*   `computeDrift`: Analyzes changes to the repository, determines required documentation, and generates a drift report.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./changed-files` | Yes | Provides functionality for resolving changed files. |
| `./codeowners` | Yes | Supplies codeowners parsing logic. |
| `./governance-profiles` | Yes | Offers governance profile management capabilities. |
| `./paths` | Yes | Specifies repository paths and directories. |
| `./status` | Yes | Handles status-related functionality, including ignore configuration. |

## Side Effects
-   env_access: This file accesses environment variables such as SETU_DRIFT_BASE to determine the base reference used for drifting.
-   filesystem_read: It reads files from the file system, including ONBOARDING.json and drift-ignore.json, to gather necessary information for drifting analysis.
-   filesystem_write: The file writes drift reports to JSON files, such as drift-history.jsonl, for telemetry logging purposes.
-   network: This file does not directly interact with external networks; however, it uses the child_process module to execute subprocesses, like running commands in a terminal, implicitly through system calls or environment variables.

## Dependents
No known dependents.

## Cross-References
- [changed-files.js](./changed-files.js.md)
- [codeowners.js](./codeowners.js.md)
- [governance-profiles.js](./governance-profiles.js.md)
- [paths.js](./paths.js.md)
- [status.js](./status.js.md)
