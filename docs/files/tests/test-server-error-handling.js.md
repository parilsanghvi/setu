---
description: Tests for server error handling.
---
# test-server-error-handling.js

## Purpose
Tests the server error handling.

## Exports
None

## Dependencies
`express`

## Side Effects
None.

This tests to make sure that the server throws 500 when expected and formats the message without leaking sensitive internal details.

`app.get` will throw nicely.
