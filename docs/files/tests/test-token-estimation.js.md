---
source_hash: 37cdffe9efe90e79
facts_hash: ebc3a8918b4f34b5
generated_at: 2026-02-25T12:30:56.863Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-token-estimation.js

## Purpose
This file contains unit tests for the `CoreAgent` class, specifically its `estimateTokenCount` method, to ensure accurate token estimation in various scenarios.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| runTest | function | `` | Runs a test suite for the CoreAgent class |
| TestAgent | class | `` | A subclass of CoreAgent for testing purposes |

## Internal Logic
The main execution flow involves creating an instance of `TestAgent`, adding message objects to its context, and then calling `estimateTokenCount` on it. Key functions include:

* `runTest`: a function that sets up the test environment, runs the tests, and logs the results.
* `CoreAgent` class constructor: initializes the agent with its role, name, and scope.
* `estimateTokenCount`: calculates the estimated token count based on the message content.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| assert | Yes | Provides assertion utilities for testing |
| module | No | 
| CoreAgent | Yes | The main class being tested |

## Side Effects
- console_output: The file logs test results and errors to the console.
- database: None, as this file does not interact with a database.
- process_control: The `process.exit(1)` statement is used to exit the process with an error code if a test fails.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
