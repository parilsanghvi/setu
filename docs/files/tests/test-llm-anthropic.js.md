---
source_hash: 59c7c3dc1196e4bf
facts_hash: cc14285b051ef2da
generated_at: 2026-03-04T06:02:16.615Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-llm-anthropic.js

## Purpose
This file contains test cases for the Anthropic class, specifically testing its happy path, API error handling, network error handling, missing API key handling, and veto/risk logic.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `require` | method | `id === 'https'` | Mocks the https request. |
| `require` | function | `` | Resets mock state before each test. |
| `generate` | function | `` | Generates a response from the provider. |

## Internal Logic
The main execution flow of this file is as follows:

1. The file starts by mocking the HTTPS request and setting up mock state for testing.
2. It then creates an instance of the Anthropic class, passing in different configurations to test various scenarios.
3. Each test case calls the generate method on the provider, which returns a response string or throws an error based on the scenario being tested.
4. The test cases assert that the returned value matches the expected output or that an error was thrown with the correct message.

Key functions include:

* `resetMocks`: Resets mock state before each test by resetting the HTTPS request and other mock values.
* `generate`: Generates a response from the provider based on the input prompts and configuration.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `assert` | No | Provides assertions for testing. |
| `module` | No | Provides helper utilities, including mocking the https request. |

## Side Effects
- console_output: The file logs various messages to the console during execution, including passing test cases and failing tests.
- process_control: The file restores the original require method after all tests have completed to prevent accidental changes to the module prototype.

## Dependents
No known dependents.

## Cross-References
- [Anthropic.js](../lib/llm/Anthropic.js.md)
