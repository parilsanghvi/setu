---
description: Integration tests for the Dashboard API.
---
# test-dashboard-api.js

## Purpose
Tests the integration and behavior of the `DashboardServer` API endpoints.

## Exports
None

## Dependencies
`express`, `socket.io`

## Side Effects
None.

This file is fairly long, checking all the endpoints like `/api/tasks` and testing for 401 on unauthorized access, making sure the rate limiter applies, etc.

`DashboardServer` handles HTTP requests correctly.
