---
source_hash: 50720369329038b3
facts_hash: 95feb6105f6a173f
generated_at: 2026-03-04T05:39:25.055Z
generator_version: 1.0.0
model: cheap
quality_score: 88
---
# File: lib/llm/OpenAICompatible.js

## Purpose
This file defines the OpenAICompatible class, which provides a customizable interface to OpenAI's API for generating responses. The class uses different base URLs and API keys depending on the chosen model type ('expensive' or 'cheap'). It also includes methods for fetching available models and generating responses based on user prompts.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `fetchModels` | function | Fetches available models from OpenAI's API. |
| `generate` | function | Generates a response to a user prompt using OpenAI's API. |

## Internal Logic
The main execution flow of the class is as follows:

* The constructor initializes the class properties with the provided configuration and selects the base URL and API key based on the chosen model type.
* The `getDefaultBaseUrl` method returns the default base URL for a given provider.
* The `fetchModels` static method fetches available models from OpenAI's API, returning an array of model IDs.
* The `generate` method generates a response to a user prompt using OpenAI's API, returning the generated response.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./BaseProvider` | Yes | Provides the base class for this implementation. |
| `http` | No | Used as a fallback library for making HTTP requests. |
| `https` | No | Used as a fallback library for making HTTPS requests. |

## Side Effects
- console_output: The class logs a warning message to the console if no base URL is configured, prompting the user to provide one or return a mock response.

## Dependents
No known dependents.

## Cross-References
- [BaseProvider.js](./BaseProvider.js.md)
