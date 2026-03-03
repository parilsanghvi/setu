## Purpose
The purpose of \`test-dashboard-api.js\` is to execute integration and unit tests for the main Dashboard API routes.

## Exports
- Standard test file, does not export modules.

## Dependencies
- Depends on the \`node:test\` native testing framework.
- Depends on the local server module \`lib/server.js\` and HTTP request libraries.

## Side Effects
- Starts an in-memory or actual server instance to verify API responses. May read/write to an isolated sqlite database during test execution.
