---
source_hash: d4e4ba4641450050
facts_hash: 4885cc204dc09232
generated_at: 2026-03-03T07:54:40.700Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/verify-path-traversal.js

## Purpose
This file contains a test case for the CoreAgent class, specifically its path traversal prevention functionality. It verifies that the agent correctly denies access to files outside its scope when reading absolute paths and relative paths with traversals. The test creates a temporary directory, writes a sensitive file outside it, and then attempts to read the file using both an absolute path and a relative path with traversal.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `test` | function |  | Runs test cases for Node.js testing framework. |
| `assert` | function |  | Verifies conditions in assertions and throws an error if they fail. |
| `fs` | module |  | Provides file system-related functionality, such as creating directories and writing files. |
| `path` | module |  | Provides path manipulation utilities, including resolving relative paths. |
| `os` | module |  | Provides information about the operating system, such as the tmpdir() function. |
| `CoreAgent` | class | obj, scope | Creates a new CoreAgent instance with the given name and scope. |

## Internal Logic
The main execution flow of this file is as follows:

1. The test case creates a temporary directory for the agent's scope using fs.mkdtempSync().
2. It writes a sensitive file outside the temporary directory.
3. It creates an instance of the CoreAgent class with a limited scope, passing the temporary directory as its scope.
4. It attempts to read the sensitive file using both an absolute path and a relative path with traversal.
5. If either attempt succeeds, it fails the test case.
6. If neither attempt succeeds (i.e., Access denied is returned), it passes the test case.
7. The test case cleans up by removing the temporary directory and deleting the sensitive file.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `node:test` | No | Provides a testing framework for Node.js applications. |
| `node:assert` | No | Verifies conditions in assertions and throws an error if they fail. |
| `../lib/CoreAgent` | Yes | Provides the CoreAgent class implementation with path traversal prevention functionality. |
| `fs` | No | Provides file system-related functionality, such as creating directories and writing files. |
| `os` | No | Provides information about the operating system, such as the tmpdir() function. |
| `path` | No | Provides path manipulation utilities, including resolving relative paths. |

## Side Effects
- filesystem_write: The test case writes a sensitive file outside the temporary directory using fs.writeFileSync().

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
