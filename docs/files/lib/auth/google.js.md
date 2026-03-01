---
source_hash: e3efebb6849ecbb0
facts_hash: f78c6c5b08a5a233
generated_at: 2026-02-25T12:05:34.439Z
generator_version: 1.0.0
model: cheap
quality_score: 93
---
# File: lib/auth/google.js

## Purpose
This file contains the implementation of the Google authentication class, `GoogleAuth`, which is responsible for handling user authentication and token management using the Google OAuth API. The `login` method initiates the login flow, while the `_exchangeCode` and `refreshToken` methods handle code exchange and refresh token management, respectively.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| openUrl | function | Opens a URL in the default system browser. |
| GoogleAuth | cjs_default | Provides a class for handling Google OAuth authentication. |

## Internal Logic
The main execution flow of this file is as follows:
- The `login` method generates PKCE verifier and challenge, starts a local server to listen for callback, opens the browser to the Google OAuth URL, exchanges the code for tokens, and returns the tokens and user info.
- The `_exchangeCode` method sends a POST request to the token endpoint with the code, client ID, client secret, and other required parameters.
- The `refreshToken` method sends a POST request to the token endpoint with the refresh token, client ID, client secret, and other required parameters.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| http | Yes | Provides HTTP client functionality. |
| spawn | No | Provides child process spawning functionality. |
| crypto | No | Provides cryptographic functionality. |
| URLSearchParams | Yes | Creates URL search parameter objects for form data. |
| fetch | No | Sends HTTP requests to the API endpoint. |
| Logger | Yes | Logs events and errors during authentication flow. |
| Config | Yes | Loads configuration settings from a file. |

## Side Effects
- network: The `openUrl` function opens a URL in the default system browser, which can lead to network activity.
- subprocess: The `spawn` function starts a child process to listen for callback, which can lead to subprocess creation and potentially other side effects if not handled properly.

## Dependents
No known dependents.

## Cross-References
- [Config.js](../Config.js.md)
- [Logger.js](../Logger.js.md)
- [pkce.js](../utils/pkce.js.md)
- [auth-store.js](./auth-store.js.md)
