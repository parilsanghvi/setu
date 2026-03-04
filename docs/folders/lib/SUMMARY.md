---
source_hash: e46bf2405abf1013
facts_hash: e46bf2405abf1013
generated_at: 2026-03-04T10:14:34.709Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: lib

## Purpose
This folder contains a collection of modules that form the backbone of a swarm system, responsible for managing agents, tools, budgets, cameras, and other essential components. The key responsibilities include handling user authentication, session management, tool execution, budget tracking, camera automation, configuration loading, context management, contract specification management, core agent creation, database interaction, Docker management, LLM generation, logging, TDD cycle validation, route setup, server initialization, session logging, skill loading, WebSocket connection establishment, and standardized workflow handoff protocol implementation.

## Key Files
| File | Role |
|------|------|
| Agent.js | Manages agent persistence, incoming message handling, and response sending |
| AgentContextManager.js | Estimates token count and compacts context for Core Agents |
| AgentToolExecutor.js | Executes tools for CoreAgents with schema validation and delegation |
| Budget.js | Tracks task budgets, usage, and cost alerts |
| Camera.js | Automates screenshots of web pages using Chromium browser |
| Config.js | Loads environment variables from .env file for configuration |
| Context.js | Manages context files, logs agent activities, and enforces permissions |
| Contractor.js | Issues new contracts, records vetoes, and approves specs |
| CoreAgent.js | Creates, manages, and processes Core Agent instances |
| db.js | Serves as an event bus wrapper with database interactions |
| Docker.js | Manages the Docker engine, detecting presence, checking availability |
| LLM.js | Implements cascading fallback mechanism for AI model generation |
| Logger.js | Logs events in various levels with customizable messages and arguments |
| Pariksha.js | Validates TDD cycles by running test commands and ensuring tests pass |
| routes.js | Sets up Express.js application routes for onboarding, historical trend, etc. |
| server.js | Initializes an Express.js server with Socket.IO connection establishment |
| SessionLogger.js | Logs events in asynchronous manner, storing them in JSONL format |
| SkillLoader.js | Loads, caches, and filters skills from the skills directory |
| socket.js | Establishes WebSocket connections for log streaming and message forwarding |
| SwarmProtocol.js | Defines standardized workflow handoff protocol constants and messages |
| utils.js | Provides efficient file reading and JSON length estimation functions |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: Follows the principle of Separation of Concerns (SoC) in each module to minimize dependencies.
Likely: Adheres to standard JavaScript coding conventions for variable naming, indentation, and formatting.
Likely: Utilizes modular design patterns such as encapsulation and abstraction to maintain code organization.

## Cross-References
- [auth/](./auth/SUMMARY.md)
- [llm/](./llm/SUMMARY.md)
- [middleware/](./middleware/SUMMARY.md)
- [models/](./models/SUMMARY.md)
- [onboarding/](./onboarding/SUMMARY.md)
- [routes/](./routes/SUMMARY.md)
- [sockets/](./sockets/SUMMARY.md)
- [utils/](./utils/SUMMARY.md)
- [Agent.js](../../files/lib/Agent.js.md)
- [AgentContextManager.js](../../files/lib/AgentContextManager.js.md)
- [AgentToolExecutor.js](../../files/lib/AgentToolExecutor.js.md)
- [Budget.js](../../files/lib/Budget.js.md)
- [Camera.js](../../files/lib/Camera.js.md)
- [Config.js](../../files/lib/Config.js.md)
- [Context.js](../../files/lib/Context.js.md)

