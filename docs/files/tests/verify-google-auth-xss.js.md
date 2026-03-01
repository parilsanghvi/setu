# tests/verify-google-auth-xss.js

## Purpose
Verifies the fix for the Reflected XSS vulnerability in `lib/auth/google.js`. It confirms that the local OAuth callback server returns `text/plain` responses for errors instead of vulnerable `text/html`, which prevents browsers from rendering malicious payloads injected via URL parameters.

## Exports
This file is a standalone test script and does not export any modules or variables for external use.

## Dependencies
- `node:test` for test definitions.
- `node:assert` for assertions.
- Requires standard core modules like `http` and `child_process`.

## Side Effects
- Mocks `child_process.spawn` to prevent actual browser launch during tests.
- Mocks `dotenv` (via `Module.prototype.require` interception) to satisfy `lib/Config.js` dependencies.
- Starts the `GoogleAuth` local HTTP server on port 51121 and binds it to the loopback interface.
- Exits the process with code 0 (success) or 1 (failure).
