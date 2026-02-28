---
source_hash: cd1a98b94585a47c
facts_hash: 74c6abb336a60d9c
generated_at: 2026-02-25T12:08:53.049Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: lib/onboarding/changed-files.js

## Purpose
This file contains a single function, `resolveChangedFiles`, which is used to resolve changed files in a Git repository by checking the GitHub API and local Git diff results.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `resolveChangedFiles` | cjs_named | Resolves changed files in a Git repository using the GitHub API and local Git diff results. |

## Internal Logic
The main execution flow of this file involves the following key functions:
- The `getGitHubApiChanges` function checks if the current event is a GitHub Actions PR run, parses the commit data from the event payload or reads from a predefined file, and returns an object with file names and their source.
- The `resolveChangedFiles` function tries to resolve changed files by first using the `getGitHubApiChanges` function, then falling back to local Git diff results if the GitHub API call fails. If both methods fail, it returns an empty array of files.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | Yes | Provides file system access utilities |
| `child_process` | No | Allows for subprocess creation and execution |

## Side Effects
- env_access: This function accesses environment variables, such as `GITHUB_TOKEN`, to authenticate with the GitHub API.
- filesystem_read: The function reads files from disk using the `fs.readFileSync` method.
- network: The function makes a HTTPS request to the GitHub API using `execSync`.
- subprocess: The function creates subprocesses by executing shell commands using `execSync`.

## Dependents
- [drift.js](./drift.js.md)

## Cross-References
- [drift.js](./drift.js.md)
