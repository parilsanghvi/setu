# `tests/test-dashboard-api.js`

## Purpose
Tests the dashboard API endpoints to ensure they function properly.

## What it does
- Starts an instance of the dashboard server in test mode.
- Simulates requests to various endpoints including `/api/chat`.
- Validates the responses against expected results.

## Dependencies
- `node:test`
- `node:assert`
- `express`
- `lib/server`
