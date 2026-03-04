---
source_hash: 17e043f39009c55d
facts_hash: 1c16fcb02a5060b6
generated_at: 2026-03-04T05:56:07.554Z
generator_version: 1.0.0
model: cheap
quality_score: 82
---
# File: tests/test-core-agent-compaction.js

## Purpose
This file is a test suite for the `CoreAgent` class, specifically testing its `compactContext` method under various scenarios such as no compaction, compaction triggered, compaction error handling, LLM error without message property, and LLM returns null/empty.

## Exports / API Surface

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| require | function | `id` | Imports the specified module or function |
| MockBus | object | `{ ... }` | Mock bus implementation for testing purposes |
| MockLLM | object | `{ ... }` | Mock LLM implementation for testing purposes |
| MockSkillLoader | object | `{ ... }` | Mock skill loader implementation for testing purposes |
| MockZodType | class | `{}` | Minimal implementation of Zod type for mocking |
| CoreAgent | function | `` | The core agent class being tested |
| TestAgent | class | `` | A subclass of the CoreAgent, used for testing purposes |

## Internal Logic
The main execution flow of this file is as follows:
1. The `runTest` function is executed.
2. It sets up a test environment by creating an instance of the `TestAgent` class and populating its context with dummy messages.
3. It tests various scenarios such as no compaction, compaction triggered, compaction error handling, LLM error without message property, and LLM returns null/empty.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| module | Yes | Provides the `require` function for importing modules |
| path | No | Provides utility functions for working with file paths |

## Side Effects
- console_output: The test suite logs messages to the console, including pass/fail indicators and summary results.
- database: None - There is no direct interaction with a database in this test suite.
- process_control: The `process.exit` function is used to control the process exit status based on the number of failed tests.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
