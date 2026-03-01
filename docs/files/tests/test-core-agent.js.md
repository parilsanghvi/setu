---
source_hash: aed8912e87c98279
facts_hash: 49463f49306ed623
generated_at: 2026-02-25T12:22:10.722Z
generator_version: 1.0.0
model: cheap
quality_score: 91
---
# File: tests/test-core-agent.js

## Purpose
This file provides a test environment for the CoreAgent, allowing developers to test its functionality in isolation without relying on external dependencies.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockBus` | arrow | `{ heartbeat: (name, role, pid, status) => { ...} }` | Mocks a bus for testing purposes. |
| `mockLLM` | arrow | `{ generate: async (prompt, messages, type, tools) => { ...} }` | Mocks an LLM for generating responses in tests. |
| `TestAgent` | class | `` | Defines a test agent class for CoreAgent. |

## Internal Logic
The main execution flow of this file is as follows:
- The test environment sets up mock dependencies (e.g., `mockBus`, `mockLLM`) to simulate the behavior of external modules.
- It defines a `TestAgent` class that extends the `CoreAgent` class, overriding its `executeTool` method to test tool calls and responses.
- The `runTest` function creates an instance of `TestAgent`, configures mock dependencies, and tests two scenarios: a standard loop with tool call and a text response only.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `module` | Yes | Provides the `require` function. |
| `path` | No | Used for resolving file paths. |
| `fs` | No | Not required by this test environment. |

## Side Effects
- console_output: The script logs various messages to the console, including test results and tool call responses.
- database: None of the dependencies interact with a database in this test environment.
- process_control: The script uses `process.exit(1)` to exit the process if tests fail, but it does not affect the operating system or other processes.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
