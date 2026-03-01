---
title: test-dashboard-api.js
description: Integration tests for the Dashboard API.
---
# tests/test-dashboard-api.js

## Purpose
The purpose of this file is to verify the core API endpoints exposed by the DashboardServer. This ensures endpoints like GET `/api/tasks` and POST `/api/chat` correctly interface with the underlying database or memory structures, properly handling requests and returning expected HTTP status codes and JSON payloads.

## Exports
This file is a standalone test script executed by the test runner and does not explicitly export any modules or classes.

## Dependencies
- `node:assert`: Built-in assertions.
- `node:test`: Built-in test runner.
- `lib/server.js`: The target DashboardServer module under test.

## Side Effects
- Uses `Module.prototype.require` interception to mock `lib/db` and `lib/utils` during execution.
- Starts a mock HTTP server instance and binds to an arbitrary port to execute tests without conflicting with live instances.
