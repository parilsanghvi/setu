---
source_hash: bea05cb8173ac722
facts_hash: 01a46688d6e675e3
generated_at: 2026-02-25T12:17:32.442Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: tests/runner.js

## Purpose
The runner.js file serves as the main entry point for setting up and executing tests within a test suite. It uses child_process to spawn Node.js processes for each test file, while modifying environment variables to suppress logs during testing. The file's primary function is to run all test files in the specified directory.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `runTest` | function | `file` | Runs a single test file and returns a promise indicating success or failure. |

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|

## Internal Logic
The main execution flow of the runner.js file is as follows:
1. The `runTest` function spawns a new Node.js process for each test file using child_process.
2. It sets environment variables to suppress logs during testing and inherits standard input/output from the parent process.
3. For each test file, it listens for the exit event of the spawned process and checks its return code.
4. If the return code is 0 (indicating success), it logs a passing message with the elapsed time; otherwise, it logs a failing message with the error code.

Key functions:
- `runTest`: Runs a single test file and returns a promise indicating success or failure.
- `for` method: Iterates over each test file in the specified directory.
- `if` method: Checks if the return code of the spawned process is 0, indicating success.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides synchronous access to the file system for reading directory contents. |
| `path` | No | Offers utilities for working with file paths and directories. |
| `child_process` | No | Enables spawning new processes to run Node.js, allowing for concurrent execution of test files. |

## Side Effects
- console_output: Logs messages to the console indicating test progress or failure.
- env_access: Modifies environment variables to suppress logs during testing.
- filesystem_read: Reads directory contents using fs.readdirSync() to identify test files.
- process_control: Controls the Node.js process's standard input/output and environment variables for each test file.
- subprocess: Spawns new Node.js processes to execute individual test files.

## Dependents
No known dependents.

## Cross-References
No cross-references.
