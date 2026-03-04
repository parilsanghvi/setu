---
source_hash: fc606f170b84f5e0
facts_hash: ac703fcfd0510bf2
generated_at: 2026-03-04T06:00:44.365Z
generator_version: 1.0.0
model: cheap
quality_score: 90
---
# File: tests/test-drona-learning.js

## Purpose
This file tests the Drona learning functionality, specifically the Guru agent's ability to ingest documents and create skills for a given language.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `require` | function | `id` | Mocks native/external dependencies. |
| `Guru` | class | `` | Exposes the Guru agent class for use in tests. |
| `LLM` | object | `` | Provides an LLM (Large Language Model) instance for testing purposes. |

## Internal Logic
The main execution flow of this file is as follows:

1. The testDronaLearning function is defined, which sets up the Guru agent and tests its ability to ingest documents.
2. The Guru agent is created with a specific name and scope.
3. A document content string is passed to the Guru agent's processMessage method, which ingests the document and creates a skill for the given language (in this case, COBOL).
4. The test checks if the skill was successfully created by checking if a corresponding file exists in the agent's scope.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `module` | No | Provides the require function for mocking native dependencies. |
| `fs` | No | Provides file system utilities, but not used directly in this test. |
| `path` | No | Provides path manipulation utilities, but not used directly in this test. |
| `../agents/Guru` | Yes | Exposes the Guru agent class and its functionality for testing purposes. |
| `../lib/LLM` | Yes | Provides an LLM instance for testing purposes and generating mock data. |

## Side Effects
- console_output: The test logs messages to the console, including success or failure indicators for the skill creation process.
- database: No direct interactions with a database occur in this test.
- filesystem_read: The test checks if a file exists on disk using fs.existsSync, but does not read any data from it.
- filesystem_write: The test writes no data to the file system.
- process_control: The test controls the flow of the program by checking for successful skill creation and exiting with a status code.

## Dependents
No known dependents.

## Cross-References
- [Guru.js](../agents/Guru.js.md)
- [LLM.js](../lib/LLM.js.md)
