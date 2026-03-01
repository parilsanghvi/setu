---
description: Integration tests for Dashboard API endpoints
---
# `tests/test-dashboard-api.js`

This file contains integration tests for the `DashboardServer` (`lib/server.js`) to ensure its REST API endpoints correctly handle requests, authenticate users, and interact with the database.

It mocks underlying database calls using `lib/db.js` and verifies proper API responses, error handling, and security mechanisms.
