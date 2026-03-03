---
source_hash: 3f99fd301c7d3243
facts_hash: 4d4f2b45968c3078
generated_at: 2026-03-03T07:43:16.697Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-llm-openai.js

## Purpose
This file tests the OpenAIProvider class, which is used to interact with the OpenAI API. It covers various scenarios such as standard generation, tool call handling, API error handling, and network error handling.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `OpenAIProvider` | function | `{ model: string, auth: { key: string }, baseUrl: string }` | Creates an instance of the OpenAIProvider class to interact with the OpenAI API. |
| `_global_fetch` | function | `(url: string, options: Object)` | Mocks the global fetch function to track and manipulate HTTP requests. |

## Internal Logic
The main execution flow involves setting up mocks for the global fetch function, creating instances of the OpenAIProvider class, calling its methods, and verifying the expected results.

Key functions include:

*   `resetMocks`: Resets the mock state by clearing the last fetch URL, options, and response.
*   `_global_fetch`: Mocks the global fetch function to track and manipulate HTTP requests.
*   `OpenAIProvider`: Creates an instance of the OpenAIProvider class to interact with the OpenAI API.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/models/providers/openai` | Yes | Provides the implementation for interacting with the OpenAI API. |
| `assert` | No | Provides assertion utilities for testing and validation. |

## Side Effects
-   console_output: The file logs test results to the console using console.log and console.error statements.
-   global_mutation: The file restores the original global fetch function after completing all tests by assigning it back to the originalFetch variable.
-

## Dependents
No known dependents.

## Cross-References
- [openai.js](../lib/models/providers/openai.js.md)
