---
source_hash: 6c41e2517f4e3ef9
facts_hash: 0b8c55a104e39025
generated_at: 2026-02-25T12:03:24.239Z
generator_version: 1.0.0
model: cheap
quality_score: 84
---
# File: lib/CoreAgent.js

## Purpose
The CoreAgent class in this file serves as the core implementation for an agent in a swarm system, handling tasks such as skill loading, tool management, and interaction with other agents and users.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `CoreAgent` | cjs_default | Handles incoming requests and returns a response |
| `SkillLoader` | function | Loads all skills in the ./skills directory |
| `Protocol` | object | Defines the standardized protocol for task assignments |
| `Agent` | class | Provides basic functionality for agents in the swarm system |
| `LLM` | module | Offers language model generation capabilities |
| `Config` | object | Holds configuration settings for the agent |

## Internal Logic
The main execution flow of the CoreAgent involves:
- Initializing with a name, role, scope, and optional tool configurations.
- Loading skills from the ./skills directory and merging tools.
- Handling incoming messages by processing user input, executing tasks, and managing context.
- Running an inner loop (thinking cycle) that engages tools to generate responses.

Key functions include:
- `_executeTurn`: Executes a single turn of the thinking cycle, engaging tools for LLM response generation.
- `runLoop`: The main thinking cycle that iterates through turns, checks interrupt signals, and continues or breaks the loop as needed.
- `processMessage`: Handles incoming messages by processing user input, executing tasks, and updating context.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `SkillLoader` | Yes | Provides skill loading functionality to initialize agent tools. |
| `./Agent` | Yes | Inherit basic agent functionality for the CoreAgent class. |
| `./Config` | Yes | Offers configuration options for the CoreAgent, such as main and fast model settings. |
| `./LLM` | Yes | Enables language model generation capabilities for response creation. |
| `./SessionLogger` | Yes | Logs user input, output, and session events to track agent interactions. |
| `./SkillLoader` | Yes | Loads skills from the ./skills directory. |
| `./SwarmProtocol` | Yes | Defines the standardized protocol for task assignments. |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
- [Agent.js](./Agent.js.md)
- [Config.js](./Config.js.md)
- [LLM.js](./LLM.js.md)
- [SessionLogger.js](./SessionLogger.js.md)
- [SkillLoader.js](./SkillLoader.js.md)
- [SwarmProtocol.js](./SwarmProtocol.js.md)
