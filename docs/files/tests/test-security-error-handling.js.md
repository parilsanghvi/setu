---
description: Tests for checking secure error handling across DashboardServer routes
---

# test-security-error-handling.js
Tests that verify the DashboardServer properly handles exceptions without leaking sensitive server information.

## Purpose
Ensure that unexpected backend exceptions or malicious inputs result in generic client-facing error messages instead of leaking `node` runtime stack traces.

## Exports
This file does not export any functions. It is a test runner script.

## Dependencies
- Custom test runner utilities.
- Target code dependencies in `lib/server.js`.

## Side Effects
- Starts the backend server and shuts it down.
