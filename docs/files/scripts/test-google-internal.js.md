---
source_hash: c764a12cc2198c55
facts_hash: 6b1bf657d8ccf19c
generated_at: 2026-03-04T05:49:05.829Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: scripts/test-google-internal.js

## Purpose
This file contains a test script for the Gemini 2.0 flash thinking experiment, specifically designed to interact with the Google OAuth provider and generate content using the `GeminiProvider` class.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| main | function | `` | Runs the test script |
| for | method | `const v of variations` | Iterates over a list of model and project variations to test each one |
| if | method | `!profileKey` | Checks if a Google OAuth profile is found in the authentication data |
| delete | method | `profile.projectId` | Deletes a property from an object to force discovery |

## Internal Logic
The main execution flow of this script involves:
- Authenticating with the Google OAuth provider and obtaining an access token.
- Loading a list of model and project variations to test.
- Iterating over each variation, generating content using `curl`, and logging the result.
- Optionally testing the generation of content using the `GeminiProvider` class.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `child_process` | No | Provides an interface to spawn subprocesses |
| `crypto` | No | Offers a secure way to generate random IDs and hashes |
| `fs` | No | Provides file system utilities for reading authentication data |
| `os` | No | Offers platform-specific functionality, such as accessing the home directory |
| `path` | No | Helps construct file paths and names |
| `../lib/models/providers/google` | Yes | Provides a class to interact with the Google OAuth provider |

## Side Effects
- console_output: The script logs various messages to the console, including error messages, test results, and progress updates.
- filesystem_read: The script reads authentication data from files on disk, including the `auth.json` and `oauth_creds.json` files.
- subprocess: The script spawns a new process using `curl` to generate content and interact with the Gemini API.

## Dependents
No known dependents.

## Cross-References
- [google.js](../lib/models/providers/google.js.md)
