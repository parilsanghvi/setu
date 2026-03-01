# `tests/test-server-error-handling.js`

## Purpose
Tests error handling in the `lib/server.js` file.

## What it does
- Validates that errors within the server don't crash the server.
- Verifies proper generic responses are sent to clients without leaking sensitive stack traces.

## Dependencies
- `node:test`
- `node:assert`
