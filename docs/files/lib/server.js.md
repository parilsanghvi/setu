---
source_hash: 5b6942279b762df7
facts_hash: c00c23a82f64ed32
generated_at: 2026-03-04T05:45:57.781Z
generator_version: 1.0.0
model: cheap
quality_score: 91
---
# File: lib/server.js

## Purpose
This file creates an instance of the `DashboardServer` class, which sets up an Express.js server to handle HTTP requests and establish a Socket.IO connection for real-time communication.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `DashboardServer` | cjs_default | Creates and configures a new instance of the DashboardServer class. |

## Internal Logic
The main execution flow involves creating an Express.js server, setting up routes using the `setupRoutes` method, establishing a Socket.IO connection with the `setupSocket` method, and starting the server when it's ready.

Key functions include:

* `constructor`: Initializes the instance with the specified port number (defaulting to 3000) and creates the Express.js server.
* `setupRoutes`: Calls the `setupRoutes` function from the `./routes` module, passing in the Express.js app and logger instances.
* `setupSocket`: Calls the `setupSocket` function from the `./socket` module, passing in the Socket.IO instance and logger instance.
* `start`: Listens for incoming requests on the specified port and logs a success message to the console when the server is ready.
* `stop`: Closes the Socket.IO connection, stops listening for incoming requests, and closes the HTTP server.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./Logger` | Yes | Provides logging functionality for the application. |
| `./routes` | Yes | Defines the routes for handling HTTP requests. |
| `./socket` | Yes | Establishes and manages real-time communication with clients using Socket.IO. |

## Side Effects
- env_access: The server may access environment variables, such as the PORT setting, to determine its port number.

## Dependents
No known dependents.

## Cross-References
- [Logger.js](./Logger.js.md)
- [routes.js](./routes.js.md)
- [socket.js](./socket.js.md)
