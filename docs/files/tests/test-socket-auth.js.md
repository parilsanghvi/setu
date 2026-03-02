# `tests/test-socket-auth.js`

## Purpose
This file contains unit tests for the `socketAuth` middleware (`lib/middleware/socketAuth.js`).

## What it does
- Validates that the socket authentication middleware properly handles various Edge cases and properly checks headers.
- Covers missing headers, malformed headers, invalid credentials, and valid credentials.

## Dependencies
- `node:test`
- `node:assert`
- `lib/middleware/socketAuth`
- `lib/auth/basic`
