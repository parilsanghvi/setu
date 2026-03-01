---
source_hash: 2a130768d021244d
facts_hash: 03cf529db8f1306d
generated_at: 2026-02-25T12:21:32.926Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-core-agent-compaction.js

## Purpose
This file tests the functionality of the `CoreAgent` class, specifically its ability to compact context when the token count exceeds a threshold.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `require` | function | `id` | Requires a module or loads a mock implementation |
| `assert` | function | `condition, message` | Verifies a condition and logs an error if it's false |
| `estimateTokenCount` | method | `` | Returns the current token count estimate |
| `for` | method | `let i = 0; i < 20; i++` | Iterates over a range of numbers |
| `if` | method | `id === 'zod'` | Evaluates a conditional statement |
| `mockBus` | arrow | `{
    heartbeat: (name, role, pid, status`
| `mockLLM` | arrow | `{
    generate: async (prompt, messages, type, tools`
| `mockSkillLoader` | arrow | `{
    load: (` | 
| `MockZodType` | class | `` | 
| `runTest` | function | `` | Tests the CoreAgent functionality |
| `TestAgent` | class | `` | A test implementation of the CoreAgent class |

## Internal Logic
The file defines a mock setup to test the `CoreAgent` class, which is instantiated with a test context. The main execution flow involves:
- Setting up the test environment and mocking dependencies.
- Calling the `compactContext` method on the `TestAgent` instance.
- Verifying that the context has been compacted correctly in each scenario (token count below/threshold/above).
- Logging errors or successes to verify the behavior.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `require` | Yes | Provides a way to load modules or mock implementations |
| `../lib/CoreAgent` | Yes | Imports the CoreAgent class to test |
| `module` | No | 
| `path` | No | 

## Side Effects
- console_output: The file logs messages and errors to the console.
- database: None (no database interactions).
- process_control: The file exits with a success or failure code based on the test results.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
