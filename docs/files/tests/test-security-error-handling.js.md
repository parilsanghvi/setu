# tests/test-security-error-handling.js

## Purpose
Validates that API endpoints in `lib/server.js` do not leak sensitive error details (e.g., stack traces) in 500 responses, instead returning a generic "Internal Server Error". This prevents information disclosure vulnerabilities when unexpected exceptions occur during runtime.

## Exports
This file is a standalone test script and does not export any modules or variables for external use.

## Dependencies
- `node:test` for test definitions.
- `node:assert` for assertions.
- Uses `Module.prototype.require` interception to mock `express` and `socket.io` to isolate the server logic.

## Side Effects
- Mocks internal modules during execution.
- Writes to `console.log` for standard test output verification.
