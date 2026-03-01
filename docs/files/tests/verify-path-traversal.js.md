# File: tests/verify-path-traversal.js

## Purpose
This script validates that the `CoreAgent` component correctly isolates file system access and prevents path traversal vulnerabilities.

## Exports
- None

## Dependencies
- Node.js `node:test` module
- Node.js `node:assert` module
- `../lib/CoreAgent`

## Side Effects
- Attempts to read and write files outside of the allowed scope to confirm that the security mechanisms block the operations.
