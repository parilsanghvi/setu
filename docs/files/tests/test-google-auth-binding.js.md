---
source_hash: 851598533a773ce0
facts_hash: 9820e40570081aeb
generated_at: 2026-03-04T06:01:20.566Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: tests/test-google-auth-binding.js

## Purpose
This file tests the GoogleAuth module, which binds to localhost by starting an HTTP server and listening on port 51121 with the specified redirect URI.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `googleAuth` | function | - | Starts an HTTP server and listens on port 51121 with the specified redirect URI. |
| `login` | method | - | Triggers the server to start listening when called. |

## Internal Logic
The main execution flow of this file involves mocking dependencies, requiring the GoogleAuth module, testing its behavior, and restoring original mocks. The key functions include:
- `googleAuth.login()`: Triggers the server to start listening.
- `googleAuth.listenArgs`: Stores the arguments passed to the `listen` method of the HTTP server.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `node:test` | Yes | Provides testing utilities |
| `module` | No | Provides require function for importing modules |
| `child_process` | No | Provides spawn function for running subprocesses |
| `http` | No | Provides HTTP server functionality |

## Side Effects
- console_output: The file logs the listen arguments to the console using `console.log('Listen args:', listenArgs);`.
- subprocess: The file mocks the `spawn` method of the child_process module by replacing it with a mock function that does nothing.

## Dependents
No known dependents.

## Cross-References
- [google.js](../lib/auth/google.js.md)
