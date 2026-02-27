---
source_hash: fedf42a974032eab
facts_hash: 9fadb1c56787f175
generated_at: 2026-02-25T12:08:17.902Z
generator_version: 1.0.0
model: cheap
quality_score: 86
---
# File: lib/models/providers/google.js

## Purpose
This file implements a Google provider class that handles authentication, API requests, and model generation for the Antigravity platform. The `GoogleProvider` class uses OAuth tokens to authenticate with the Google Cloud Platform and fetches available models from the Google Cloud Code API. It also generates responses using the internal Cloud Code API.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `fetchModels` | function | Fetches available models from the Google Cloud Code API |
| `generate` | function | Generates a response based on system and user prompts |
| `generateViaApiKey` | function | Generates a response using an API key |
| `generateViaOAuth` | function | Generates a response using an OAuth token |
| `fetchWithBackoff` | function | Fetches data with exponential backoff in case of quota exhaustion |

## Internal Logic
The main execution flow involves the following steps:
- The `GoogleProvider` class takes a configuration object as input, which contains authentication settings and model information.
- The `generate` method checks for API key or OAuth token authentication and calls the corresponding methods to generate a response.
- The `fetchModels` method makes a POST request to the Google Cloud Code API to fetch available models.
- The `generateViaApiKey` method makes a POST request to the Consumer Gemini API using an API key.
- The `generateViaOAuth` method makes a POST request to the internal Cloud Code API using an OAuth token.
- The `fetchWithBackoff` method makes a POST request with exponential backoff in case of quota exhaustion.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `crypto` | No | Provides encryption and decryption utilities for OAuth tokens |
| `../../auth/google` | Yes | Handles authentication with the Google Cloud Platform using OAuth tokens |
| `../../Config` | Yes | Provides configuration settings, including project IDs |

## Side Effects
- console_output: 
  - Logs errors to the console in case of authentication or API request failures.
  - Prints a message to the console indicating the number of retries for quota exhaustion.
- network:
  - Makes POST requests to the Google Cloud Code API and Consumer Gemini API.
  - Establishes connections with the internal Cloud Code API.

## Dependents
No known dependents.

## Cross-References
- [google.js](../../auth/google.js.md)
- [Config.js](../../Config.js.md)
