---
type: file
---

# verify-path-traversal.js

## Purpose
Tests the CoreAgent class for path traversal vulnerabilities. Ensures that `readFile` and `writeFile` operations do not escape their assigned isolated scope, providing strong security guarantees against rogue agents or unauthorized file access.

## Exports
- None

## Dependencies
- node:test
- node:assert
- ../lib/CoreAgent.js

## Side Effects
- Uses file system modifications within isolated scopes.
