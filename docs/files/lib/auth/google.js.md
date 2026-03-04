---
source_hash: a9c6687c7659599e
facts_hash: 7e51dd849b74b947
generated_at: 2026-03-04T05:37:52.175Z
generator_version: 1.0.0
model: cheap
quality_score: 98
---
# File: lib/auth/google.js

## Purpose
This file implements the Google authentication functionality, specifically the `GoogleAuth` class, which handles the OAuth flow and provides a way to authenticate users with their Google credentials. The class is responsible for generating PKCE verifier/challenge, starting a local server to listen for the callback, exchanging the code for tokens, and fetching user information. It also provides methods for refreshing the access token.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `openUrl` | function | Opens a URL in the default browser or an external application. |
| `GoogleAuth` | cjs_default | A class that handles Google authentication. |

## Internal Logic
The main execution flow of this file involves creating an instance of the `GoogleAuth` class, which initializes the port and logger. The `login` method generates PKCE verifier/challenge, starts a local server to listen for the callback, opens the browser to the Google OAuth URL, exchanges the code for tokens, and returns the tokens and user information.

Key functions:

* `_waitForCallback`: Waits for the callback from the local server and handles errors.
* `_exchangeCode`: Exchanges the code for tokens with the Google token endpoint.
* `_fetchUserEmail` and `_fetchProjectId`: Fetch user email and project ID from the Google API, respectively.
* `refreshToken`: Refreshes the access token using the refresh token.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `http` | Yes | Provides helper utilities for creating an HTTP server. |
| `child_process` | No | Used to spawn the default browser or external application. |
| `crypto` | No | Used for generating random bytes and encoding. |
| `../Config` | Yes | Provides configuration settings, including OAuth credentials and scopes. |
| `../Logger` | Yes | Provides logging functionality for monitoring the authentication process. |
| `../utils/pkce` | Yes | Provides PKCE utility functions, including generating verifier/challenge. |

## Side Effects
- env_access: The file accesses environment variables, such as `GOOGLE_AUTH_PORT`, to configure the local server.
- network: The file establishes a network connection to the Google token endpoint and the local server.
- subprocess: The file spawns a new process to open the default browser or an external application when starting the authentication flow.

## Dependents
No known dependents.

## Cross-References
- [Config.js](../Config.js.md)
- [Logger.js](../Logger.js.md)
- [pkce.js](../utils/pkce.js.md)
- [auth-store.js](./auth-store.js.md)
