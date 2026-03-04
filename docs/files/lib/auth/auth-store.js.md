---
source_hash: 5493515227a86925
facts_hash: dd43701ee319082f
generated_at: 2026-03-04T05:37:18.039Z
generator_version: 1.0.0
model: cheap
quality_score: 93
---
# File: lib/auth/auth-store.js

## Purpose
The `auth-store.js` file provides an authentication store that manages user profiles and credentials, utilizing the `fs` module for file system operations.

| Export | Type | Description |
|--------|------|-------------|
| constructor | cjs_default | Initializes the authentication store with a unique store path. |
| ensureStore | function | Ensures the presence of the authentication store directory and files. |
| load | function | Loads the existing user profiles from the authentication store file. |
| save | function | Saves the updated user profiles to the authentication store file. |
| getProfile | function | Retrieves a specific user profile by ID. |
| listProfiles | function | Lists all available user IDs in the authentication store. |
| addProfile | function | Adds a new user profile with credentials and an updated timestamp. |
| removeProfile | function | Removes a specified user profile from the authentication store. |
| findProfilesByProvider | function | Finds and returns user profiles by provider ID. |

## Internal Logic
The main execution flow begins with the constructor, which initializes the store path using `os.homedir()` and ensures the presence of the directory and file using the `ensureStore` method.

Key functions include:

*   `load`: Retrieves the existing user profiles from the authentication store file.
*   `save`: Saves the updated user profiles to the authentication store file.
*   `getProfile`: Looks up a specific user profile by ID.
*   `listProfiles`: Returns all available user IDs in the authentication store.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| fs | No | Provides asynchronous file system operations. |
| os | No | Offers platform-specific utilities for determining the home directory. |
| path | No | Enables path manipulation and normalization. |

## Side Effects

-   `console_output`: Logs error messages to the console when loading or saving the authentication store fails.
-   `filesystem_read`: Reads the contents of the authentication store file using `fs.readFileSync`.
-   `filesystem_write`: Writes data to the authentication store file using `fs.writeFileSync`.

## Dependents
- [google.js](./google.js.md)
- [profile-mgr.js](./profile-mgr.js.md)

## Cross-References
- [google.js](./google.js.md)
- [profile-mgr.js](./profile-mgr.js.md)
