---
source_hash: d5d790205abb3315
facts_hash: 2f7a9a785f578b65
generated_at: 2026-03-03T07:03:55.921Z
generator_version: 1.0.0
model: cheap
quality_score: 98
---
# File: agents/Koshpal.js

## Purpose
This file defines the `Koshpal` class, a custom agent that extends the `CoreAgent` class. It handles incoming messages and makes decisions based on its persona and skills to ensure data safety and security in a database system.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Koshpal` | cjs_default | 
| `handleSpecProposal` | function | Handles spec proposal messages from the LLM. |
| `looksLikeQuery` | function | Returns true if a message contains query-related keywords. |
| `initializeScope` | function | Initializes the scope directory for database operations. |
| `takeSnapshot` | function | Creates a snapshot of the database for backup purposes. |
| `processMessage` | function | Handles incoming messages and makes decisions based on its persona and skills. |

## Internal Logic
The main execution flow of this file is as follows:

1. The `Koshpal` class is instantiated with a name and role, which are used to determine the agent's persona and behavior.
2. The `processMessage` function is called when an incoming message is received.
3. If the message contains a proposal for a schema specification, it is passed to the `handleSpecProposal` function for evaluation.
4. Otherwise, if the message contains query-related keywords or needs assessment from the LLM, the `looksLikeQuery` function is used to determine its type and content.
5. The agent's persona and skills are used to make decisions about whether to take a snapshot or block the message based on the LLM's assessment.
6. If an evaluation of the proposal is needed, it is passed to the LLM for generation.
7. Finally, if the proposal is approved or vetoed, it is recorded in the database and communicated back to the sender.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Context` | Yes | Provides context information about the system. |
| `../lib/Contractor` | Yes | Handles the recording of proposals and approvals. |
| `../lib/CoreAgent` | Yes | Extends the base agent functionality. |
| `../lib/db` | Yes | Manages database operations, including schema proposals and snapshots. |
| `../lib/LLM` | Yes | Evaluates and generates text from prompts based on its training data. |
| `../lib/SkillLoader` | Yes | Loads the skills required by the agent. |

## Side Effects
- console_output: The `console.log` statements in the code output logs to the console, including information about the agent's actions and decisions.
- database: The `Koshpal` agent interacts with the database through the `db` module, recording proposals, approvals, and snapshots.
- filesystem_read: The `fs` module is used to read files in the scope directory during the initialization of the scope.
- filesystem_write: The `fs` module is also used to create directories in the scope and write data to it.

## Dependents
No known dependents.

## Cross-References
- [Context.js](../lib/Context.js.md)
- [Contractor.js](../lib/Contractor.js.md)
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
- [SkillLoader.js](../lib/SkillLoader.js.md)
