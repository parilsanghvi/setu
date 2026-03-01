---
title: Test Server Error Handling
description: "Integration tests verifying generic error handling in the API."
---

# \`tests/test-server-error-handling.js\`

## Purpose
This script validates that the \`DashboardServer\` appropriately catches uncaught exceptions in its route handlers and returns a generic 500 error response instead of leaking internal implementation details (e.g., stack traces) to the client.

## Tests
- Triggers a deliberate error in an API endpoint and asserts that the HTTP response body masks the underlying exception.

## Dependencies
- \`supertest\`: Used to simulate HTTP requests against the running Express application.
