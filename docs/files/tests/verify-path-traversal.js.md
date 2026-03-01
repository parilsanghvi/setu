---
title: verify-path-traversal.js
description: Security verification against path traversal attacks.
---
# tests/verify-path-traversal.js

## Purpose
This file ensures that file system isolation is properly enforced by testing functions like `readFile` or `writeFile`. It attempts to navigate outside of defined operational scopes (using sibling directories `../` or absolute paths) to verify that such actions are correctly rejected or sanitized by the application's path resolution logic.

## Exports
Standalone security verification script, does not export any values.

## Dependencies
- `node:assert`: For verifying expected rejection errors.
- `node:test`: Native test harness.

## Side Effects
- May attempt to read or access files on the local filesystem outside the permitted directory if the tested security controls fail.
