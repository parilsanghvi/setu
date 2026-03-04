---
source_hash: bea05cb8173ac722
facts_hash: 1d2194f8233afd8e
generated_at: 2026-03-04T05:51:47.083Z
generator_version: 1.0.0
model: cheap
quality_score: 79
---
# File: tests/runner.js

## Purpose
This file serves as the test runner for a suite of tests in a setup project, utilizing Node.js to execute test files and track results.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `runTest` | function | `file` | Runs a single test file and returns a promise with a success flag. |

## Exports / API Surface

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|

## Internal Logic
The main execution flow of this file is as follows:

- The `runTest` function takes a file name, executes it using `child_process.spawn`, and returns a promise that resolves with a success flag.
- The test suite iterates through the list of files, skipping interactive tests, and calls `runTest` for each file.
- For each test, it logs the result to the console and updates counters for passed and failed tests.
- After all tests have been executed, it prints a summary of the results and exits the process if any tests failed.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| `child_process` | No | Provides a way to spawn new processes. |
| `fs` | No | Used for reading directory contents. |

## Side Effects
- console_output: Logs test results to the console.
- env_access: Modifies environment variables, such as setting the LOG_LEVEL and DASHBOARD_PASS, during test execution.
- filesystem_read: Reads the contents of the test directory to find eligible test files.
- process_control: Exits the process with a non-zero code if any tests fail.
- subprocess: Spawns a new Node.js process to execute each test file.

## Dependents
No known dependents.

## Cross-References
No cross-references.
