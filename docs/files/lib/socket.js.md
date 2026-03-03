# `lib/socket.js`

## Purpose
This module handles all WebSocket interactions for the Mission Control dashboard. It sets up Socket.IO events, handles connection lifecycle, and streams real-time updates (logs, chat messages, agent status, and task updates) to connected clients.

## Exports
- `setupSocket(io, logger)`: A function that attaches WebSocket handlers to the provided `io` server instance and begins monitoring background updates. It returns a context object containing handles for timeouts, watchers, and intervals so they can be cleaned up on server shutdown.

## Dependencies
- `./db`: For reading agent/task statuses and listening to broadcast messages from the local event bus.
- `./utils`: Specifically `readLastLines` for initializing the log tail on fresh connections.
- `fs` & `path`: Used to monitor changes to the main log file (`setu.log`).

## Side Effects
- Mutates the provided `io` server object by adding connection handlers.
- Initiates an `fs.watch` on `setu.log` which remains active in the background.
- Sets up a recurrent `setInterval` to poll the database and emit updates to clients.
- Listens to the shared `db` event bus for 'chat' messages and forwards them over WebSockets.
