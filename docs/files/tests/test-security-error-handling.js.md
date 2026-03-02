# File: tests/test-security-error-handling.js

**Purpose:** Validates that API endpoints in `lib/server.js` do not leak sensitive error details (e.g., stack traces) in 500 responses, instead returning a generic "Internal Server Error".

**Key Exports/Entrypoints:**
- Standalone test script executed via `node`.

**Side Effects:**
- Mocks `express` and `socket.io` modules.
- Writes to `console.log` for test output.

## Purpose
Tests the dashboard server to ensure that internal application errors are caught and a generic error response is provided instead of returning sensitive stack traces.

## Exports
- None

## Dependencies
- \`supertest\`: Used to simulate HTTP requests against the running Express application.

## Side Effects
- None
