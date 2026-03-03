---
source_hash: 0cd2dd43ed1bbcb9
facts_hash: b0d631e73601d6b9
generated_at: 2026-03-03T07:15:47.503Z
generator_version: 1.0.0
model: cheap
quality_score: 88
---
# File: lib/CoreAgent.js

## Purpose
The CoreAgent file defines a class named CoreAgent that extends the Agent class, representing an AI agent in a swarm environment. This class handles incoming requests, executes tasks, and interacts with other agents through a standardized loop. It uses various tools and models to process messages.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `handleControlSignal` | function | Handles control signals received from the bus. |
| `processMessage` | function | Processes incoming messages and executes tasks or standard chat if applicable. |
| `runLoop` | function | Runs the main loop of the agent, processing input, thinking, tool execution, and outputting responses. |
| `setTools` | function | Sets the tools available to the agent. |
| `CoreAgent` | cjs_default | 

## Internal Logic
The main execution flow of the CoreAgent class can be described as follows:
- The constructor initializes the agent's properties, including its tools and context.
- The handleControlSignal method processes incoming control signals from the bus.
- The processMessage method handles incoming messages, executing tasks or standard chat if applicable.
- The runLoop method runs the main loop of the agent, processing input, thinking, tool execution, and outputting responses.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./Agent` | Yes | Provides a base class for agents. |
| `./AgentContextManager` | Yes | Manages the context of the agent. |
| `./AgentToolExecutor` | Yes | Executes tools on behalf of the agent. |
| `./Config` | Yes | Provides configuration options for the agent. |
| `./LLM` | Yes | Uses a large language model (LLM) to process messages. |
| `./SessionLogger` | Yes | Logs incoming and outgoing messages. |
| `./SkillLoader` | Yes | Loads skills for the agent. |
| `./SwarmProtocol` | Yes | Defines the protocol used by agents in the swarm. |

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
