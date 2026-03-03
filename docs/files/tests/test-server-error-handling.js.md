## Purpose
The purpose of \`test-server-error-handling.js\` is to verify that internal server errors (500s) are caught properly and do not crash the running application process.

## Exports
- None.

## Dependencies
- Requires \`node:test\` module.
- Requires \`lib/server.js\` to evaluate the express application layer.

## Side Effects
- Spawns mocked server instances and forcibly throws errors within routes to check the application's stability.
