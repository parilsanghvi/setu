---
title: test-server-error-handling.js
description: Security and resilience tests for server error handling.
---
# tests/test-server-error-handling.js

## Purpose
This script validates that the DashboardServer API endpoints do not leak internal exception details to the client during unexpected failures. It specifically tests that a generic 'Internal Server Error' (500) is returned to the user, while ensuring that the detailed error object or stack trace is safely logged server-side via `Logger.js`.

## Exports
This script is a standalone test module and exports nothing.

## Dependencies
- `node:assert`: Built-in assertions.
- `node:module`: Used to intercept and mock `require` calls.
- `lib/server.js`: Target module under test.

## Side Effects
- Injects a mock implementation for `express` and `socket.io` globally within the context of this test file.
- Captures `console.error` output to verify logging behavior without polluting standard output.
