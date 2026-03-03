---
source_hash: aed8912e87c98279
facts_hash: f6bdb95a5af47b0a
generated_at: 2026-03-03T07:37:50.597Z
generator_version: 1.0.0
model: cheap
quality_score: 91
---
# File: tests/test-core-agent.js

## Purpose
This file tests the functionality of the CoreAgent class, specifically its ability to handle tool calls and respond with text. It uses mock implementations of various dependencies to isolate the agent's behavior.

## Exports / API Surface

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockBus` | arrow | `{ heartbeat: (name, role, pid, status) => { ...} }` | Mocks database interactions |
| `mockLLM` | arrow | `{ generate: async (prompt, messages, type, tools) => { ...} }` | Mocks LLM behavior |
| `executeTool` | method | `toolCall` | Executes a tool call and returns the result |
| `TestAgent` | class | `` | A test agent that extends CoreAgent |

## Internal Logic
The main execution flow is as follows:

1. The file starts by mocking various dependencies using the `Module.prototype.require` method.
2. It then defines a test agent that extends the CoreAgent class, overriding its behavior to suit testing needs.
3. The `executeTool` method is used to execute tool calls and return results.
4. The `runTest` function sets up the test environment, including mock logging and speak functionality.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| `../lib/CoreAgent` | Yes | Provides the CoreAgent class to be tested |
| `fs` | No | Not needed for this testing environment |
| `module` | No | Only required for requiring modules |
| `path` | No | Only required for resolving file paths |

## Side Effects
- console_output: The test outputs logs and messages to the console, using `console.log` and `console.error`.
- database: None, as all database interactions are mocked out.
- process_control: The test uses `process.exit(1)` to exit the process with an error code if a test fails.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
