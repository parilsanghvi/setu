---
source_hash: d5fc06e59711161f
facts_hash: f7dfad25a1674ea4
generated_at: 2026-03-04T06:05:16.072Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-ollama.js

## Purpose
This file contains test cases for the `Ollama` class, which generates responses to user prompts using a large language model. The tests cover various scenarios, including happy paths, API errors, connection errors, and malformed JSON inputs.

## Exports / API Surface

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `Ollama` | class | `{ ollamaBaseUrl: 'http://localhost:11434' }` | Instantiates the Ollama class with a given base URL. |
| `generate` | function | `'System', 'User Prompt'` | Generates a response to the specified prompt using the Ollama instance. |

## Internal Logic

The main execution flow of this file is as follows:

1. The `runTests()` function initializes the Ollama class with a given base URL and sets up mock responses for various test scenarios.
2. It then calls the `generate()` method on the Ollama instance, passing in user prompts, to generate responses.
3. After generating a response, it verifies that the request payload and response match the expected values using assertions.
4. If any tests fail, it logs an error message and exits the process with a non-zero status code.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| `assert` | No | Provides assertion utilities for testing. |
| `http` | No | Provides HTTP request utility functions. |
| `../lib/llm/Ollama` | Yes | Provides the Ollama class implementation. |

## Side Effects

- console_output: The test file logs messages to the console using `console.log()` and `console.error()`.
- network: The test file simulates API requests by mocking the `http.request` method, which may cause network requests if the mock is not properly configured.
- process_control: The test file uses `process.exit(1)` to exit the process with a non-zero status code if any tests fail.

## Dependents
No known dependents.

## Cross-References
- [Ollama.js](../lib/llm/Ollama.js.md)
