---
source_hash: 59c7c3dc1196e4bf
facts_hash: a407acc0c13c0356
generated_at: 2026-02-25T12:25:50.717Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-llm-anthropic.js

## Purpose
This file contains unit tests for the Anthropic class, specifically testing its functionality in different scenarios such as happy path, API error handling, network error handling, missing API key handling, and VETO/RISKY logic.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `resetMocks` | function | `` | Resets mock state for each test. |

## Internal Logic
The main execution flow involves setting up the mock dependencies, creating an instance of the Anthropic class, and calling its methods to simulate different scenarios. Key functions include:
- The `require` method in Module.prototype, which overrides the original require function to mock HTTPS responses.
- The `Anthropic` constructor, which initializes the provider with the provided options.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `assert` | No | Provides assertion utilities. |
| `module` | No | Provides module-related functionality. |

## Side Effects
- console_output: The file logs test results to the console, displaying pass or fail messages with emojis.
- process_control: The file restores the original require function after each test using Module.prototype.require = originalRequire;

## Dependents
No known dependents.

## Cross-References
- [Anthropic.js](../lib/llm/Anthropic.js.md)
