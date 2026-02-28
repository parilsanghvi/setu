---
source_hash: 93af5334a289f4f6
facts_hash: c4f6c1cdc5d1e338
generated_at: 2026-02-25T12:19:03.737Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: tests/test-auth-store.js

## Purpose
This file tests the functionality of the `AuthStore` class, which is responsible for managing user profiles and authentication data. The test suite verifies that the `AuthStore` can initialize correctly, add, retrieve, list, and remove profiles, as well as handle errors such as corrupt JSON files.

## Exports / API Surface
| Export | Description |
|--------|-------------|
| `authStore` | Provides an interface for managing user profiles and authentication data. |

## Internal Logic
The main execution flow of the file is to set up a test environment, mock the `os.homedir` function, and require the `AuthStore` class. The test suite then runs a series of tests to verify the functionality of the `AuthStore`, including initialization, adding and retrieving profiles, listing profiles, finding profiles by provider, removing profiles, and handling errors.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/auth/auth-store` | Yes | 
| `assert` | No | Provides assertion utilities for testing. |
| `fs` | No | Provides file system functionality. |
| `os` | No | Provides operating system functionality. |
| `path` | No | Provides path manipulation utilities. |

## Side Effects
- console_output: The test suite logs messages to the console, including success and failure indicators.
- filesystem_read: The test suite reads files from disk, including the temporary directory and authentication file.
- filesystem_write: The test suite writes files to disk, including the corrupt JSON file used for error handling.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
