---
description: Tests against Reflected XSS vulnerabilities in the Google OAuth flow
---

# verify-google-auth-xss.js
Verifies that the Google OAuth local callback URL prevents Reflected XSS payloads.

## Purpose
The primary purpose is to simulate an attacker passing a script payload to the `?error=` parameter of the Google Auth callback. The test verifies that the server sets `Content-Type: text/plain` and does not evaluate the payload.

## Exports
No exports; this is an automated verification script.

## Dependencies
- `lib/auth/google.js` for OAuth routing logic.
- Standard test runner modules.

## Side Effects
- Mocks `child_process.spawn` to prevent browsers from popping up.
- Creates a local Express route listener on the callback port and shuts it down.
