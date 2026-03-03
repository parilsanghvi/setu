---
source_hash: 88bfca5cf7048093
facts_hash: 9ec66264cb20f84e
generated_at: 2026-03-03T07:26:22.467Z
generator_version: 1.0.0
model: cheap
quality_score: 86
---
# File: lib/server.js

## Purpose
The lib/server.js file defines a class DashboardServer that sets up an Express.js server with Socket.IO support, routes, and logging functionality. The main role of this file is to create a dashboard server that listens on a specified port and handles incoming requests and connections. It also exports the DashboardServer class for use in other parts of the system.

| Export | Type | Description |
|--------|------|-------------|
| `DashboardServer` | cjs_default | Exports the DashboardServer class |

## Internal Logic
The main execution flow of this file is as follows:
- The constructor initializes the Express.js app, creates an HTTP server, and sets up Socket.IO.
- The setupRoutes method calls the setupRoutes function from another module, passing the app and logger instances.
- The setupSocket method calls the setupSocket function from another module, passing the io instance and logger instance.
- The start method listens for incoming connections on the specified port and logs a message when the server is running.
- The stop method cleans up any resources held by the server before shutting down.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./Logger` | Yes | Provides logging functionality |
| `./routes` | Yes | Handles incoming requests and returns a response |
| `./socket` | Yes | Sets up Socket.IO support |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
- [Logger.js](./Logger.js.md)
- [routes.js](./routes.js.md)
- [socket.js](./socket.js.md)
