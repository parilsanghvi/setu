---
source_hash: d5d790205abb3315
facts_hash: efc8a3033cf7cef4
generated_at: 2026-02-25T11:53:34.093Z
generator_version: 1.0.0
model: cheap
quality_score: 91
---
# File: agents/Koshpal.js

## Purpose
The Koshpal.js file defines a custom agent class named Koshpal, which extends the CoreAgent class. It is responsible for managing database interactions and enforcing rules to prevent data loss. The agent uses natural language processing (NLP) to assess risk and take actions accordingly.

| Export | Type | Description |
|--------|------|-------------|
| `Koshpal` | cjs_default | Exports the Koshpal class, a custom agent that manages database interactions. |

## Internal Logic
The main execution flow of the Koshpal.js file involves the following key functions:
- The constructor initializes the agent with its name, role, and database path.
- The `processMessage` function handles incoming requests from users and uses LLM to assess risk and take actions accordingly.
- The `handleSpecProposal` function evaluates database schema proposals using LLM and decides whether to approve or veto them based on the assessment.
- The `looksLikeQuery` function checks if a given content resembles a query by looking for specific keywords.
- The `takeSnapshot` function creates a snapshot of the database backup.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Context` | Yes | Provides a context object to read and write data. |
| `../lib/Contractor` | Yes | Offers methods for recording vetoes and approvals. |
| `../lib/CoreAgent` | Yes | Serves as the base class for this custom agent. |
| `../lib/db` | Yes | Facilitates database interactions, including heartbeat notifications. |
| `../lib/LLM` | Yes | Utilizes natural language processing to assess risk and generate responses. |
| `../lib/SkillLoader` | Yes | Loads skills for the agent, which are used for assessment. |

## Side Effects
- console_output: The agent logs messages to the console, including when it starts and what actions it takes.
- database: The agent interacts with the database, including sending heartbeat notifications and reading/writing data using the context object.
- filesystem_read: The agent reads the scope directory and checks if a snapshot has been created.
- filesystem_write: The agent writes data to the scope directory, creating it if necessary.

## Dependents
No known dependents.

## Cross-References
- [Context.js](../lib/Context.js.md)
- [Contractor.js](../lib/Contractor.js.md)
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
- [SkillLoader.js](../lib/SkillLoader.js.md)
