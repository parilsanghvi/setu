# tests/test-server-error-handling.js

## Purpose
This file is an integration test suite designed to verify that the API endpoints in `lib/server.js` and `index.js` handle server errors securely. Specifically, it tests that when an internal exception occurs during request processing, the server catches the error and returns a generic "Internal Server Error" (or similar safe error response) to the client, preventing the leakage of stack traces, internal paths, or sensitive environmental details.

## Exports
This file is an executable test script and does not export any functional components or modules to the rest of the application.

## Dependencies
- `node:test` for defining the tests.
- `node:assert` for validating response payloads and HTTP status codes.
- `http` to send real HTTP requests to the test server.
- The server modules being tested, particularly `lib/server.js`.
- It heavily mocks internal dependencies (like `express`, `socket.io`, or `lib/db`) using `Module.prototype.require` to force them to throw errors on demand.

## Side Effects
- Modifies the global `Module.prototype.require` during execution to simulate catastrophic failures in dependencies.
- Spawns a local HTTP server instance for the duration of the test.
