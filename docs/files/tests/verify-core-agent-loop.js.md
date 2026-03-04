---
source_hash: a5667230d6ed4c1d
facts_hash: d14d1ec348aa1ee6
generated_at: 2026-03-04T06:11:46.862Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: tests/verify-core-agent-loop.js

## Purpose
This file contains test cases for the CoreAgent's RunLoop logic, specifically testing its ability to handle standard turns, tool execution, interruptions (STOP and REDIRECT), and other scenarios.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockBus` | arrow | `{ heartbeat: (name, role, pid, status) => {...}, ... }` | Mocks the bus for testing purposes. |
| `mockLLM` | arrow | `{ generate: async (prompt, messages, type, tools) => {...}, registerProvider: () => {...}, getProvider: () => {...} }` | Mocks an LLM for testing purposes. |
| `mockSkillLoader` | arrow | `{ load: () => new Map() }` | Mocks a skill loader for testing purposes. |
| `MockZodType` | class | `` | An empty class used to mock Zod type definitions. |

## Internal Logic
The main execution flow of this file involves creating instances of the TestAgent and CoreAgent classes, setting up mocks for dependencies, and running test cases using the runTest function.

- The runTest function creates a new instance of the TestAgent and sets up mocks for the LLM and skill loader. It then runs multiple test cases, each testing a specific scenario:
  - Standard turn: Verifies that the agent responds correctly to a standard input message.
  - Tool execution (Multi-turn): Tests the agent's ability to execute tools in multi-turn conversations.
  - Interrupt (STOP): Verifies that the agent handles interruptions correctly and stops processing messages.
  - Interrupt (REDIRECT): Tests the agent's ability to redirect context during tool execution.

- The constructor of the TestAgent class initializes its properties, including its name, role, and tools. It also sets up a session logger and a speak handler for capturing output.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/CoreAgent` | Yes | Provides the core logic for the CoreAgent class. |
| `module` | No | Provides helper utilities, such as requiring modules. |

## Side Effects
- console_output: The code logs various messages to the console during testing.
- database: There are no database interactions in this test file.
- process_control: The code simulates control signals (STOP and REDIRECT) to test the agent's behavior under different scenarios.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
