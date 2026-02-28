---
source_hash: 14c0268d8c72580d
facts_hash: 2409343d896f45c8
generated_at: 2026-02-25T12:15:41.804Z
generator_version: 1.0.0
model: cheap
quality_score: 78
---
# File: skills/drishti-v2/tools.js

## Purpose
This file exports a list of tools, including the `tools` object that provides two main functionalities: searching for patterns in the codebase using grep and listing all files recursively.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `search_code` | function | Executes a search query on the codebase. |
| `list_files_recursive` | function | Retrieves an enumeration of all files within a specified directory. |

## Internal Logic
The main execution flow involves iterating through each tool in the `tools` array and executing its corresponding function using the `execAsync` method.

- The `search_code` function takes a pattern and search path as input, constructs a command to search for the pattern, and executes it.
- If no matches are found, the function returns "No matches found." 
- The `list_files_recursive` function takes a directory path as input, constructs a PowerShell command to list files recursively, and executes it.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `zod` | No | Validates schema for tools exports. |
| `exec` | Yes | Provides a child process execution method. |
| `util` | Yes | Promises the exec function with async/await support. |
| `path` | Yes | Constructs file paths for search and listing commands. |

## Side Effects
- database: None
- subprocess: The code executes external commands using `execAsync`.

## Dependents
No known dependents.

## Cross-References
No cross-references.
