---
source_hash: 87b117d331b52215
facts_hash: 4d3c80db84320322
generated_at: 2026-03-04T05:35:39.531Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: lib/CoreAgent.js

## Purpose
The CoreAgent.js file is responsible for creating and managing a core agent in the swarm system, handling incoming messages, executing tools, and providing a standardized loop for processing messages. The class extends the Agent class and provides functionality for tool execution, context management, and session logging. This implementation serves as a foundation for other agents to interact with the swarm.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `CoreAgent` | cjs_default | Creates and manages a core agent in the swarm system. |
| `setTools` | function | Sets the tools available to the agent. |
| `processMessage` | function | Handles incoming messages and executes the standardized loop. |
| `_executeTurn` | function | Executes one turn of the thinking loop. |
| `_prepareLlmMessages` | function | Prepares LLM messages for processing. |
| `_handleLlmResponse` | function | Handles LLM responses and updates the context. |
| `runLoop` | function | Runs the main thinking loop. |
| `_setBusyState` | function | Sets the busy state of the agent. |
| `_setIdleState` | function | Sets the idle state of the agent. |

## Internal Logic
The CoreAgent class has a constructor that initializes the agent's properties, such as tools, context, and model configuration. The main execution flow involves handling incoming messages, executing tools, and processing LLM responses.

Key functions:

* `runLoop`: Runs the main thinking loop, iterating over a maximum number of turns.
* `_executeTurn`: Executes one turn of the thinking loop, including tool execution and response handling.
* `_prepareLlmMessages`: Prepares LLM messages for processing.
* `_handleLlmResponse`: Handles LLM responses and updates the context.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./Agent` | Yes | Provides a base class for agents. |
| `./AgentContextManager` | Yes | Manages the agent's short-term memory (context). |
| `./AgentToolExecutor` | Yes | Executes tools available to the agent. |
| `./Config` | Yes | Loads and configures model settings. |
| `./LLM` | Yes | Provides a language model for generating responses. |
| `./SessionLogger` | Yes | Logs session data, including input and output messages. |
| `./SkillLoader` | Yes | Loads skills and tool definitions. |
| `./SwarmProtocol` | Yes | Defines the swarm protocol for message handling. |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
- [Agent.js](./Agent.js.md)
- [AgentContextManager.js](./AgentContextManager.js.md)
- [AgentToolExecutor.js](./AgentToolExecutor.js.md)
- [Config.js](./Config.js.md)
- [LLM.js](./LLM.js.md)
- [SessionLogger.js](./SessionLogger.js.md)
- [SkillLoader.js](./SkillLoader.js.md)
- [SwarmProtocol.js](./SwarmProtocol.js.md)
