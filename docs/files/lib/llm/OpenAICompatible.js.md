---
source_hash: 50720369329038b3
facts_hash: fc8a19142c1b3315
generated_at: 2026-03-03T07:19:35.668Z
generator_version: 1.0.0
model: cheap
quality_score: 88
---
# File: lib/llm/OpenAICompatible.js

## Purpose
This file defines a JavaScript class named `OpenAICompatible` that extends the `BaseProvider` class, providing a compatible API for OpenAI's models, allowing users to generate text responses with specific prompts.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `OpenAICompatible` | cjs_default | Exposes the `OpenAICompatible` class, allowing external modules to import and use it. |

## Internal Logic
The main execution flow of this file is as follows:
- The constructor initializes the object with a configuration object and an optional type parameter.
- The constructor selects the model provider based on the type and populates the object's properties.
- The `getDefaultBaseUrl` method returns the default base URL for a given provider.
- The `fetchModels` static method retrieves a list of models from OpenAI's API.
- The `generate` method generates a text response using the selected model and prompt.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./BaseProvider` | Yes | Provides the base class for the `OpenAICompatible` class. |
| `http` | No | Used as a fallback for HTTPS requests in the `fetchModels` method. |
| `https` | No | Used as a fallback for HTTPS requests in the `generate` method. |

## Side Effects
- console_output: The constructor logs a warning message to the console if no base URL is configured, indicating that it will return a mock response.

## Dependents
No known dependents.

## Cross-References
- [BaseProvider.js](./BaseProvider.js.md)
