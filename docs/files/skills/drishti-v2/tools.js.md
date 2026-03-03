---
source_hash: 14c0268d8c72580d
facts_hash: 2d844db2507ad609
generated_at: 2026-03-03T07:30:38.409Z
generator_version: 1.0.0
model: cheap
quality_score: 78
---
# File: skills/drishti-v2/tools.js

## Purpose
This file exports a list of tools that can be used to analyze and manipulate the codebase, including `tools.search_code` which searches for a string pattern in the codebase using grep, and `tools.list_files_recursive` which recursively lists all files in a directory.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `search_code` | function | Searches for a string pattern in the codebase using grep. |
| `list_files_recursive` | function | Recursively lists all files in a directory. |

## Internal Logic
The main execution flow of this file is as follows:
- The `tools` array contains two objects, each representing a tool that can be used to analyze and manipulate the codebase.
- Each tool object has a `name`, `description`, `parameters`, and an `execute` function.
- The `execute` function takes in the required parameters specified in the `parameters` object and executes the corresponding command using the `execAsync` function from the `util` module.
- The `execAsync` function runs the provided command in a child process and returns the output as a promise.
- If any error occurs during execution, it is caught and handled by returning an error message.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `child_process` | No | Provides an interface to interact with child processes. |
| `path` | Yes | Used to construct file paths in the `search_code` tool. |

## Side Effects
- database: None
- subprocess: The `execAsync` function runs commands in child processes, which can lead to potential security risks if not handled properly.

## Dependents
No known dependents.

## Cross-References
No cross-references.
