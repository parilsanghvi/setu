---
source_hash: 93af5334a289f4f6
facts_hash: 92974ac157f0a4d5
generated_at: 2026-03-03T07:34:19.176Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-auth-store.js

## Purpose
This file contains unit tests for the `AuthStore` class, ensuring it functions correctly by verifying its initialization, profile management, and error handling capabilities.

## Exports / API Surface

| Export | Description |
|--------|-------------|
| `authStore` | Provides access to the AuthStore instance. |
| `addProfile` | Adds a new profile to the AuthStore. |
| `getProfile` | Retrieves a profile from the AuthStore by ID. |
| `listProfiles` | Returns an array of all profiles in the AuthStore. |
| `findProfilesByProvider` | Finds all profiles with a specific provider in the AuthStore. |
| `removeProfile` | Removes a profile from the AuthStore and returns its existence status. |

## Internal Logic

1. The test suite initializes a mock environment by setting up a temporary directory and modifying the `os.homedir` function to return this directory.
2. It then requires the `AuthStore` class, which is expected to use the mocked homedir.
3. The test suite verifies the AuthStore's initialization by checking if the authentication directory and file exist and are empty.
4. It adds a profile to the AuthStore using the `addProfile` method and verifies that the profile is saved correctly.
5. It retrieves a profile from the AuthStore using the `getProfile` method and verifies its existence and provider information.
6. It lists all profiles in the AuthStore using the `listProfiles` method and verifies the list's contents.
7. It finds all profiles with a specific provider in the AuthStore using the `findProfilesByProvider` method and verifies the results.
8. It removes a profile from the AuthStore using the `removeProfile` method and verifies that the profile is gone.
9. It tests error handling by creating a corrupt JSON file and verifying that the AuthStore's `getProfile` and `listProfiles` methods return null or an empty list when encountering this error.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| assert | Yes | Provides assertion functions for testing. |
| fs | No | Provides file system utilities used by the AuthStore. |
| os | No | Provides operating system utilities used by the AuthStore. |
| path | No | Provides path manipulation utilities used by the AuthStore. |

## Side Effects

- console_output: The test suite logs various messages to the console during its execution.
- filesystem_read: The test suite reads and parses files from the authentication directory using `fs.readFileSync` and `JSON.parse`.
- filesystem_write: The test suite writes JSON data to a file in the authentication directory using `fs.writeFileSync`.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
