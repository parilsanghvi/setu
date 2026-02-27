---
source_hash: d0f9deb20ba1f5c7
facts_hash: 476415dc08dbaec5
generated_at: 2026-02-25T12:12:45.808Z
generator_version: 1.0.0
model: cheap
quality_score: 90
---
# File: lib/server.js

## Purpose
This file defines a class called `DashboardServer` that sets up an Express server to handle requests and provides various APIs for the dashboard, including authentication, onboarding status, tasks, agents, and chat functionality.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `/screenshots` | middleware-static | Serves screenshots securely |
| `/api/onboarding` | function | Returns onboarding status |
| `/api/onboarding-trend` | function | Returns historical trend data for onboarding |
| `/api/drift-trend` | function | Returns drift trend data for onboarding |
| `/api/stats` | function | Returns dashboard statistics |
| `/api/tasks` | function | Returns list of tasks |
| `/api/agents` | function | Returns list of agents |
| `/api/create-task` | function | Creates a new task |
| `/api/get-screenshots-for-task` | function | Returns screenshots for a task |
| `/api/chat` | function | Handles chat requests from users |
| `http.createServer()` | cjs_default | Creates an HTTP server to handle incoming requests |

## Internal Logic
The main execution flow of this file is as follows:
- The constructor sets up the Express server, creates an HTTP server, and initializes various components.
- The `setupRoutes` method defines various routes for the API endpoints, including authentication, onboarding status, tasks, agents, and chat functionality.
- The `setupSocket` method sets up a socket connection to handle real-time updates.

Key functions:
- `setupRoutes`: Defines various API routes.
- `setupSocket`: Sets up a socket connection to handle real-time updates.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `express` | No | Provides the Express framework for building web applications |
| `http` | No | Provides the HTTP module for creating an HTTP server |
| `helmet` | No | Provides security headers to protect against common web attacks |
| `fs` | No | Provides file system utilities, including reading files and watching for changes |
| `path` | No | Provides path manipulation utilities, including resolving paths and checking if a file exists |
| `socket.io` | No | Provides real-time communication between clients and servers through WebSockets |

## Side Effects
- console_output: The `console.error()` function is used to log errors in the console.
- database: Various database queries are executed using the `db.db.prepare()` method, including retrieving agent counts, task counts, and updating tasks.
- filesystem_read: The `fs.watch()` function is used to watch for changes to log files, and the `fs.statSync()` function is used to read file sizes.

## Dependents
No known dependents.

## Cross-References
- [db.js](./db.js.md)
- [Logger.js](./Logger.js.md)
- [auth.js](./middleware/auth.js.md)
- [governance-profiles.js](./onboarding/governance-profiles.js.md)
- [paths.js](./onboarding/paths.js.md)
- [status.js](./onboarding/status.js.md)
- [utils.js](./utils.js.md)
