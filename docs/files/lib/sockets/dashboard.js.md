## Purpose
The `dashboard.js` file handles real-time WebSocket communication for the dashboard server. It abstracts the `socket.io` event handling, log file streaming, and database polling mechanisms from the main `server.js` file.

## Exports
This module exports a class `DashboardSocket` which encapsulates the setup and teardown logic for the dashboard socket connections.

## Dependencies
- `path`: Built-in Node module used to locate files for streaming.
- `fs`: Built-in Node module used to establish file watchers and streams for logging output.
- `db`: The core SQLite database interface used to retrieve task and agent state for emitting to clients.
- `utils`: Utility function `readLastLines` used to fetch the initial log tail when a user first connects.

## Side Effects
Mutates the `io` instance by adding connection and message listeners. Initializes a long-running `fs.watch` process and a polling timer via `setInterval` which poll the SQLite database in the background to update the connected clients.
