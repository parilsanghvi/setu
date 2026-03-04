---
source_hash: cfb97a7f18fcfb2d
facts_hash: 1f84327059a7615f
generated_at: 2026-03-04T05:56:24.342Z
generator_version: 1.0.0
model: cheap
quality_score: 77
---
# File: tests/test-core-agent-control.js

## Purpose
This file tests the control signals functionality of the CoreAgent class, verifying that it handles STOP and REDIRECT signals correctly under different scenarios.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockBus` | arrow | `{ ... }` | Mocks the bus for testing purposes. |
| `mockLLM` | arrow | `{ ... }` | Mocks the LLM for testing purposes. |
| `mockSkillLoader` | arrow | `{ ... }` | Mocks the skill loader for testing purposes. |
| `MockZodType` | class | `` | An empty mock Zod type class. |

## Internal Logic
The main execution flow of this file is as follows:
- The `runTest` function creates an instance of the `TestAgent` class.
- It sets up three test scenarios: STOP Signal, REDIRECT Signal (Idle), and REDIRECT Signal (Busy).
- For each scenario, it calls the `handleControlSignal` method with a corresponding control signal message.
- After handling each signal, it checks if the expected interrupt signal is set and verifies that the context has been updated correctly.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/CoreAgent` | Yes | Provides the CoreAgent class for testing. |

## Side Effects
- console_output: The file logs various test results, error messages, and debug information to the console.
- database: No database operations are performed in this file.
- process_control: The file uses the `process.exit(1)` method to terminate the process if a test fails or encounters an unexpected state.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
