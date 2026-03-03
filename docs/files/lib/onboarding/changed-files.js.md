---
source_hash: cd1a98b94585a47c
facts_hash: 8b8cf6c455e74f91
generated_at: 2026-03-03T07:21:49.914Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: lib/onboarding/changed-files.js

## Purpose
This file provides a single function, `resolveChangedFiles`, which is used to resolve changed files between different Git references in an onboarding system. It determines the source of the changes by attempting to fetch files from the GitHub API and then falls back to using standard local git diff if that fails. The function returns an object containing information about the changed files.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `resolveChangedFiles` | cjs_named | Resolves changed files between different Git references in an onboarding system |

## Internal Logic
The main execution flow of this file is as follows:
- It first checks if it's running in a GitHub Actions PR run and attempts to fetch changes from the GitHub API using the `getGitHubApiChanges` function.
- If that fails, it falls back to using standard local git diff to determine the changed files using the `resolveChangedFiles` function.
- The function uses the `execSync` function from the `child_process` module to execute shell commands and capture their output.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `getGitHubApiChanges` | Yes | Implements GitHub API call logic |
| `child_process` | No | Provides `execSync` utility for executing shell commands |
| `fs` | No |  |

## Side Effects
- env_access: The function accesses environment variables such as `GITHUB_EVENT_PATH`, `GITHUB_TOKEN`, and `GITHUB_REPOSITORY`.
- filesystem_read: The function reads files from the file system using `fs.readFileSync` and `execSync`.
- network: The function makes HTTP requests to the GitHub API, which involves network communication.
- subprocess: The function uses shell commands to execute processes such as git diff, which involve spawning new subprocesses.

## Dependents
- [drift.js](./drift.js.md)

## Cross-References
- [drift.js](./drift.js.md)
