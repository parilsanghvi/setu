---
source_hash: a5667230d6ed4c1d
facts_hash: 27ab96b8e6545ba9
generated_at: 2026-03-03T07:52:08.962Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/verify-core-agent-loop.js

## Purpose
This file contains a test suite for the CoreAgent, specifically testing its run loop logic with various scenarios.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `mockBus` | arrow | `{
    heartbeat: (name, role, pid, status` | Mocks a database bus for testing purposes.
| `mockLLM` | arrow | `{
    generate: async (prompt, messages, type, tools` | Provides a mock LLM implementation for testing tool execution.
| `mockSkillLoader` | arrow | `{
    load: (` | Mocks a skill loader for testing purposes.
| `MockZodType` | class | `` | 
| `TestAgent` | class | `` |
| `runTest` | function | `` |

## Internal Logic
The main execution flow of this file is as follows:

- The file starts by mocking various dependencies, including a database bus, LLM, skill loader, and config.
- It then defines a TestAgent class that extends the CoreAgent, overriding its executeTool method to simulate tool execution.
- The runTest function is called, which creates an instance of TestAgent and sets up mock implementations for session logging and speech output.
- The test suite consists of four tests:
  - Test 1: Standard Turn - Tests basic conversation flow with a standard response from the LLM.
  - Test 2: Tool Execution (Multi-turn) - Tests tool execution in a multi-turn conversation, where the bot echoes back the user's input.
  - Test 3: Interrupt (STOP) - Tests interrupt handling when the bot receives a STOP signal during thinking.
  - Test 4: Interrupt (REDIRECT) - Tests redirect handling when the bot receives a REDIRECT signal with a new task.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `module` | Yes | Provides functionality for mocking dependencies.
| `path` | No | 
| `fs` | No | 

## Side Effects
- console_output: The test suite logs various messages to the console, including test results and expected values.
- database: None - The mock database bus does not interact with any actual databases.
- process_control: The bot's process is controlled through its handleControlSignal method, which receives STOP and REDIRECT signals.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
