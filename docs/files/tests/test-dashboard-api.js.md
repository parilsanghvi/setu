# tests/test-dashboard-api.js

## Purpose
This file contains integration tests for the Dashboard API exposed by `lib/server.js` (and unified in `index.js`). It verifies that the various API endpoints (like `/api/stats`, `/api/tasks`, `/api/agents`, `/api/onboarding`, and `/api/chat`) respond correctly and handle security requirements appropriately. It ensures that the basic frontend dashboard backend endpoints return expected data formats.

## Exports
This file is a test script and does not export any modules. It executes tests using the built-in `node:test` module and assertions.

## Dependencies
- `node:test` for structuring the test suite and assertions.
- `node:assert` for making assertions.
- `http` for making requests to the locally spawned server.
- `lib/server.js` (DashboardServer) to spin up the actual API server for testing.
- It also uses `Module.prototype.require` interception to mock `lib/db` and `lib/utils` to prevent side effects and ensure isolated testing.

## Side Effects
- Spawns a local HTTP server instance binding to a port (usually `3002`) during test execution.
- Modifies the `Module.prototype.require` temporarily to inject mock dependencies, which is restored after tests run.
