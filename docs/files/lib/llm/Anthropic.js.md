---
source_hash: f61fc8a5e9ce4172
facts_hash: 7e9b7ab0edc08fc0
generated_at: 2026-03-03T07:18:56.113Z
generator_version: 1.0.0
model: cheap
quality_score: 86
---
# File: lib/llm/Anthropic.js

## Purpose
This file exports the `Anthropic` class, which extends `BaseProvider`. It is used to interact with the Anthropic API, generating responses based on user input and a specified model. The `generate` method takes in system prompts and user prompts, sends them to the Anthropic API, and returns the response.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Anthropic` | cjs_default | 
| `getMockResponse` | function | Returns a mock response when no API key is provided |

## Internal Logic
The main execution flow of this file is as follows:
- The `generate` method takes in system prompts and user prompts, creates a JSON payload with the model, maximum tokens, and input messages, and sends it to the Anthropic API.
- If an API key is not provided, it returns a mock response using the `getMockResponse` function.
- The `https.request` function is used to send the POST request to the Anthropic API.
- The response from the API is then parsed as JSON and its text content is extracted.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| https | No | Provides an HTTP client for sending requests |
| ./BaseProvider | Yes | Extends the `BaseProvider` class with additional functionality |

## Side Effects
- console_output: The file logs a warning message to the console if no Anthropic API key is provided.
- network: The file sends an HTTP request to the Anthropic API, which may involve network latency and potential failures.

## Dependents
No known dependents.

## Cross-References
- [BaseProvider.js](./BaseProvider.js.md)
