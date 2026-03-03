---
source_hash: 9cddbb814c78aa91
facts_hash: 98d40d658ce078ff
generated_at: 2026-03-03T07:44:21.842Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-logger.js

## Purpose
This file contains unit tests for the Logger class, ensuring that it logs messages at various levels (info, warn, debug, error) and handles object arguments and Error objects correctly.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `resetMocks` | arrow | `` | Resets the logs and errors arrays for mocking purposes. |

## Internal Logic
The test file first sets up mocks for console.log and console.error to capture log messages and errors. It then creates a new instance of the Logger class, 'TestService', and tests its methods by logging messages at different levels. The main execution flow involves testing each method individually, resetting the logs and errors arrays after each test, and finally restoring the original console.log and console.error functions.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Logger` | Yes | Provides the Logger class to be tested. |
| `assert` | No | Provides assertion utilities for testing. |

## Side Effects
- console_output:
  - The test file captures log messages and errors in an array using the mocked console.log and console.error functions.
- process_control:
  None

## Dependents
No known dependents.

## Cross-References
- [Logger.js](../lib/Logger.js.md)
