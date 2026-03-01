# tests/test-server-error-handling.js

Tests to ensure the dashboard server handles exceptions securely. Verifies that API endpoints and web sockets return generic error responses and do not leak internal stack traces to the client.

## Purpose
Ensures error stack traces are safely hidden from clients in the dashboard API layer.

## Exports
None.

## Dependencies
Depends on the express framework and socket server mock.

## Side Effects
Spawns and mocks HTTP servers.
