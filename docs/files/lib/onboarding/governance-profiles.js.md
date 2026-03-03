---
source_hash: 7ab6a96c0fa4c376
facts_hash: 654ea3de2c48c0fe
generated_at: 2026-03-03T07:24:46.478Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: lib/onboarding/governance-profiles.js

## Purpose
This file is responsible for managing governance profiles, allowing users to switch between different profile configurations and automatically updating related ownership policies. The `getActiveProfile` function retrieves the currently active profile, while the `setProfile` function updates the profile and ownership policy accordingly.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `PRESETS` | cjs_named | Exports a predefined configuration for different governance profiles. |
| `getActiveProfile` | cjs_named | Returns the currently active governance profile and its configuration. |
| `setProfile` | cjs_named | Sets a new governance profile, updates the ownership policy, and returns the updated profile information. |

## Internal Logic
The main execution flow involves the following key functions:
- `getActiveProfile`: This function checks if a governance profile file exists at the predefined path (`governance-profile.json`). If it does, it reads the contents and extracts the profile name from the JSON data. It then returns an object with the profile name and its corresponding configuration.
- `setProfile`: This function takes a new profile name as input, checks if it is valid by ensuring it exists in the predefined `PRESETS` object. If valid, it creates the necessary directory structure at the predefined path (`governance-profile.json`) if it does not already exist. It then writes the new JSON configuration to the file and updates the ownership policy accordingly.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./paths` | Yes | Provides a utility function for getting environment variables. |
| `fs` | No | Provides file system read and write operations. |
| `path` | No | Provides path manipulation utilities. |

## Side Effects
- filesystem_read: The `getActiveProfile` function reads the contents of the governance profile file (`governance-profile.json`) and attempts to parse its JSON data.
- filesystem_write: The `setProfile` function writes new JSON configuration to the governance profile file (`governance-profile.json`) and updates the ownership policy by writing new JSON data to the ownership policy file.

## Dependents
- [index.js](../../index.js.md)
- [drift.js](./drift.js.md)

## Cross-References
- [paths.js](./paths.js.md)
- [index.js](../../index.js.md)
- [drift.js](./drift.js.md)
