---
source_hash: a7144232f1d64f63
facts_hash: 7a283ee6f771edcc
generated_at: 2026-03-03T07:20:37.694Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: lib/models/providers/anthropic.js

## Purpose
The anthropic.js file exports the AnthropicProvider class, which is a base provider for interacting with the Anthropic API. The `generate` method uses this class to send requests to the API and retrieve responses in the form of messages. These messages are then processed to extract relevant information such as tool calls and text content.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| AnthropicProvider | cjs_default | Provides a class for interacting with the Anthropic API |

## Internal Logic
The main execution flow of the `generate` method involves:

* Constructing the URL and headers for the API request
* Defining the body of the request with the required parameters (model, max_tokens, system prompt, user prompt, tools, etc.)
* Sending the request to the Anthropic API using the fetch function
* Parsing the response from the API
* Extracting relevant information from the response (tool calls and text content)
* Returning the extracted information as a response

Key functions in this flow include:

* `super(config)` in the constructor, which initializes the parent class with the provided configuration
* `fetch(url, { ... })`, which sends the request to the Anthropic API
* `JSON.stringify(body)`, which converts the body of the request to JSON format

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| BaseProvider | Yes | Defines the base class for providers in the system |

## Side Effects
- console_output: The file logs an error message if the request fails, which is written to the console.

## Dependents
No known dependents.

## Cross-References
- [base.js](./base.js.md)
