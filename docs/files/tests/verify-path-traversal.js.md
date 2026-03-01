# `tests/verify-path-traversal.js`

## Purpose
Tests that directory traversal vulnerabilities are correctly prevented.

## What it does
- Attempts directory traversals using payloads like `../` to access files out of bounds.
- Validates that the application correctly sanitizes paths and prevents the requests.

## Dependencies
- `node:test`
- `node:assert`
