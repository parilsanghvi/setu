---
source_hash: f9a89e108f5c173e
facts_hash: 29553cbf7fbc08f9
generated_at: 2026-02-25T12:24:28.633Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: tests/test-drona-parsing.js

## Purpose
This file tests the robustness of the `Drona` class's `parseResponse` method by feeding it various response formats, including raw JSON and Markdown blocks, to ensure its ability to correctly parse and extract relevant information.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `drona` | function | `` | Instantiates a new instance of the Guru class. |
| `Guru` | class | `` | Defines a class for simulating expert knowledge retrieval. |

## Internal Logic
The main execution flow involves mocking external dependencies to isolate the behavior of the `Drona` class's `parseResponse` method. The key functions include:

- `require`: A mock implementation that returns specific implementations for native/external dependencies, such as `better-sqlite3`, `dotenv`, and `zod`.
- `Guru` constructor: Initializes a new instance of the Guru class with the provided name.
- `drona.parseResponse(resp)`: Extracts relevant information from a given response (e.g., slug, description, content).

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `module` | No | Enables dependency injection for require function. |
| `../agents/Guru` | Yes | Provides the Guru class implementation. |

## Side Effects
- console_output: The file logs successful or failed test cases to the console using `console.log` and `console.error`.

## Dependents
No known dependents.

## Cross-References
- [Guru.js](../agents/Guru.js.md)
