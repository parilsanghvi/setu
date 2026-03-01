---
title: test-dashboard-api.js
description: Integration tests for the Dashboard API.
---
# test-dashboard-api.js

This file contains integration tests for the Dashboard API routes, ensuring endpoints respond correctly and handle errors gracefully.

## Purpose
The purpose of this file is to verify the `DashboardServer` functionality by sending HTTP requests and asserting on the responses.

## Exports
This script is run as a standalone executable and does not export any functions or classes.

## Dependencies
This file requires the `node:test` framework and built-in Node.js modules (`assert`, `http`).

## Side Effects
It spawns a temporary HTTP server instance on a random port, makes network requests, and shuts it down afterward.

Here's an example table of tested routes:
| Route | Method | Expected |
| --- | --- | --- |
| `/api/onboarding` | GET | 200 OK |
