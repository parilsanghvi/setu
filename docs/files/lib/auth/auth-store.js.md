---
source_hash: 5493515227a86925
facts_hash: 4001ffe58c08593f
generated_at: 2026-03-03T07:17:26.776Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: lib/auth/auth-store.js

## Purpose
The `auth-store.js` file defines the `AuthStore` class, which is responsible for managing authentication data in a JSON file located at the user's home directory. The class provides methods for loading and saving authentication profiles, as well as adding, removing, and listing profiles.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `new` | cjs_default | Creates a new instance of the `AuthStore` class. |

## Internal Logic
The main execution flow of the `auth-store.js` file begins with the constructor, which initializes the store path and ensures that the directory exists if necessary. The `ensureStore()` method creates the directory and saves an empty authentication profile to it.

Key functions include:

* `load()`: Reads the authentication data from the JSON file and returns it as a JavaScript object.
* `save(data)`: Writes the provided authentication data to the JSON file.
* `getProfile(profileId)`: Retrieves a specific authentication profile by ID and returns its contents.
* `listProfiles()`: Returns an array of IDs for all available authentication profiles.
* `addProfile(profileId, credential)`: Adds a new authentication profile with the specified ID and credentials, and saves it to the store.
* `removeProfile(profileId)`: Removes the authentication profile with the specified ID from the store.
* `findProfilesByProvider(provider)`: Finds and returns an array of authentication profiles for a specific provider.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `fs` | No | Provides file system operations. |
| `os` | No | Provides operating system-specific functions. |
| `path` | No | Provides path manipulation utilities. |

## Side Effects
- console_output: The class logs error messages to the console in cases where loading or saving fails.
- filesystem_read: The `load()` method reads data from a JSON file located at the user's home directory.
- filesystem_write: The `save(data)` method writes data to a JSON file located at the user's home directory.

## Dependents
- [google.js](./google.js.md)
- [profile-mgr.js](./profile-mgr.js.md)

## Cross-References
- [google.js](./google.js.md)
- [profile-mgr.js](./profile-mgr.js.md)
