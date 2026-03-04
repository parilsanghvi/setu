---
source_hash: 93b8185e8e038311
facts_hash: d40f91f6aed7de83
generated_at: 2026-03-04T06:03:16.751Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-llm-openai-compatible.js

## Purpose
This file contains a set of unit tests for the `OpenAICompatible` class, which is used to interact with OpenAI's API. The tests cover various scenarios, including configuration initialization, API request generation, and discovery of models.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `createMockRequest` | function | `url, options, callback` | Creates a mock request object with the given URL and options. |
| `if` | method | `event === 'error' && mockRequestError` | Checks if an error event has occurred and sets up the mock request accordingly. |
| `res` | arrow | `{statusCode: mockResponse.statusCode || 200, on: (event, handler)}` | Creates a response object with the given status code and handler functions. |

## Internal Logic
The main execution flow of this file is as follows:
1. The `runTests` function creates an instance of `OpenAICompatible` for each test configuration.
2. Each test configuration is used to create a new instance of `OpenAICompatible`.
3. The `generate`, `fetchModels`, and other methods are called on the instance, with mock responses and errors set up accordingly.
4. The test results are compared to expected values using assertions.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `assert` | Yes | Provides assertion utilities for testing. |
| `http` | No | Provides HTTP request utilities, which are mocked in this file. |
| `https` | No | Provides HTTPS request utilities, which are mocked in this file. |

## Side Effects
- console_output: The test output is written to the console using `console.log` and `console.error`.
- network: Network requests are made using mock HTTP and HTTPS requests, allowing for testing of API interactions without actual network traffic.
- process_control: The test process is exited with a non-zero status code if any tests fail.

## Dependents
No known dependents.

## Cross-References
- [OpenAICompatible.js](../lib/llm/OpenAICompatible.js.md)
