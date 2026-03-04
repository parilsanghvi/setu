---
source_hash: 2b186118434eeab7
facts_hash: c4ee2999fc2606dc
generated_at: 2026-03-04T05:44:11.917Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: lib/onboarding/generator.js

## Purpose
This file is responsible for generating the onboarding documentation for a repository, including core templates, file and folder summaries, and updating the ONBOARDING.json manifest with calculated completeness status.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `runGenerator` | cjs_named | Runs the onboarding generation process. |

## Internal Logic
The main execution flow of this file is as follows:
- The `runGenerator` function is called, which takes an options object with two properties: `dryRun` and `onlyMissing`.
- The `generateTemplates` function generates the core templates for the documentation.
- The `scanAndGenerateFiles` function scans the repository for files and folders and generates summaries and documentation for them.
- The `writeOnboardingJson` function updates the ONBOARDING.json manifest with calculated completeness status.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./status` | Yes | Provides essential onboarding-related functions. |
| `child_process` | No | Used for executing external commands to calculate repository status. |

## Side Effects
- console_output: Logs messages to the console, including success messages and warnings.
- filesystem_read: Reads files from the file system to determine their existence and contents.
- filesystem_write: Writes new files to the file system during template generation and documentation creation.
- subprocess: Executes external commands using `child_process` to calculate repository status and update the ONBOARDING.json manifest.

## Dependents
No known dependents.

## Cross-References
- [status.js](./status.js.md)
