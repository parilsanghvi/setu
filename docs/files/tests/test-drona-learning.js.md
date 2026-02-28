---
source_hash: fc606f170b84f5e0
facts_hash: 0785d393f22ad111
generated_at: 2026-02-25T12:24:17.916Z
generator_version: 1.0.0
model: cheap
quality_score: 77
---
# File: tests/test-drona-learning.js

## Purpose
This file tests the Drona learning functionality by setting up an agent and ingesting a COBOL document, verifying that a skill is created correctly.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `require` | function | `id` | Mocks native/external dependencies. |
| `Guru` | class | `` | 
| `LLM.generate` | function | `system, prompt` | Generates a response for the given system and prompt. |

## Internal Logic
The main execution flow involves setting up an agent using the Guru class and ingesting a COBOL document to test the creation of a skill. The key functions are:

- `testDronaLearning`: Tests the Drona learning functionality by setting up an agent, ingesting a COBOL document, and verifying that a skill is created correctly.
- `Guru.processMessage`: Processes incoming messages from agents.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../agents/Guru` | Yes | Provides the Guru class for testing agent functionality. |
| `../lib/LLM` | Yes | Provides a mock implementation of the LLM to test its functionality. |

## Side Effects
- console_output: The file logs messages to the console during execution, including success and failure indicators.
- database: No direct interaction with a database occurs in this file.
- filesystem_read: The file reads the existence of a skill file on disk to verify its creation.
- filesystem_write: No files are written by this file.
- process_control: The `process.exit(0)` call controls the process exit after completion.

## Dependents
No known dependents.

## Cross-References
- [Guru.js](../agents/Guru.js.md)
- [LLM.js](../lib/LLM.js.md)
