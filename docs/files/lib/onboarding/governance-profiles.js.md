---
source_hash: 7ab6a96c0fa4c376
facts_hash: 1244baf81b37ff1d
generated_at: 2026-02-25T12:11:41.978Z
generator_version: 1.0.0
model: cheap
quality_score: 95
---
# File: lib/onboarding/governance-profiles.js

## Purpose
This file provides configuration profiles for the system, allowing users to customize settings such as telemetry and ownership policies. The `getActiveProfile` function returns the currently active profile, while the `setProfile` function updates the profile and auto-syncs the related ownership policy.

| Export | Type | Description |
|--------|------|-------------|
| `PRESETS` | cjs_named | Exports a set of predefined governance profiles. |
| `getActiveProfile` | cjs_named | Returns the currently active governance profile. |
| `setProfile` | cjs_named | Updates the active governance profile and auto-syncs the ownership policy. |

## Internal Logic
The main execution flow involves loading the predefined governance profiles from disk, updating the active profile as necessary, and syncing the related ownership policy. The key functions are `getActiveProfile`, which loads the configuration data and returns the active profile, and `setProfile`, which updates the profile and syncs the ownership policy.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./paths` | Yes | Provides paths to configuration files. |
| `fs` | No | Provides file system utilities for reading and writing files. |

## Side Effects
- filesystem_read: The function reads the governance profile JSON data from disk.
- filesystem_write: The function writes the updated governance profile and ownership policy data to disk, including creating directories as needed if they do not exist.

## Dependents
- [index.js](../../index.js.md)
- [drift.js](./drift.js.md)

## Cross-References
- [paths.js](./paths.js.md)
- [index.js](../../index.js.md)
- [drift.js](./drift.js.md)
