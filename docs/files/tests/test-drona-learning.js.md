---
source_hash: fc606f170b84f5e0
facts_hash: 898234e8f341cd73
generated_at: 2026-03-03T07:40:27.162Z
generator_version: 1.0.0
model: cheap
quality_score: 77
---
# File: tests/test-drona-learning.js

## Purpose
This file tests the functionality of the Drona learning system, specifically the Guru agent's ability to ingest documents and create skills based on the content.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `require` | function | `id` | Mocks native/external dependencies for testing purposes. |
| `Guru` | class | `` | Represents an agent that can process and learn from incoming messages. |
| `LLM.generate` | function | `system, prompt` | Generates a response based on the input system and prompt. |

## Internal Logic
The main execution flow involves creating a new instance of the Guru class, passing it a message to ingest documents, and then checking if the expected skill was created successfully.

Key functions:

- `testDronaLearning`: The test function that runs the entire workflow.
- `Guru.constructor`: Initializes the agent with an ID and scope.
- `agent.processMessage`: Ingests the incoming document content into the agent's knowledge graph.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../agents/Guru` | Yes | Provides the Guru agent class for testing. |
| `../lib/LLM` | Yes | Supplies the LLM generate function for mock response generation. |

## Side Effects
- console_output: The test prints success or failure messages to the console, indicating whether the skill was created successfully.
- database: None - This file does not interact with a database directly.
- filesystem_read: The test checks if a specific skill file exists on disk, but does not read from it.
- filesystem_write: The test creates and deletes a directory for the skill file, but only in the cleanup section (commented out).
- process_control: The test uses `process.exit(0)` to control the process flow after completing the test.

## Dependents
No known dependents.

## Cross-References
- [Guru.js](../agents/Guru.js.md)
- [LLM.js](../lib/LLM.js.md)
