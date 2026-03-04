---
source_hash: 3f99fd301c7d3243
facts_hash: 36596bfa60b6b2df
generated_at: 2026-03-04T06:03:31.591Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: tests/test-llm-openai.js

## Purpose
This file tests the OpenAIProvider class, which handles interactions with the OpenAI API to generate responses based on user input and tool calls.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `resetMocks` | function | `` | Resets mock fetch calls for testing. |

## Internal Logic
The main execution flow involves resetting mock fetch calls, setting up mock responses for different scenarios (standard generation, tool call handling, API error handling, and network error handling), and then calling the OpenAIProvider class with different inputs to test its functionality.

Key functions include:

- `resetMocks`: Resets mock fetch calls by clearing lastFetchUrl, lastFetchOptions, and mockResponse.
- `mockResponse`: Sets up a mock response object that is used to simulate API responses.
- `OpenAIProvider.generate()`: Calls the OpenAI API with the provided user input, tool calls, and options.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `assert` | No | Provides assertions for testing. |

## Side Effects
- console_output: The file logs test results to the console using `console.log()` and `console.error()`.
- global_mutation: The file restores the original fetch function from the global scope after all tests are complete.
- network: The file simulates a network error by throwing an Error with the message "fetch failed" in one of its tests.

## Dependents
No known dependents.

## Cross-References
- [openai.js](../lib/models/providers/openai.js.md)
