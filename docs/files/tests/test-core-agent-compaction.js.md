---
source_hash: 17e043f39009c55d
facts_hash: d391b023cd45313f
generated_at: 2026-03-03T07:36:54.799Z
generator_version: 1.0.0
model: cheap
quality_score: 79
---
# File: tests/test-core-agent-compaction.js

## Purpose
This file contains tests for the `CoreAgent` class, specifically its `compactContext` method, to ensure it handles different scenarios correctly, including compaction of context when token count exceeds a threshold.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `require` | function | `id` | Requires and returns modules or dependencies. |
| `Module.prototype.require` | method | `id` | Mocks and overrides the original require function to test CoreAgent. |
| `CoreAgent` | class | `` | 
| `TestAgent` | class | `` |

## Internal Logic
The main execution flow of this file is as follows:
- The `runTest` function is called, which contains five test cases.
- Each test case creates an instance of the `TestAgent` class and tests a specific scenario of compaction.
- The scenarios include: no compaction (tokens below threshold), compaction triggered, compaction error handling, LLM error without message property, and LLM returns null/empty.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/CoreAgent` | Yes | Implements the CoreAgent class to be tested. |
| `module` | No | Provides built-in functionality for requiring modules. |
| `path` | No | Provides path manipulation utilities. |

## Side Effects
- console_output: The test file logs console messages indicating whether tests passed or failed.
- database: There are no database interactions in this test file.
- process_control: The test file uses the `process.exit` function to control the exit status of the process based on the number of failed tests.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
