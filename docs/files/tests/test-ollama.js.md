---
source_hash: d5fc06e59711161f
facts_hash: 5e4e7da8acbc53a5
generated_at: 2026-03-03T07:44:53.321Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-ollama.js

## Purpose
This file contains unit tests for the `Ollama` class, specifically testing its `generate` method under various scenarios such as happy path, API error, connection error, and malformed JSON.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| Ollama | function | `{ ollamaBaseUrl: 'http://localhost:11434' }` | Creates a new instance of the `Ollama` class with the provided configuration. |
| generate | method | `(system, prompt)` | Generates a response for the given system and user prompts using the `Ollama` instance. |

## Internal Logic
The main execution flow of this file is as follows:

1. The `runTests` function sets up a mock HTTP request environment to test the `generate` method of the `Ollama` class.
2. It creates an instance of the `Ollama` class with a configuration object that specifies the base URL for the API.
3. The `runTests` function then calls the `generate` method with different inputs (e.g., system and user prompts) to test its behavior under various scenarios.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| assert | Yes | Provides assertions for testing. |
| http | No | Imports the HTTP module for creating a mock request environment. |

## Side Effects
- console_output: The file logs messages to the console indicating test results (e.g., "✅ Passed").
- network: The file uses a mock HTTP request environment that simulates network requests, but does not actually make any requests.
- process_control: The file exits the process with a non-zero status code if all tests fail.

## Dependents
No known dependents.

## Cross-References
- [Ollama.js](../lib/llm/Ollama.js.md)
