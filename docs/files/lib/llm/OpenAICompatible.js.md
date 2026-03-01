---
source_hash: 50720369329038b3
facts_hash: fc189479159c0b78
generated_at: 2026-02-25T12:06:59.392Z
generator_version: 1.0.0
model: cheap
quality_score: 83
---
# File: lib/llm/OpenAICompatible.js

## Purpose
This file exports the OpenAICompatible class, which is a provider for interacting with OpenAI's API. The class extends BaseProvider and provides methods for fetching models and generating responses. It also handles configuration based on the 'expensive' or 'cheap' type.

| Export | Type | Description |
|--------|------|-------------|
| `BaseProvider` | cjs_default | Extends the base provider class |
| `https` | module | Provides an HTTPS client for making requests |
| `http` | module | Provides an HTTP client for making requests |

## Internal Logic
The main execution flow of this file is as follows:

- The constructor initializes the provider with a configuration object and sets the type (expensive or cheap).
- The getDefaultBaseUrl function returns the base URL for a given provider.
- The fetchModels static method fetches models from OpenAI's API based on the provided base URL and API key.
- The generate method generates a response by sending a POST request to OpenAI's API with the system prompt, user prompt, and model name.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./BaseProvider` | Yes | Provides a base class for providers |
| `https` | No | Enables HTTPS requests for secure connections |
| `http` | No | Enables HTTP requests for general-purpose use |

## Side Effects
- console_output: The class logs a warning to the console if no base URL is configured and returns a mock response.

## Dependents
No known dependents.

## Cross-References
- [BaseProvider.js](./BaseProvider.js.md)
