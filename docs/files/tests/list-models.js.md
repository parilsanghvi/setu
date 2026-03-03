---
source_hash: 341528a91786b993
facts_hash: d2ed315cb22fd124
generated_at: 2026-03-03T07:32:16.987Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: tests/list-models.js

## Purpose
This file tests the functionality of the GoogleProvider class, which fetches available models from a Google token. It logs the profiles found in the AuthStore and uses the preferred argon-stock-s9hpx profile to acquire a valid token, then fetches the available models using the GoogleProvider class.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `GoogleAuth` | function |  | Gets a valid token from a Google profile. |
| `Config` | object |  | Holds project configuration settings. |
| `GoogleProvider` | class |  | Fetches available models from a Google token. |
| `AuthStore` | object |  | Manages authentication profiles. |

## Internal Logic
The main execution flow of this file is as follows:

1. It fetches all the available Google profiles from the AuthStore using `AuthStore.findProfilesByProvider('google')`.
2. If a preferred argon-stock-s9hpx profile exists, it uses that; otherwise, it falls back to the first found profile.
3. It logs the used profile and attempts to acquire a valid token from the profile using `GoogleAuth.getValidToken(profile.id)`.
4. Once a valid token is acquired, it fetches available models from the GoogleProvider class using `GoogleProvider.fetchModels(token)`.
5. The file catches any errors that occur during these steps.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `GoogleAuth` | Yes | Provides functionality for getting valid tokens from profiles. |
| `AuthStore` | Yes | Manages authentication profiles, including those for Google. |
| `Config` | Yes | Holds project configuration settings that may be used to filter profiles. |
| `GoogleProvider` | Yes | Fetches available models from a Google token based on the acquired credentials. |

## Side Effects
- console_output: The file logs various messages to the console, including successful profile finds, token acquisitions, and model fetchings.
- process_control: The file exits the process with an error code of 1 if no preferred argon-stock-s9hpx profile is found in the AuthStore.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
- [google.js](../lib/auth/google.js.md)
- [Config.js](../lib/Config.js.md)
- [google.js](../lib/models/providers/google.js.md)
