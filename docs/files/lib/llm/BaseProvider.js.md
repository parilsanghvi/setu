---
source_hash: cb5c7ec036775d51
facts_hash: 0b4d063e03520853
generated_at: 2026-02-25T12:06:25.648Z
generator_version: 1.0.0
model: cheap
quality_score: 95
---
# File: lib/llm/BaseProvider.js

## Purpose
The BaseProvider class is responsible for providing a basic structure for language models to generate responses, including handling specific prompts and returning mock responses for testing purposes. It serves as a foundation for other provider classes to extend from. The class includes methods for generating completions and retrieving mock responses.

| Export | Type | Description |
|--------|------|-------------|
| `generate` | async function | Generates a completion based on the provided system prompt and user prompt. |
| `getMockResponse` | function | Returns a mock response to the user prompt, including specific keywords that trigger veto or risk messages. |

## Internal Logic
The constructor initializes the BaseProvider instance with a given configuration object. The generate method is intended to be implemented by subclasses, while getMockResponse returns a mock response based on the presence of specific keywords in the user prompt.

## Dependencies
| Export | Type | Why |
|--------|------|-----|
| `module.exports` | cjs_default | Exports the BaseProvider class as the default export. |
| `config` | property | Holds the configuration object passed to the constructor. |

## Side Effects

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
