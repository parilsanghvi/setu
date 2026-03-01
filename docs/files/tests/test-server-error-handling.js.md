---
title: test-server-error-handling.js
description: Tests for server error handling.
---
# test-server-error-handling.js

This file contains tests verifying that the server correctly catches exceptions and returns appropriate generic error messages to the client without leaking sensitive stack traces.

## Purpose
It validates the error boundary of `DashboardServer` API routes.

## Exports
None.

## Dependencies
Depends on `assert` and standard Node test runner.

## Side Effects
Mocks internals of `express` and other libraries to simulate runtime failures.

| Test | Expected |
| --- | --- |
| Error Leakage | None |

