# \`tests/test-security-error-handling.js\`

## Purpose
This file verifies that API endpoints in the Dashboard server return generic error messages instead of leaking internal exception details during server failures.
It tests all configured endpoints by mocking the dependencies and asserting the response bodies and status codes. This ensures that no sensitive stack traces are exposed to external users. It also specifically verifies that `lib/Logger` captures the error payload without sending it over the wire.

## Exports
None.

## Dependencies
- \`express\`
- \`socket.io\`
- \`supertest\`
- \`../lib/server.js\`

## Side Effects
None.

