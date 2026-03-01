---
description: Verification tests for path traversal vulnerabilities in CoreAgent
---

# verify-path-traversal.js
Verifies that the CoreAgent effectively mitigates path traversal attacks by rejecting attempts to access files outside its defined sandbox directory.

## Purpose
This security test ensures that the `CoreAgent` module cannot be tricked into accessing, modifying, or deleting files outside its expected scope using `../` syntax or absolute paths.

## Exports
No exports; this is an automated verification script.

## Dependencies
- `lib/CoreAgent.js` to run the test.
- Standard test runner utilities.

## Side Effects
- Sets up test directories and sandbox boundaries and tears them down.
