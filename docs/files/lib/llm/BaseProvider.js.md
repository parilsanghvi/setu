---
source_hash: cb5c7ec036775d51
facts_hash: c02093241c4cf42a
generated_at: 2026-03-04T05:38:49.348Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: lib/llm/BaseProvider.js

## Purpose
The BaseProvider class is a core component that generates responses for various prompts, enabling the system to provide completion and mock data for testing purposes. It provides two primary methods: `generate` and `getMockResponse`, which handle different types of user input. The `BaseProvider` class serves as a base class for other provider classes in the system.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `BaseProvider` | cjs_default | Exports the BaseProvider class, enabling it to be used by other parts of the system. |

## Internal Logic
The main execution flow involves two key methods: `constructor` and `getMockResponse`. The constructor initializes the provider with a given configuration object. The `generate` method is currently unimplemented, throwing an error when called. In contrast, the `getMockResponse` method uses various user prompts to determine which response to return, including mock veto responses for specific architectural or UI-related prompts and a generic mock skill response.

## Dependencies
No imports detected.

## Side Effects
None detected.

## Dependents
- [Anthropic.js](./Anthropic.js.md)
- [Ollama.js](./Ollama.js.md)
- [OpenAI.js](./OpenAI.js.md)
- [OpenAICompatible.js](./OpenAICompatible.js.md)

## Cross-References
- [Anthropic.js](./Anthropic.js.md)
- [Ollama.js](./Ollama.js.md)
- [OpenAI.js](./OpenAI.js.md)
- [OpenAICompatible.js](./OpenAICompatible.js.md)
