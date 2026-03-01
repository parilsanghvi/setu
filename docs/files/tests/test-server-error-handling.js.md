---
type: file
---

# test-server-error-handling.js

## Purpose
Tests the dashboard server's error handling to ensure error details aren't leaked.

## Exports
- None

## Dependencies
- node:test
- node:assert
- ../lib/server.js
- proxyquire (mocking express)

## Side Effects
- Uses in-memory database to prevent modifying real DB state.
