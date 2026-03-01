# File: tests/verify-google-auth-xss.js

## Purpose
- Verifies the fix for the Reflected XSS vulnerability in `lib/auth/google.js`.
- Confirms that the local OAuth callback server returns `text/plain` responses for errors instead of vulnerable `text/html`.

## Exports
- This is a standalone test script executed via `node`.

## Dependencies
- `http`
- `assert`
- `child_process`
- `module`
- `../lib/auth/google`

## Side Effects
- Mocks `child_process.spawn` to prevent browser launch.
- Mocks `dotenv` (via `Module.prototype.require` interception) to satisfy `lib/Config.js` dependencies.
- Starts the `GoogleAuth` local HTTP server on port 51121.
- Exits the process with code 0 (success) or 1 (failure).
