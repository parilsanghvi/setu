---
source_hash: aaa2af2aa6efb640
facts_hash: 2115c2fe31a902ba
generated_at: 2026-02-25T12:11:31.584Z
generator_version: 1.0.0
model: cheap
quality_score: 88
---
# File: lib/onboarding/generator.js

## Purpose
This file contains the main onboarding generator logic, responsible for creating essential documentation and configuration files for a project's repository.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `runGenerator` | cjs_named | Starts the onboarding generation process, which generates core templates, scans repo mapping, and updates the onboarding manifest. |

## Internal Logic
The main execution flow involves three steps:
- The `generateTemplates` function creates and updates essential documentation files such as index, tree, dependencies, runbook, current-state, and folder summaries.
- The `scanAndGenerateFiles` function recursively scans the repository for new or missing files and generates corresponding documentation files.
- The `writeOnboardingJson` function computes the onboarding status, calculates completeness percentages, and updates the ONBOARDING.json manifest file.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./status` | Yes | Provides essential utility functions for getting onboarding status. |
| `child_process` | No | Used to execute Git commands for retrieving repository head. |

## Side Effects
- console_output: Logs messages and progress updates during the generation process.
- filesystem_read: Reads existing files to determine what needs to be generated or updated.
- filesystem_write: Writes new files, updates existing ones, and creates directories as necessary.
- subprocess: Executes external commands such as Git for retrieving repository head.

## Dependents
No known dependents.

## Cross-References
- [status.js](./status.js.md)
