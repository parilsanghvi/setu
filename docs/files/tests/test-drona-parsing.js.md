---
source_hash: f9a89e108f5c173e
facts_hash: 25d491413ca8da76
generated_at: 2026-03-04T06:00:55.818Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: tests/test-drona-parsing.js

## Purpose
This file tests the robustness of the `Drona.parseResponse` method by parsing different types of responses, including raw JSON, Markdown blocks, and noisy text with braces.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `require` | function | `id` | Mocks native/external dependencies. |
| `Guru` | class | `` | Represents a Guru agent, but is not exported directly. |
| `drona` | object | `` | An instance of the Guru class, used for testing. |

## Internal Logic
The main execution flow involves mocking native/external dependencies using the `require` function. The `Guru` class is instantiated and its `parseResponse` method is tested with different types of responses. The key functions are:
- `require`: Mocks native/external dependencies, returning a mock implementation or the original module.
- `Guru.constructor`: Initializes the Guru agent instance with a name and identifier.
- `drona.parseResponse`: Parses a response and returns an object containing the parsed data.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `module` | No | Provides the `require` function for mocking dependencies. |
| `../agents/Guru` | Yes | Implements the Guru agent class, which is tested in this file. |

## Side Effects
- console_output: The test outputs the results of each parsed response to the console, indicating whether the parsing was successful or not.
- database: None, as no actual database operations are performed during the testing process.

## Dependents
No known dependents.

## Cross-References
- [Guru.js](../agents/Guru.js.md)
