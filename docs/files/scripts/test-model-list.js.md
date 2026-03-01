---
source_hash: d145195b3569e2c1
facts_hash: 5b1990c33d1d89a8
generated_at: 2026-02-25T12:15:23.706Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: scripts/test-model-list.js

## Purpose
This file contains a test function `main` that lists models via the Generative Language API using authentication tokens obtained from Google Auth.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `googleProfileId` | arrow | `profiles.find(p => p.startsWith('google-'))` | Finds a profile starting with 'google-' in the list of profiles. |
| `if` | method | `!googleProfileId` | Exits the function if no Google profile is found. |
| `main` | function | `` | Lists models via Generative Language API using authentication token. |

## Internal Logic
The main execution flow starts with listing profiles from the Auth Store, then finding the first Google profile in the list. It then uses the Google Auth library to obtain a valid authentication token for that profile. The obtained token is used to make an HTTP request to the Generative Language API to list models. The response data is logged to the console.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/auth/google` | Yes | Provides Google Auth functionality. |
| `../lib/auth/auth-store` | Yes | Stores and manages authentication profiles. |

## Side Effects
- console_output: The function logs various messages to the console, including success or failure messages, and responses from the Generative Language API.
- network: The function makes an HTTP request to the Generative Language API, which may involve establishing a network connection and sending/receiving data over it.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
- [google.js](../lib/auth/google.js.md)
