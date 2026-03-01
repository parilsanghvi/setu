---
title: test-server-error-handling.js
description: Integration tests verifying that the server correctly masks internal errors.
---
# test-server-error-handling.js

## Purpose
This file tests the error handling behavior of the dashboard server and makes sure stack traces do not leak to the API consumer. Security properties of exception bubbling are validated.

## Exports
- N/A (executable test script). Runs tests asserting 500 status codes with masking text bodies.

## Dependencies
- express, supertest, http client helpers.

## Side Effects
Spawns temporary test environments and hooks into node.js global exception mechanisms temporarily if needed.
