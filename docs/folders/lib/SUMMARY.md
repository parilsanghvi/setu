---
source_hash: f1448e1b42cfb7d5
facts_hash: f1448e1b42cfb7d5
generated_at: 2026-02-25T12:38:13.995Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: lib

## Purpose
This lib folder contains various utility classes and tools for managing a swarm system, including task budgets, camera functionality, configuration settings, context management, contractor management, agent implementation, event bus handling, Docker containerization, Large Language Model generation, logging, testing, session logging, skill loading, and standardized workflow handoff protocols.

## Key Files
| File | Role |
|------|------|
| Agent.js | Handles tasks such as registering with the event bus, sending and receiving messages, and updating its status. |
| Budget.js | Manages task budgets in the system, providing methods to check if a task has budget remaining and recording usage of tokens. |
| Camera.js | Captures screenshots of web pages using the Playwright library for automated testing and verification purposes. |
| Config.js | Loads and validates configuration settings from environment variables, storing them as properties of an instance. |
| Context.js | Manages the context of an application, allowing agents to read and write to specific directories while enforcing permission checks. |
| Contractor.js | Manages a set of contracts, providing methods for issuing new spec drafts, recording vetoes, approving specs, and retrieving the current state of a contract. |
| CoreAgent.js | Serves as the core implementation for an agent in a swarm system, handling tasks such as skill loading, tool management, and interaction with other agents and users. |
| db.js | Handles messaging, task updates, and agent heartbeats using the event bus wrapper. |
| Docker.js | Enables sandboxing and runs processes inside containers, allowing for environment variable management, mount point configuration, and network isolation. |
| LLM.js | Generates content using a specific model alias or provider type, implementing cascading fallback to expensive -> cheap -> cooldown wait -> retry cheap models. |
| Logger.js | Provides logging functionality, allowing developers to log different types of messages at various levels such as info, warn, error, and debug. |
| Pariksha.js | Runs tests and enforces a Test-Driven Development (TDD) cycle to ensure that test-driven code is implemented correctly. |
| server.js | Sets up an Express server to handle requests and provides various APIs for the dashboard. |
| SessionLogger.js | Logs events in a session-based system, storing them in a JSONL file with a unique filename per session. |
| SkillLoader.js | Loads and caches skills from a directory, filtering them by tags, and providing access to individual skills. |
| SwarmProtocol.js | Provides a standardized workflow handoff protocol for task orchestration, including message types and constants for tasks, status updates, and helper functions. |
| utils.js | Efficiently reads the last N lines of a file without loading the entire file into memory using the `readLastLines` function. |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: The event bus wrapper in db.js should be thread-safe to prevent data corruption.
Likely: All logging functions in Logger.js should log messages at the level specified, ensuring consistent and reliable logging throughout the system.
Likely: The `createMessage` function in SwarmProtocol.js should handle edge cases such as invalid message types or missing metadata.

## Cross-References
- [auth/](./auth/SUMMARY.md)
- [llm/](./llm/SUMMARY.md)
- [middleware/](./middleware/SUMMARY.md)
- [models/](./models/SUMMARY.md)
- [onboarding/](./onboarding/SUMMARY.md)
- [utils/](./utils/SUMMARY.md)
- [Agent.js](../../files/lib/Agent.js.md)
- [Budget.js](../../files/lib/Budget.js.md)
- [Camera.js](../../files/lib/Camera.js.md)
- [Config.js](../../files/lib/Config.js.md)
- [Context.js](../../files/lib/Context.js.md)
- [Contractor.js](../../files/lib/Contractor.js.md)
- [CoreAgent.js](../../files/lib/CoreAgent.js.md)
- [db.js](../../files/lib/db.js.md)
- [Docker.js](../../files/lib/Docker.js.md)

