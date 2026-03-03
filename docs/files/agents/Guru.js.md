---
source_hash: 6ac1f950b9225246
facts_hash: 9421498e5bd0dd12
generated_at: 2026-03-03T07:03:34.201Z
generator_version: 1.0.0
model: cheap
quality_score: 92
---
# File: agents/Guru.js

## Purpose
The Guru class is a knowledge-sharing agent that processes messages, extracts patterns, and generates skills to improve its understanding of various topics. It interacts with other agents, systems, and external resources to learn and improve its performance. The Guru class is an essential component of the system's decision-making process.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Guru` | cjs_default | 
| `setTools` | function | Sets up tool functions for the agent |
| `processMessage` | async function | Handles incoming messages and processes them accordingly |
| `trackDrift` | async function | Generates a migration skill based on package drift |
| `learnLanguage` | async function | Learns a new language or framework from documentation |
| `analyzeCrash` | async function | Analyzes agent crashes and generates warning skills |
| `attemptSelfRepair` | async function | Attempts self-repair by fixing bugs in code |
| `extractPattern` | async function | Extracts patterns from tasks and generates skills |

## Internal Logic
The main execution flow of the Guru class involves processing incoming messages, extracting relevant information, and generating skills accordingly. The key functions include:

- `constructor`: Initializes the agent with a name, role, and scope.
- `processMessage`: Handles incoming messages and determines which function to call based on the message type.
- `trackDrift`, `learnLanguage`, and `analyzeCrash` are responsible for generating migration skills, learning new languages or frameworks, and analyzing agent crashes, respectively.
- `attemptSelfRepair` attempts self-repair by fixing bugs in code.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/CoreAgent` | Yes | Provides the base class for agents |
| `../lib/db` | Yes | Enables database interaction for heartbeat and event processing |
| `../lib/LLM` | Yes | Utilizes a large language model for generating skills and responses |
| `../lib/SkillLoader` | Yes | Loads and manages skills for the agent |
| `../lib/utils/JsonParser` | Yes | Parses JSON responses from the LLM |

## Side Effects
- console_output: The Guru class logs various messages to the console, including successful skill generation and errors.
- filesystem_read: The Guru class reads files from the file system when attempting self-repair or generating skills.
- filesystem_write: The Guru class writes new skills to the file system in JSON format.
- network: The Guru class does not have any direct network interactions. However, it may make API calls to external resources if needed.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
- [SkillLoader.js](../lib/SkillLoader.js.md)
- [JsonParser.js](../lib/utils/JsonParser.js.md)
