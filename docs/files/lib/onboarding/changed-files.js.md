---
source_hash: cd1a98b94585a47c
facts_hash: 80377f4eb2ef4dbd
generated_at: 2026-03-04T05:41:32.686Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: lib/onboarding/changed-files.js

## Purpose
This file exports a single function `resolveChangedFiles`, which resolves changed files in a Git repository by either using the GitHub API or standard local git diff commands.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `resolveChangedFiles` | cjs_named | Resolves changed files in a Git repository. |

## Internal Logic
The main execution flow of this file is as follows:

- The `getGitHubApiChanges` function checks if it's in a GitHub Actions PR run and tries to fetch changes from the GitHub API using a token.
- If the GitHub API call fails, the `resolveChangedFiles` function falls back to using standard local git diff commands.
- It first tries `git diff --name-only ${baseRef}...HEAD`, then uses a fallback reference if that fails.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | Yes | Provides file I/O utilities |
| `child_process` | No | Enables subprocess execution |

## Side Effects
- env_access: The file accesses environment variables such as `GITHUB_REPOSITORY`, `GITHUB_TOKEN`, and `GITHUB_EVENT_PATH`.
- filesystem_read: The file reads files from the repository root directory using `fs.readFileSync` or `execSync`.
- network: The file makes a network request to the GitHub API using `curl` in the `getGitHubApiChanges` function.
- subprocess: The file runs subprocesses using `execSync` for git diff commands.

## Dependents
- [drift.js](./drift.js.md)

## Cross-References
- [drift.js](./drift.js.md)
