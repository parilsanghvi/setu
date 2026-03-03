---
source_hash: 617ca610afd41bdb
facts_hash: b36a65cc7d751398
generated_at: 2026-03-03T07:37:32.265Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: tests/test-core-agent-security.js

## Purpose
This file tests the security features of the CoreAgent, specifically path traversal protection and file system access control. The runTest function verifies that the agent correctly denies access to files outside its scope when reading or writing them.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `require` | method | `id` | Returns the result of requiring a module, potentially returning mock dependencies if specified in the require function. |
| `Module.prototype.require` | function | `id` | Overrides the original require function to return mock dependencies for specific IDs. |
| `CoreAgent` | constructor | `` | Creates an instance of the CoreAgent class with the given parameters. |

## Internal Logic
The main execution flow of this file is as follows:

1. The test function runTest is called, which creates a safe scope and initializes a new instance of the CoreAgent.
2. The agent reads a file using its readFile method, verifying that it correctly denies access to files outside its scope when reading them.
3. The agent writes a file using its writeFile method, verifying that it correctly denies access to files outside its scope when writing them.

Key functions include:

* `require`: overrides the original require function to return mock dependencies for specific IDs
* `Module.prototype.require`: returns the result of requiring a module, potentially returning mock dependencies if specified in the require function
* `CoreAgent`: creates an instance of the CoreAgent class with the given parameters

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system utilities for creating and removing directories. |
| `module` | No | Provides utility functions for working with modules. |
| `path` | Yes | Provides helper functions for working with file paths, such as resolving absolute paths. |

## Side Effects
- console_output: The test function logs messages to the console using console.log and console.error, indicating success or failure of each test.
- filesystem_read: The test function creates a safe scope and initializes a new instance of the CoreAgent, which uses the fs module to read files from the file system. The test verifies that the agent correctly denies access to files outside its scope when reading them.
- filesystem_write: The test function writes a file using the CoreAgent's writeFile method, which uses the fs module to write files to the file system. The test verifies that the agent correctly denies access to files outside its scope when writing them.
- process_control: The test function exits the process with a non-zero status code if any of the tests fail, indicating failure of the security checks.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
