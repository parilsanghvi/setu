---
source_hash: a9c6687c7659599e
facts_hash: 9628ae6c6688a148
generated_at: 2026-03-03T07:18:08.033Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: lib/auth/google.js

## Purpose
This file contains the implementation of the Google authentication class, responsible for handling OAuth flows and fetching user information from Google APIs.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `openUrl` | function | Opens a URL in the system's default browser. |
| `GoogleAuth` | cjs_default | A class providing methods for handling Google OAuth flows and fetching user information. |
| `_waitForCallback` | function | Waits for a callback from the authentication server to handle the code exchange. |
| `_exchangeCode` | function | Exchanges the obtained code for access tokens and refresh tokens with Google's token endpoint. |
| `_fetchUserEmail` | function | Fetches the user's email address from Google's user info endpoint. |
| `_fetchProjectId` | function | Fetches the project ID associated with the user's authentication session. |
| `refreshToken` | function | Refreshes an access token when it expires or is about to expire. |
| `getValidToken` | function | Gets a valid access token for the given profile ID, refreshing the token if necessary. |

## Internal Logic
The main execution flow of this file involves:
- Generating a PKCE verifier and challenge using the `generatePkce` function from the `pkce` module.
- Starting a local server to listen for the callback on the authentication endpoint.
- Opening the browser to the Google OAuth URL with the generated PKCE challenge.
- Exchanging the obtained code for access tokens and refresh tokens with Google's token endpoint.
- Fetching the user's email address from Google's user info endpoint.
- Fetching the project ID associated with the user's authentication session.

Key functions:
- `_waitForCallback`: Waits for a callback from the authentication server to handle the code exchange.
- `_exchangeCode`: Exchanges the obtained code for access tokens and refresh tokens with Google's token endpoint.
- `_fetchUserEmail`: Fetches the user's email address from Google's user info endpoint.
- `_fetchProjectId`: Fetches the project ID associated with the user's authentication session.

The `GoogleAuth` class constructor initializes the port number based on an environment variable and creates a new logger instance.
The `login` method starts the OAuth flow, generating a PKCE verifier and challenge, opening the browser to the Google OAuth URL, exchanging the code for tokens, and fetching user information.
The `_refreshToken` function refreshes an access token when it expires or is about to expire.
The `getValidToken` function gets a valid access token for the given profile ID, refreshing the token if necessary.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `http` | Yes | Provides the HTTP module for creating an authentication server. |
| `crypto` | No | Used for generating a PKCE verifier and challenge. |
| `child_process` | No | Not used in this implementation. |
| `AuthStore` | Yes | Provides methods for storing and retrieving user profiles. |
| `Config` | Yes | Defines configuration settings for the Google authentication flow, such as client ID, client secret, redirect URI, and scopes. |
| `Logger` | Yes | Provides a logging system for outputting messages to the console or other destinations. |

## Side Effects
- env_access: The file uses environment variables to store sensitive information such as client ID, client secret, and token URLs.
- network: The file opens a browser window to the Google OAuth URL, which may require network access to authenticate with Google's servers.
- subprocess: The file spawns a new process to create an HTTP server for listening on the authentication endpoint.

## Dependents
No known dependents.

## Cross-References
- [Config.js](../Config.js.md)
- [Logger.js](../Logger.js.md)
- [pkce.js](../utils/pkce.js.md)
- [auth-store.js](./auth-store.js.md)
