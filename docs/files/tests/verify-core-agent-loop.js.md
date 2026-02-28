---
source_hash: a5667230d6ed4c1d
facts_hash: 06636f1961269139
generated_at: 2026-02-25T12:32:57.340Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: tests/verify-core-agent-loop.js

## Purpose
This file contains a test suite for the CoreAgent class, specifically testing its run loop logic. It defines a mock test agent, sets up mock dependencies for the LLM and SkillLoader, and executes various tests to ensure correct behavior under different scenarios.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockBus` | arrow | `{
    heartbeat: (name, role, pid, status) => { ... }`, Mocks the database bus for testing purposes. |
| `mockLLM` | arrow | `{
    generate: async (prompt, messages, type, tools) => "Mock Response", Generates mock responses from the LLM. |
| `mockSkillLoader` | arrow | `{
    load: () => new Map(), Simulates loading a skill loader. |
| `TestAgent` | class | `` Defines a test agent subclass of CoreAgent for testing purposes. |

## Internal Logic
The main execution flow of this file involves:
- Setting up mock dependencies for the LLM and SkillLoader.
- Creating an instance of the TestAgent class, which extends CoreAgent.
- Defining various methods on the TestAgent class to test specific scenarios, such as standard turns, tool execution, interrupts, and redirects.
- Executing these tests using a runTest function that orchestrates the entire test suite.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `module` | Yes | Provides access to the module prototype. |
| `path` | No | Used for resolving path names in the test environment. |

## Side Effects
- console_output: The code logs messages to the console during testing, using console.log and console.error.
- database: The code does not interact with a real database; instead, it uses mock dependencies to simulate its behavior.
- process_control: The code uses process.exit() to exit the test suite if a test fails.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
