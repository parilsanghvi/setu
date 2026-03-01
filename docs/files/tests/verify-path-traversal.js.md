---
title: verify-path-traversal.js
description: Security verification against path traversal vulnerabilities.
---
# verify-path-traversal.js

This script verifies that the server properly sanitizes file paths and prevents path traversal attacks, such as attempts to access files outside the intended directories (e.g. `../`).

## Purpose
Ensures `resolvePath` and route handlers correctly block out-of-bounds file access.

## Exports
No exports.

## Dependencies
Depends on `assert`.

## Side Effects
Reads from `fs` with potentially malicious strings to ensure they are blocked.

| Attack Vector | Expected Result |
| --- | --- |
| `../../../etc/passwd` | 403 Forbidden |

