---
source_hash: bfc84c2444c90865
facts_hash: f62497a097fee729
generated_at: 2026-03-04T06:05:28.320Z
generator_version: 1.0.0
model: cheap
quality_score: 88
---
# File: tests/test-pariksha-security.js

## Purpose
This file tests the Pariksha class for security vulnerabilities, specifically shell injection and argument parsing.

## Exports / API Surface


| Name | Description |
|------|-------------|
| `runTest` | Executes a command with test arguments in a sandboxed environment. |
| `Pariksha` | A class providing a secure way to execute commands and tests. |

## Internal Logic
The main execution flow of this file is as follows:
1. The test suite uses the `describe` and `it` functions from Node's testing module.
2. Each test creates a temporary directory using `fs.mkdtempSync`.
3. A new instance of the Pariksha class is created for each test.
4. The `runTest` function is called with a command string containing test arguments.
5. The test verifies that the expected output was generated and that no security vulnerabilities were exploited.

The key functions in this file are:
1. `fs.mkdtempSync`: Creates a temporary directory for isolating tests.
2. `Pariksha.runTest`: Executes a command with test arguments in a sandboxed environment.
3. `assert.strictEqual` and `assert.match`: Verify that the expected output was generated.

## Dependencies


| Module | Local | Why |
|--------|-------|-----|
| `../lib/Pariksha` | Yes | Provides the Pariksha class for testing. |
| `node:test` | No | Provides the testing framework functions. |
| `node:assert` | No | Provides assertion functions. |

## Side Effects
- console_output: The file logs test results to the console.
- filesystem_read: The file reads temporary directories and files from the file system.
- filesystem_write: The file writes temporary files to the file system.

## Dependents
No known dependents.

## Cross-References
- [Pariksha.js](../lib/Pariksha.js.md)
