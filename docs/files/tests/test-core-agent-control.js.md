---
source_hash: cfb97a7f18fcfb2d
facts_hash: 006a63f04654fe34
generated_at: 2026-02-25T12:21:52.967Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: tests/test-core-agent-control.js

## Purpose
This file contains a test suite for the CoreAgent control signals, ensuring that different control commands (STOP and REDIRECT) are handled correctly by the agent.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockBus` | arrow | `{ heartbeat: (name, role, pid, status) => {} }` | Mocks a bus to return mock data for database-related dependencies. |
| `mockLLM` | arrow | `{ generate: async () => "Mock Response", registerProvider: () => {}, getProvider: () => {} }` | Mocks an LLM (Large Language Model) instance with predefined methods. |
| `mockSkillLoader` | arrow | `{ load: () => new Map(), get: () => null, getAll: () => [] }` | Mocks a skill loader that returns mock data for skills. |
| `MockZodType` | class | `` | A mock Zod type class with no functionality. |

## Internal Logic
The main execution flow of this file involves creating an instance of the TestAgent class, which extends the CoreAgent class. The test agent has a few key methods:
- Constructor: Initializes the test agent with a bot name, role, and scope.
- `runLoop` method: Simulates the run loop process without executing logic to verify that it's called correctly.
- `resetTestState` method: Resets the test state by clearing flags and mock data.

The main execution flow of this file also involves running a series of tests using the `runTest` function. These tests cover different scenarios for control signals (STOP and REDIRECT) and ensure that the agent handles them correctly.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `module` | Yes | Provides access to the module prototype and its methods. |
| `path` | No | Used by Node.js for file system operations. |
| `fs` | No | Used by Node.js for file system operations. |

## Side Effects
- console_output: The test suite logs various messages to the console, including expected results and error messages.
- database: This file does not interact with a database directly.
- process_control: The test suite uses control signals (STOP and REDIRECT) to influence the behavior of the agent, which is part of the process.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
