---
title: verify-path-traversal.js
description: Tests that the core agent is protected against directory traversal attacks.
---
# verify-path-traversal.js

## Purpose
This test script verifies that the core agent correctly resolves paths and protects against directory traversal vulnerabilities (e.g., using `..` to access files outside the scope directory). It is an essential security check.

## Exports
- N/A (executable verification script) for path validation rules on read/write endpoints.

## Dependencies
- lib/CoreAgent.js, path module logic.

## Side Effects
Attempts malicious file reads to ensure they are blocked without mutating state permanently.
