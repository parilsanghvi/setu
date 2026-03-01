---
source_hash: 341528a91786b993
facts_hash: 7c50d676e7a1d4e6
generated_at: 2026-02-25T12:17:08.466Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: tests/list-models.js

## Purpose
This file contains an asynchronous test function that fetches available models for the argon-stock-s9hpx device using a Google profile, and logs the results to the console. It uses the GoogleAuth class from the auth/google module to obtain a valid token, which is then passed to the fetchModels method of the GoogleProvider class. The goal of this file is to demonstrate how to use the Google provider to list available models.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `findProfilesByProvider` | method | string `google` | Returns a list of profiles for the given provider. |
| `getValidToken` | function | string `profileId` | Retrieves a valid token for the specified profile ID using Google authentication. |
| `fetchModels` | function | string `token` | Fetches available models for the device using the provided token from the Google provider. |

## Internal Logic
The main execution flow of this file is as follows:
1. It uses the AuthStore class to retrieve a list of profiles for the 'google' provider.
2. If no profile is found, it logs an error message and exits the process.
3. Otherwise, it selects the first available profile that matches the argon-stock-s9hpx project ID.
4. It uses the GoogleAuth class to obtain a valid token for the selected profile ID.
5. Finally, it calls the fetchModels method of the GoogleProvider class with the obtained token and logs the results.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/auth/auth-store` | Yes | Provides access to profiles for different providers. |
| `../lib/auth/google` | Yes | Offers functionality for authenticating users using Google. |
| `../lib/Config` | No | Not used in this test function, but available for configuration purposes. |
| `../lib/models/providers/google` | Yes | Implements the logic for interacting with the Google provider to list models. |

## Side Effects
- console_output: The file logs various messages and errors to the console using the console.log() and console.error() functions.
- process_control: If no profile is found, the file exits the process using the process.exit(1) function.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
- [google.js](../lib/auth/google.js.md)
- [Config.js](../lib/Config.js.md)
- [google.js](../lib/models/providers/google.js.md)
