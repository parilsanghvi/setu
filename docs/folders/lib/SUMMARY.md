---
source_hash: 726611f30fde23a2
facts_hash: 726611f30fde23a2
generated_at: 2026-03-03T08:00:11.854Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: lib

## Purpose
This folder contains various utilities and classes that form the core of a swarm-based system, responsible for managing tasks, agents, and data. It provides essential functionality for handling messages, updates, and database interactions.

## Key Files
| File | Role |
| Agent.js | Defines a persistent worker class in the swarm, handling messages and updates from the Orchestrator. |
| AgentContextManager.js | Manages the context of an agent, compacting and summarizing conversations to reduce memory usage. |
| AgentToolExecutor.js | Executes tools for CoreAgent instances, including built-in file tools and dynamically loaded skills. |
| Budget.js | Manages task budgets in an application, providing methods to check and record budget usage. |
| Camera.js | Manages browser instances and takes screenshots of URLs, storing them in a directory with task IDs as subdirectories. |
| Config.js | Loads and validates configuration settings from environment variables and a .env file, providing centralized access to these settings. |
| Context.js | Manages the context of an application, including reading and writing to files, logging activities, and enforcing permissions. |
| Contractor.js | Manages contracts, allowing users to issue new specs, record vetoes, and approve current specs. |
| CoreAgent.js | Represents an AI agent in a swarm environment, handling incoming requests, executing tasks, and interacting with other agents. |
| db.js | Serves as an event bus wrapper, managing database interactions and emitting events to various parts of the system. |
| Docker.js | Manages the Docker engine on a system, ensuring its availability and configuration. |
| LLM.js | Manages multiple language models, generating content using them through cascading fallbacks and rate limiting. |
| Logger.js | Provides logging functionality for different log levels and optional data, outputting logs to the console. |
| Pariksha.js | Runs test commands and enforces the TDD cycle, validating that code changes meet test requirements. |
| routes.js | Sets up routing configuration for an Express.js application, handling incoming requests and returning responses for various API endpoints. |
| server.js | Creates an Express.js server with Socket.IO support, setting up dashboard functionality and logging. |
| SessionLogger.js | Logs events asynchronously to a JSONL formatted file, ensuring consistent session IDs across the process lifetime. |
| SkillLoader.js | Loads and caches skills from a directory structure, filtering by tags and providing methods to retrieve individual skills. |
| socket.js | Sets up a socket connection for real-time communication between the client and server, emitting log history and forwarding chat messages. |
| SwarmProtocol.js | Defines a standardized workflow for task orchestration, including message types and constants used by the SwarmProtocol class. |
| utils.js | Provides functions to efficiently read the last N lines of a file without loading the entire file into memory, and estimate JSON string length of a value without serialization. |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: Follows single responsibility principle (SRP), where each file has one primary responsibility.
Likely: Adheres to modular design patterns, encapsulating related functionality within separate modules or files.
Likely: Utilizes standardized naming conventions for imports, exports, and variables to maintain consistency throughout the codebase.

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

