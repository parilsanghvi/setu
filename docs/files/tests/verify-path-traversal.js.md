---
description: Verification tests for path traversal vulnerabilities.
---
# verify-path-traversal.js

## Purpose
Verification tests for path traversal vulnerabilities.

## Exports
None

## Dependencies
`fs`

## Side Effects
None.

It ensures that the codebase correctly isolates file paths, making sure things like `..` do not escape the scope of the app.

`CoreAgent` will fail to read out of bounds.
