---
source_hash: d50b0f9a086cd5c4
facts_hash: e6ec1d329810dccb
generated_at: 2026-03-04T05:33:16.041Z
generator_version: 1.0.0
model: cheap
quality_score: 83
---
# File: index.js

## Purpose
This file serves as the main entry point for a web server, handling incoming requests and providing APIs for managing dashboard features. It initializes the Express.js framework, sets up security middleware, and defines API endpoints for tasks, agents, and sessions.

## Exports / API Surface

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `app` | function | `` | Initializes the Express.js framework |
| `io` | object | `{}` | Sets up Socket.IO connections |
| `server` | function | `` | Creates an HTTP server for handling requests |

## Internal Logic

The main execution flow of this file involves initializing the Express.js framework, setting up security middleware, and defining API endpoints. Key functions include:

- The `app.use()` method chain: This sets up security headers, CORS, authentication, body parsing, static file serving, and socket authentication for the application.
- The `io.on('connection')` event listener: This establishes a connection to Socket.IO clients.
- The `bus.updateTask()`, `bus.db.prepare()`, and `bus.send()` methods: These interact with the database and send messages over the bus.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| `dotenv` | Yes | Loads environment variables from a .env file |
| `express` | No | Provides a web framework for handling requests |
| `fs` | No | Provides functions for interacting with the file system |
| `http` | No | Provides an HTTP server for handling requests |
| `path` | No | Provides utilities for working with file paths |
| `readline` | No | Provides a way to read input from users |
| `socket.io` | No | Provides a library for real-time communication over websockets |

## Side Effects

- console_output: Writing logs and error messages to the console.
- database: Reading and writing data to the database, including tasks, agents, and sessions.
- env_access: Loading environment variables from a .env file.
- filesystem_read: Reading files from the file system for serving static assets.
- filesystem_write: Writing logs and error messages to the file system in logStream.
- network: Establishing connections to Socket.IO clients and sending data over the bus.
- process_control: Updating task status, interrupting processes, and redirecting agents.
- subprocess: Running external commands using child_process.fork().

## Dependents
No known dependents.

## Cross-References
- [db.js](./lib/db.js.md)
- [auth.js](./lib/middleware/auth.js.md)
- [socketAuth.js](./lib/middleware/socketAuth.js.md)
- [governance-profiles.js](./lib/onboarding/governance-profiles.js.md)
- [paths.js](./lib/onboarding/paths.js.md)
- [status.js](./lib/onboarding/status.js.md)
- [utils.js](./lib/utils.js.md)
