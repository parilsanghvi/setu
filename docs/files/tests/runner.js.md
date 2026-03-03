---
source_hash: bea05cb8173ac722
facts_hash: 797d04782e1a4410
generated_at: 2026-03-03T07:32:39.329Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: tests/runner.js

## Purpose
The tests/runner.js file serves as a test runner for setting up and executing tests in the system, specifically for the list-models and verify files.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `runTest` | function | `file` | Runs a single test file. |

## Internal Logic
The main execution flow involves iterating through an array of test files, spawning a new node process for each file, and checking its exit code to determine if the test passed or failed.

Key functions include:
- The `runTest` function: Spawns a new node process for the given file, waits for it to finish, and checks its exit code.
- The main loop: Iterates through an array of test files, runs each one using `runTest`, and keeps track of the number of passed and failed tests.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `child_process` | No | Provides a way to spawn and manage child processes. |
| `fs` | No | Is not explicitly used in this file, but is imported as part of the Node.js environment. |

## Side Effects
- console_output: The script logs information about each test file being run, including its name and whether it passed or failed.
- env_access: The script accesses the `LOG_LEVEL` and `DASHBOARD_PASS` environment variables to suppress logs during tests.
- filesystem_read: The script reads the contents of the directory containing the test files using `fs.readdirSync`.
- process_control: The script uses process control (e.g., `process.exit(1)`) to exit the program with a non-zero status code if there are any failed tests.
- subprocess: The script spawns a new node process for each test file using `spawn('node', [path.join(testDir, file)])`.

## Dependents
No known dependents.

## Cross-References
No cross-references.
