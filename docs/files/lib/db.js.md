---
source_hash: efd160080979dce0
facts_hash: 368fee760832b371
generated_at: 2026-03-04T06:48:13.517Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: lib/db.js

## Purpose
This file exports a single class, `Bus`, which serves as an event bus wrapper for the system. It provides methods to send and receive messages between different components of the system, including tasks, agents, and users. The `Bus` class also manages the database interactions and provides optimized getters for frequently accessed data.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Bus` | cjs_instance | 
| `deleteTask` | method | Deletes a task from the database |
| `getAgents` | method | Returns a list of all agents in the system |
| `getChatHistory` | method | Retrieves the chat history for a given agent and user |
| `getDeadAgents` | method | Finds dead agents (agents with no heartbeat) in the system |
| `getNewMessages` | method | Fetches new messages from the database since the last ID |
| `getTaskMeta` | method | Returns task metadata, including updated_at and attempts |
| `getTasks` | method | Retrieves a list of all tasks in the system |
| `getUnread` | method | Returns unread messages for a given recipient or 'ALL' |
| `heartbeat` | method | Sends an agent heartbeat to the database |
| `markRead` | method | Marks messages as read by setting their read_at timestamp |
| `send` | method | Sends a message to the database and broadcasts it to subscribers |
| `updateTask` | method | Updates a task in the database and broadcasts a 'TASK_DONE' event |

## Internal Logic
The main execution flow of this file is as follows:

1. The constructor initializes the `Bus` instance with a new database connection.
2. The `send` method prepares and executes an SQL statement to insert or update a message in the database, and then broadcasts the message to subscribers using an event emitter.
3. The `get*` methods (e.g., `getAgents`, `getChatHistory`) prepare and execute cached SQL statements to retrieve data from the database.
4. The `updateTask` method updates a task in the database and broadcasts a 'TASK_DONE' event if the task is marked as DONE.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `better-sqlite3` | No | Provides an efficient SQL database connection |
| `events` | Yes | Enables event emission for message broadcasting |
| `fs` | No | 
| `os` | No | 

## Side Effects
- console_output: The `Bus` instance logs debug messages to the console when in verbose mode.
- database: The `Bus` instance interacts with the SQLite database to store and retrieve data, including tasks, agents, and messages.
- env_access: The `Bus` instance accesses environment variables to determine the log level.
- filesystem_read: The `Bus` instance reads files from the file system when initializing the database connection and accessing configuration files.
- filesystem_write: The `Bus` instance writes to files on the file system when logging debug messages or storing data in the database.
- network: No network interactions occur with this module, as it only interacts with the SQLite database and console output.

## Dependents
- [index.js](../index.js.md)
- [Agent.js](./Agent.js.md)
- [Budget.js](./Budget.js.md)
- [routes.js](./routes.js.md)
- [socket.js](./socket.js.md)

## Cross-References
- [index.js](../index.js.md)
- [Agent.js](./Agent.js.md)
- [Budget.js](./Budget.js.md)
- [routes.js](./routes.js.md)
- [socket.js](./socket.js.md)


## Symbol Dependencies

### Upstream (Internal Calls)

| Symbol | Source File | Doc |
| --- | --- | --- |
| `get` | `lib/Config.js` | [Doc](./Config.js.md) |
| `log` | `lib/Context.js` | [Doc](./Context.js.md) |
| `run` | `lib/Docker.js` | [Doc](./Docker.js.md) |
| `error` | `lib/Logger.js` | [Doc](./Logger.js.md) |
| `warn` | `lib/Logger.js` | [Doc](./Logger.js.md) |
| `log` | `lib/SessionLogger.js` | [Doc](./SessionLogger.js.md) |
| `get` | `lib/SkillLoader.js` | [Doc](./SkillLoader.js.md) |
| `prepare` | `tests/test-db-caching.js` | [Doc](../tests/test-db-caching.js.md) |
| `run` | `tests/test-doc-quality-gate.js` | [Doc](../tests/test-doc-quality-gate.js.md) |
| `error` | `tests/test-security-error-handling.js` | [Doc](../tests/test-security-error-handling.js.md) |
| `error` | `tests/test-server-error-handling.js` | [Doc](../tests/test-server-error-handling.js.md) |
| `emit` | `tests/test-server.js` | [Doc](../tests/test-server.js.md) |
| `log` | `tests/test-token-estimation.js` | [Doc](../tests/test-token-estimation.js.md) |

### Downstream (Impacted By)

| Symbol | Caller File | Doc |
| --- | --- | --- |
| `heartbeat` | `agents/Guru.js` | [Doc](../agents/Guru.js.md) |
| `heartbeat` | `agents/Koshpal.js` | [Doc](../agents/Koshpal.js.md) |
| `heartbeat` | `agents/Rakshak.js` | [Doc](../agents/Rakshak.js.md) |
| `if` | `agents/Rakshak.js` | [Doc](../agents/Rakshak.js.md) |
| `heartbeat` | `agents/Shilpi.js` | [Doc](../agents/Shilpi.js.md) |
| `updateTask` | `agents/Sutradhar.js` | [Doc](../agents/Sutradhar.js.md) |
| `heartbeat` | `agents/Tark.js` | [Doc](../agents/Tark.js.md) |
| `updateTask` | `agents/TestDrona.js` | [Doc](../agents/TestDrona.js.md) |
| `heartbeat` | `agents/Vishwakarma.js` | [Doc](../agents/Vishwakarma.js.md) |
| `if` | `benchmarks/log_benchmark.js` | [Doc](../benchmarks/log_benchmark.js.md) |
| `send` | `bin/setu-init.js` | [Doc](../bin/setu-init.js.md) |
| `if` | `frontend/app/src/App.jsx` | [Doc](../frontend/app/src/App.jsx.md) |
| `if` | `frontend/app/src/components/OnboardingStatus.jsx` | [Doc](../frontend/app/src/components/OnboardingStatus.jsx.md) |
| `if` | `frontend/app/src/components/ScreenshotGallery.jsx` | [Doc](../frontend/app/src/components/ScreenshotGallery.jsx.md) |
| `if` | `frontend/app/src/components/TaskDetailModal.jsx` | [Doc](../frontend/app/src/components/TaskDetailModal.jsx.md) |
| `getAgents` | `index.js` | [Doc](../index.js.md) |
| `getDeadAgents` | `index.js` | [Doc](../index.js.md) |
| `getNewMessages` | `index.js` | [Doc](../index.js.md) |
| `getTaskMeta` | `index.js` | [Doc](../index.js.md) |
| `getTasks` | `index.js` | [Doc](../index.js.md) |
| `send` | `index.js` | [Doc](../index.js.md) |
| `updateTask` | `index.js` | [Doc](../index.js.md) |
| `getUnread` | `lib/Agent.js` | [Doc](./Agent.js.md) |
| `heartbeat` | `lib/Agent.js` | [Doc](./Agent.js.md) |
| `markRead` | `lib/Agent.js` | [Doc](./Agent.js.md) |
| `send` | `lib/Agent.js` | [Doc](./Agent.js.md) |
| `if` | `lib/Context.js` | [Doc](./Context.js.md) |
| `if` | `lib/Contractor.js` | [Doc](./Contractor.js.md) |
| `heartbeat` | `lib/CoreAgent.js` | [Doc](./CoreAgent.js.md) |
| `if` | `lib/llm/BaseProvider.js` | [Doc](./llm/BaseProvider.js.md) |
| `send` | `lib/middleware/auth.js` | [Doc](./middleware/auth.js.md) |
| `if` | `lib/onboarding/codeowners.js` | [Doc](./onboarding/codeowners.js.md) |
| `if` | `lib/onboarding/dependency-engine.js` | [Doc](./onboarding/dependency-engine.js.md) |
| `send` | `lib/onboarding/doc-facts.js` | [Doc](./onboarding/doc-facts.js.md) |
| `if` | `lib/onboarding/paths.js` | [Doc](./onboarding/paths.js.md) |
| `deleteTask` | `lib/routes.js` | [Doc](./routes.js.md) |
| `send` | `lib/routes.js` | [Doc](./routes.js.md) |
| `updateTask` | `lib/routes.js` | [Doc](./routes.js.md) |
| `send` | `lib/routes/api.js` | [Doc](./routes/api.js.md) |
| `updateTask` | `lib/routes/api.js` | [Doc](./routes/api.js.md) |
| `if` | `lib/server.js` | [Doc](./server.js.md) |
| `if` | `scripts/ignite.js` | [Doc](../scripts/ignite.js.md) |
| `send` | `scripts/ignite.js` | [Doc](../scripts/ignite.js.md) |
| `if` | `tests/test-agent-error-handling.js` | [Doc](../tests/test-agent-error-handling.js.md) |
| `if` | `tests/test-agent.js` | [Doc](../tests/test-agent.js.md) |
| `send` | `tests/test-api-auth.js` | [Doc](../tests/test-api-auth.js.md) |
| `if` | `tests/test-auth-store-save-failure.js` | [Doc](../tests/test-auth-store-save-failure.js.md) |
| `if` | `tests/test-auth-store.js` | [Doc](../tests/test-auth-store.js.md) |
| `if` | `tests/test-budget.js` | [Doc](../tests/test-budget.js.md) |
| `if` | `tests/test-context.js` | [Doc](../tests/test-context.js.md) |
| `if` | `tests/test-contractor.js` | [Doc](../tests/test-contractor.js.md) |
| `getAgents` | `tests/test-core-db-stress.js` | [Doc](../tests/test-core-db-stress.js.md) |
| `getTasks` | `tests/test-core-db-stress.js` | [Doc](../tests/test-core-db-stress.js.md) |
| `heartbeat` | `tests/test-core-db-stress.js` | [Doc](../tests/test-core-db-stress.js.md) |
| `updateTask` | `tests/test-core-db-stress.js` | [Doc](../tests/test-core-db-stress.js.md) |
| `if` | `tests/test-core-server-routes.js` | [Doc](../tests/test-core-server-routes.js.md) |
| `new` | `tests/test-core-server-routes.js` | [Doc](../tests/test-core-server-routes.js.md) |
| `getAgents` | `tests/test-db-caching.js` | [Doc](../tests/test-db-caching.js.md) |
| `getDeadAgents` | `tests/test-db-caching.js` | [Doc](../tests/test-db-caching.js.md) |
| `getNewMessages` | `tests/test-db-caching.js` | [Doc](../tests/test-db-caching.js.md) |
| `getTaskMeta` | `tests/test-db-caching.js` | [Doc](../tests/test-db-caching.js.md) |
| `getTasks` | `tests/test-db-caching.js` | [Doc](../tests/test-db-caching.js.md) |
| `getChatHistory` | `tests/test-db.js` | [Doc](../tests/test-db.js.md) |
| `getDeadAgents` | `tests/test-db.js` | [Doc](../tests/test-db.js.md) |
| `getTaskMeta` | `tests/test-db.js` | [Doc](../tests/test-db.js.md) |
| `getTasks` | `tests/test-db.js` | [Doc](../tests/test-db.js.md) |
| `getUnread` | `tests/test-db.js` | [Doc](../tests/test-db.js.md) |
| `heartbeat` | `tests/test-db.js` | [Doc](../tests/test-db.js.md) |
| `markRead` | `tests/test-db.js` | [Doc](../tests/test-db.js.md) |
| `send` | `tests/test-db.js` | [Doc](../tests/test-db.js.md) |
| `updateTask` | `tests/test-db.js` | [Doc](../tests/test-db.js.md) |
| `getDeadAgents` | `tests/test-dead-agents.js` | [Doc](../tests/test-dead-agents.js.md) |
| `heartbeat` | `tests/test-dead-agents.js` | [Doc](../tests/test-dead-agents.js.md) |
| `updateTask` | `tests/test-dictator.js` | [Doc](../tests/test-dictator.js.md) |
| `send` | `tests/test-doc-quality-gate.js` | [Doc](../tests/test-doc-quality-gate.js.md) |
| `if` | `tests/test-events.js` | [Doc](../tests/test-events.js.md) |
| `send` | `tests/test-events.js` | [Doc](../tests/test-events.js.md) |
| `if` | `tests/test-json-parser.js` | [Doc](../tests/test-json-parser.js.md) |
| `if` | `tests/test-log-reader.js` | [Doc](../tests/test-log-reader.js.md) |
| `if` | `tests/test-logger.js` | [Doc](../tests/test-logger.js.md) |
| `if` | `tests/test-models-config.js` | [Doc](../tests/test-models-config.js.md) |
| `if` | `tests/test-pariksha-security.js` | [Doc](../tests/test-pariksha-security.js.md) |
| `if` | `tests/test-session-logger.js` | [Doc](../tests/test-session-logger.js.md) |
| `if` | `tests/test-steering.js` | [Doc](../tests/test-steering.js.md) |
| `send` | `tests/test-steering.js` | [Doc](../tests/test-steering.js.md) |
| `if` | `tests/test-tasks-api.js` | [Doc](../tests/test-tasks-api.js.md) |
| `heartbeat` | `tests/verify-index-broadcast.js` | [Doc](../tests/verify-index-broadcast.js.md) |
| `if` | `tests/verify-log-watch.js` | [Doc](../tests/verify-log-watch.js.md) |
| `if` | `tests/verify-proto-pollution.js` | [Doc](../tests/verify-proto-pollution.js.md) |
| `updateTask` | `tests/verify-task-escalation.js` | [Doc](../tests/verify-task-escalation.js.md) |
