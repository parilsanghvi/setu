---
description: Tests for checking error handling across DashboardServer routes
---

# test-server-error-handling.js
Tests that verify the DashboardServer properly captures errors, prevents sensitive stack traces from leaking to the frontend, and handles generic HTTP server errors.

## Purpose
This file tests the error handling capabilities of the backend HTTP server. It specifically verifies that internal application exceptions do not leak stack traces to clients, maintaining security boundaries, and that the server returns a proper HTTP status code like `500 Internal Server Error`.

## Exports
This file does not export any functions. It is a standalone script used by the test runner.

## Dependencies
- `node:http` or `supertest` for making requests to the API.
- `lib/server.js` to instantiate the application for testing.

## Side Effects
- Spawns a temporary `DashboardServer` on an available port.
- Closes the server and releases the port after completion.
