---
description: Tests for dashboard API endpoints
module: tests
---

# `test-dashboard-api.js`

## Purpose
This file contains tests for the `DashboardServer` API endpoints defined in `lib/server.js`, including tasks retrieval, log access, and metrics endpoints. It verifies basic routing, error handling, and expected responses for the frontend dashboard. This test file helps ensure the API is functioning properly.

## Exports
None. This is an executable test script.

## Dependencies
This file depends on standard Node.js modules like `http`, `assert`, and internal modules like `lib/server.js`.

## Side Effects
It creates temporary mock servers, makes API requests locally, and then cleans up.
