---
source_hash: f9a89e108f5c173e
facts_hash: 70eda89ad0edb302
generated_at: 2026-03-03T07:40:37.091Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: tests/test-drona-parsing.js

## Purpose
This file tests the robustness of Drona's `parseResponse` method by parsing a series of mock responses and verifying their contents.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `drona.parseResponse` | function | `resp` | Parses a response from the agent |
| `Guru` | class | `` | Manages agent interactions |

## Internal Logic
The main execution flow involves mocking native dependencies and then testing Drona's parsing functionality. The key functions are:
- `Module.prototype.require`: A mock implementation that returns specific values for certain dependencies.
- `drona.parseResponse`: Tests the robustness of parsing responses from the agent.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `module` | No | Provides the `Module` class for mocking native dependencies |
| `../agents/Guru` | Yes | Brings in the Guru agent class for testing |

## Side Effects
- console_output: The file logs passing and failing test cases to the console using console.error and console.log statements.
- database: The mock implementation returns a simulated database object with certain methods, such as pragma, exec, and prepare, to support the parsing tests.

## Dependents
No known dependents.

## Cross-References
- [Guru.js](../agents/Guru.js.md)
