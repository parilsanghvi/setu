---
description: Tests for checking error handling across DashboardServer routes
---

# test-server-error-handling.js
Tests that verify the DashboardServer properly captures errors, prevents sensitive stack traces from leaking to the frontend, and handles generic HTTP server errors.

## Purpose
This file tests the error handling capabilities of the backend HTTP server. It specifically verifies that internal application exceptions do not leak stack traces to clients, maintaining security boundaries, and that the server returns a proper HTTP status code like `500 Internal Server Error`.

## Key Components
- Sends invalid data or simulates broken routes.
- Asserts that the response body does not contain Node.js stack traces.
- Validates the JSON error payload structure.

## Important Notes
If a route is added or error formatting logic changes in `lib/server.js`, this file must be updated to guarantee that the application remains secure against information disclosure.
