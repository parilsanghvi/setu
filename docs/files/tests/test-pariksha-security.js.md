---
source_hash: bfc84c2444c90865
facts_hash: bd1f872ee219e901
generated_at: 2026-03-03T07:45:06.055Z
generator_version: 1.0.0
model: cheap
quality_score: 77
---
# File: tests/test-pariksha-security.js

## Purpose
This file contains tests for the Pariksha class, specifically its security features, including preventing shell injection and correctly parsing arguments with quotes.

## Exports / API Surface
| Export | Description |
|--------|-------------|
| `Pariksha` | Exposes the Pariksha class, which provides methods for running tests. |
| `runTest` | Exposes a method that runs a test command in a temporary directory. |

## Internal Logic
The main execution flow of this file involves creating instances of the Pariksha class and testing its security features.

Key functions:
- `describe`: A function from the node:test module used to define test suites.
- `it`: A function from the node:test module used to define individual tests within a suite.
- `new Pariksha()`: The constructor for the Pariksha class, which initializes a new instance of the class.
- `runTest`: A method on the Pariksha class that executes a test command in a temporary directory.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Pariksha` | Yes | Implements security testing functionality. |

## Side Effects
- console_output: The file logs output from tests to the console, including success or failure messages.
- filesystem_read: The file reads files into memory during tests, checking for creation of sentinel files.
- filesystem_write: The file writes files to disk during tests, creating temporary directories and files as needed.

## Dependents
No known dependents.

## Cross-References
- [Pariksha.js](../lib/Pariksha.js.md)
