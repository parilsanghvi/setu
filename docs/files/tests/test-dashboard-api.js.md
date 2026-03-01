---
description: Integration tests for the DashboardServer API endpoints
---

# test-dashboard-api.js
Integration tests for the DashboardServer API endpoints ensuring correct HTTP responses and data fetching.

## Purpose
This file runs integration tests against the `DashboardServer` to ensure that API endpoints function correctly when queried. It simulates real requests and verifies that the output structure, data types, and status codes match the expected behavior.

## Exports
This file does not export any functions. It is a standalone script used by the test runner.

## Dependencies
- `node:http` or `supertest` for making requests to the API.
- `lib/server.js` to instantiate the application for testing.

## Side Effects
- Spawns a temporary `DashboardServer` on an available port.
- Closes the server and releases the port after completion.
