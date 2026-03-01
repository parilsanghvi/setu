---
description: Tests for path traversal vulnerabilities in agent file access
---
# `tests/verify-path-traversal.js`

This script verifies that the `CoreAgent` file system access functions (`readFile`, `writeFile`, etc.) are secured against path traversal attacks.

It ensures that agents cannot use relative paths like `../` or absolute paths to escape their designated workspace or access files outside their `scope` directory.
