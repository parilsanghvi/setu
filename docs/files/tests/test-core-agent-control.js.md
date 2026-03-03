---
source_hash: cfb97a7f18fcfb2d
facts_hash: 8f7cbbe3cfe68c43
generated_at: 2026-03-03T07:37:13.573Z
generator_version: 1.0.0
model: cheap
quality_score: 87
---
# File: tests/test-core-agent-control.js

## Purpose
This file tests the control signals for a CoreAgent bot, ensuring that STOP and REDIRECT commands are handled correctly in both idle and busy states.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockBus` | arrow | `{ ... }` | Mocks the bus module for testing purposes. |
| `mockLLM` | arrow | `{ ... }` | Mocks the LLM module for testing purposes. |
| `mockSkillLoader` | arrow | `{ ... }` | Mocks the skill loader module for testing purposes. |
| `MockZodType` | class | `` | A mock implementation of ZodType for testing purposes. |

## Internal Logic
The main execution flow of this file is as follows:
1. The `runTest` function is called, which initializes a new instance of the `TestAgent` class.
2. The `TestAgent` class has a constructor that sets up the agent's state and mocks dependencies.
3. The `runLoop` method is overridden to simulate setting the busy state as in the original runLoop.
4. The `handleControlSignal` method is called with different control signals (STOP, REDIRECT) to test their handling.
5. After each test, the state of the agent is checked to ensure it matches the expected behavior.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `module` | Yes | Provides a way to modify the module prototype. |
| `fs` | No | Not used in this file. |
| `path` | No | Not used in this file. |
| `../lib/CoreAgent` | Yes | Provides the CoreAgent class for testing purposes. |

## Side Effects
- console_output: The console logs messages and errors during the test execution.
- database: The database is not accessed in this file, as it's a mock environment.
- process_control: The process control is affected by the control signals sent to the agent, which can interrupt or redirect its behavior.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
