---
source_hash: 59c7c3dc1196e4bf
facts_hash: ffbd58d692238112
generated_at: 2026-03-03T07:41:59.325Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-llm-anthropic.js

## Purpose
This file contains tests for the Anthropic class, specifically testing its happy path, error handling, network error handling, missing API key handling, and VETO/RISKY logic.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `require` | function | `id` | Handles incoming requests for mocked dependencies. |
| `https` | string | `` | Returns mock HTTPS response data. |
| `req` | arrow | `{ on, write, end }` | Simulates an HTTP request with custom event handlers. |
| `res` | arrow | `{ statusCode, headers, on }` | Creates a mock HTTP response object. |
| `resetMocks` | function | `` | Resets the mock state for each test. |

## Internal Logic
The main execution flow involves mocking dependencies to isolate the Anthropic class's behavior under different conditions. The key functions include:

- `if`: checks if the requested module is 'https' and returns a mock response.
- `req` and `res`: simulate an HTTP request with custom event handlers for the mock response.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `assert` | No | Provides assertions for testing. |
| `module` | No | Provides module-related functionality, including requiring modules. |

## Side Effects
- console_output: The console logs test results with '✅' and '❌' indicators.
- process_control: The file uses the `process.exit(1)` function to control the exit status of the process upon test failure.

## Dependents
No known dependents.

## Cross-References
- [Anthropic.js](../lib/llm/Anthropic.js.md)
