---
source_hash: 5c138b45985fdbe6
facts_hash: 68652429feab8ecd
generated_at: 2026-02-25T12:07:52.270Z
generator_version: 1.0.0
model: cheap
quality_score: 76
---
# File: lib/models/providers/anthropic.js

## Purpose
This file provides the `AnthropicProvider` class, which is responsible for generating responses from Anthropic's API based on user input and configuration options.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `generate` | function | Generates a response from Anthropic's API based on the provided system prompt, user prompt, tools, and options. |
| `AnthropicProvider` | cjs_default | Exposes the `AnthropicProvider` class for use in other parts of the application. |

## Internal Logic
The main execution flow involves:

* The `generate` method: takes a system prompt, user prompt, tools, and options as input; validates the authentication credentials and configuration options; constructs the API request payload; sends the request to Anthropic's API; parses the response; and returns the generated response.
* The constructor: initializes the provider with an authentication token, model name, and base URL.

## Dependencies
| Export | Type | Description |
|--------|------|-------------|

## Side Effects
- console_output:
  - Logs any request failures to the console with an error message.
- network:
  - Sends a POST request to Anthropic's API when generating a response.

## Dependents
No known dependents.

## Cross-References
No cross-references.
