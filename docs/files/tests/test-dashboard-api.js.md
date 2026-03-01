---
description: "Integration tests for the DashboardServer API endpoints."
---

# `tests/test-dashboard-api.js`

## Purpose
This file contains the core integration tests for the `DashboardServer`. The tests are designed to verify the correct functionality of key API endpoints provided by the backend application to the frontend web interface.

Key endpoints tested include:
- `/api/tasks`: To ensure tasks can be correctly retrieved and manipulated via the REST interface.
- `/api/chat`: To verify that user chat interactions are processed correctly and returned as expected.
- **WebSocket connections**: The file tests real-time data flow using Socket.IO connections, verifying that log updates and agent state broadcasts happen correctly over the websocket.

These integration tests are crucial for ensuring the stability of the communication layer between the React frontend and the Express backend before changes are merged.

## Exports
None. This file runs as a standalone test script.

## Dependencies
- `express`
- `socket.io-client`
- `lib/server.js`

## Side Effects
Spawns a mock backend web server and websocket during execution and cleans them up.
