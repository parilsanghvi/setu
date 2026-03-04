---
source_hash: 14c0268d8c72580d
facts_hash: eb8f32a03f2cd0e9
generated_at: 2026-03-04T05:49:55.504Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: skills/drishti-v2/tools.js

## Purpose
This file exports a list of tools, which are functions that perform specific tasks, such as searching for patterns in the codebase and listing files recursively.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `search_code` | function | Searches for a string pattern in the codebase using grep. |
| `list_files_recursive` | function | Recursively lists all files in a directory. |

## Internal Logic
The main execution flow involves iterating over each tool and calling its corresponding function when invoked. The key functions are:
- `search_code`: executes a search operation, where it takes a pattern and a directory path as input, uses the `findstr` command to search for the pattern in the files of the specified directory, and returns the results.
- `list_files_recursive`: executes a recursive file listing operation, where it takes a directory path as input, uses the `dir` command to list all files in the directory and its subdirectories, and returns the results.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `zod` | Yes | Provides schema validation for tool parameters. |
| `child_process` | No | Enables execution of external commands, such as grep and dir. |
| `path` | No | Helps with file path manipulation, especially when joining directory paths with file names. |
| `util` | No | Provides a promisified version of the exec function for executing child processes asynchronously. |

## Side Effects
- database: None
- subprocess: The tools may spawn new subprocesses to execute external commands like grep and dir, but they do not establish persistent connections or interact with databases.

## Dependents
No known dependents.

## Cross-References
No cross-references.
