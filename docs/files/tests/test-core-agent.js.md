---
source_hash: aed8912e87c98279
facts_hash: 50d0dd4ac2fb3b51
generated_at: 2026-03-04T05:56:58.656Z
generator_version: 1.0.0
model: cheap
quality_score: 91
---
# File: tests/test-core-agent.js

## Purpose
This file tests the functionality of the CoreAgent class, specifically its ability to handle tool calls and respond with relevant text.

## Exports / API Surface

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockBus` | arrow | `{ heartbeat: (name, role, pid, status) => { ...} }` | Mocks the database interface for testing purposes. |
| `mockLLM` | arrow | `{ generate: async (prompt, messages, type, tools) => { ...} }` | Provides a mock LLM implementation for testing the CoreAgent's response generation. |
| `MockZodType` | class | `` | Defines a minimal Zod type class for testing purposes. |
| `executeTool` | method | `toolCall` | Executes a tool call and returns its result. |
| `runTest` | function | `` | Runs the test suite for the CoreAgent class. |

## Internal Logic

The main execution flow of this file involves requiring the CoreAgent class, creating an instance of it, and then running the test suite using the `runTest` function. The key functions involved in this process are:

- `executeTool`: This method is overridden in the TestAgent class to avoid filesystem reads/writes if not needed.
- `processMessage`: This method is called on the bot instance to simulate a user request, and it determines the response based on the tool call or text response.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| `module` | No | Provides the require function for loading modules. |
| `path` | No | Provides utility functions for working with file paths. |

## Side Effects
- console_output: The console.log statements in this file output debug messages to the console.
- database: This test does not interact with any databases, as the mock bus interface is used for testing purposes only.
- process_control: The `process.exit(1)` statement in the test suite exits the process if a test fails.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
