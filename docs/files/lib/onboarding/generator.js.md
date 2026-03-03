---
source_hash: 9aeba4617871f97f
facts_hash: 25421252dcb2f3ca
generated_at: 2026-03-03T07:24:32.646Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: lib/onboarding/generator.js

## Purpose
This file, `generator.js`, serves as the main onboarding generator for a repository. It is responsible for generating necessary documentation files, scanning and populating files and folders within the repository, and updating the `ONBOARDING.json` manifest to reflect the current state of the project.

## Exports / API Surface

| Export | Type | Description |
|--------|------|-------------|
| runGenerator | cjs_named | Runs the onboarding generation process with optional dry-run and onlyMissing flags. |

## Internal Logic
The main execution flow involves:
- `generateTemplates`: Generates core documentation templates by reading pre-defined template content and writing it to files within the repository.
- `scanAndGenerateFiles`: Scans the repository for existing files and folders, generating new ones if necessary, while respecting exclusion rules specified in the `TARGET_EXTS` constant.
- `writeOnboardingJson`: Updates the `ONBOARDING.json` manifest by computing completeness metrics, validating status, and writing a new version to disk.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| ./status | Yes | Provides onboarding status utility functions. |
| child_process | No | Enables execution of shell commands for git operations. |

## Side Effects
- console_output: Logs messages to the console during generation, including dry-run and progress updates.
- filesystem_read: Reads existing files and directories within the repository for scanning purposes.
- filesystem_write: Writes new generated files and folders to disk.
- subprocess: Executes `git rev-parse HEAD` command to obtain the current commit hash.

## Dependents
No known dependents.

## Cross-References
- [status.js](./status.js.md)
