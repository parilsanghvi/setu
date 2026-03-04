---
source_hash: 7ab6a96c0fa4c376
facts_hash: 647c262080c90ea8
generated_at: 2026-03-04T05:44:22.666Z
generator_version: 1.0.0
model: cheap
quality_score: 95
---
# File: lib/onboarding/governance-profiles.js

## Purpose
This file contains functions and constants used for managing governance profiles, specifically handling profile configuration and synchronization with ownership policies.

| Export | Type | Description |
|--------|------|-------------|
| `PRESETS` | cjs_named | Exports an object containing predefined governance profile presets. |
| `getActiveProfile` | cjs_named | Returns the currently active governance profile name and its corresponding settings. |
| `setProfile` | cjs_named | Sets a new governance profile, creating or updating configuration files as needed. |

## Internal Logic
The main execution flow involves loading the predefined profiles, checking for existing configuration files, and synchronizing ownership policies accordingly.

Key functions:
- `getActiveProfile`: Retrieves the active profile from the file system and returns its name and settings.
- `setProfile`: Sets a new profile by creating or updating configuration files and syncing the ownership policy.
- The `PRESETS` object defines the available governance profiles with their respective settings.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./paths` | Yes | Provides utility functions for working with file paths. |
| `fs` | No | Provides file system operations and utility functions. |

## Side Effects
- filesystem_read: The `getActiveProfile` function reads the governance profile configuration from a JSON file.
- filesystem_write: The `setProfile` function writes the governance profile configuration to a JSON file, as well as synchronizes the ownership policy with an updated configuration.

## Dependents
- [index.js](../../index.js.md)
- [drift.js](./drift.js.md)

## Cross-References
- [paths.js](./paths.js.md)
- [index.js](../../index.js.md)
- [drift.js](./drift.js.md)
