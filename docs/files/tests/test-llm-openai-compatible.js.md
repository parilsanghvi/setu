---
source_hash: 93b8185e8e038311
facts_hash: 52bf55bf64e7fe4e
generated_at: 2026-03-03T07:43:00.354Z
generator_version: 1.0.0
model: cheap
quality_score: 81
---
# File: tests/test-llm-openai-compatible.js

## Purpose
This file contains a test suite for the OpenAICompatible class, which is responsible for interacting with the OpenAI API to generate responses. The tests cover various scenarios, including configuration initialization, API requests, and error handling.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `createMockRequest` | function | `url, options, callback` | Creates a mock request object with the given URL, options, and callback. |
| `if` | method | `event === 'error' && mockRequestError` | A conditional statement to check if an error event occurs. |
| `res` | arrow | `{
                statusCode: mockResponse.statusCode || 200, on: (event, handler` | Creates a response object with the given status code and event handlers. |

## Internal Logic
The main execution flow of this file is as follows:
1. The `runTests` function is called to execute all the test cases.
2. Within `runTests`, each test case is defined and executed sequentially, including tests for configuration initialization, API requests, and error handling.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `createMockRequest` | Yes | Provides a custom request object creation function. |
| `../lib/llm/OpenAICompatible` | Yes | The OpenAICompatible class is used for testing. |

## Side Effects
- console_output: This file logs success or failure messages to the console using `console.log` and `console.error`.
- network: No explicit network requests are made in this file.
- process_control: The `process.exit(1)` statement is used to exit the process with a non-zero status code if any test fails.

## Dependents
No known dependents.

## Cross-References
- [OpenAICompatible.js](../lib/llm/OpenAICompatible.js.md)
