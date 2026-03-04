---
source_hash: c26cecd5b83a3efb
facts_hash: d640bc8228759f0f
generated_at: 2026-03-04T05:57:55.893Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: tests/test-core-socket.js

## Purpose
This file tests the functionality of a core socket class, which handles connection events, log streaming, and database events to socket mapping. It verifies that the socket class properly forwards chat messages from the database to connected sockets and emits live log chunks when the log file changes. The test also ensures that setup and teardown functions are correctly implemented.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `require` | function | `id` | Returns a mocked module or original module based on the provided ID |
| `MockWatcher` | class | `` | A mock watcher class that extends EventEmitter and has a close method |
| `ioMock` | arrow | `{
    on: (evt, handler` | Creates an io mock object with an on method to attach event handlers |
| `lastEmitted` | array | `[ { evt, data } ]` | An array to store the last emitted events and data |
| `mocks` | arrow | `{
    'fs': {
        ...fs, existsSync: (` | Mocks the fs module with custom methods for testing |
| `socketUser` | arrow | `{
        id: 'conn1', emitted: [], emit: (evt, data` | A socket user object used to test event emission and handling |

## Internal Logic
The main execution flow of this file involves:

- Setting up the io mock object with an on method to attach event handlers.
- Creating a socket user object to test event emission and handling.
- Simulating setup by calling the setupSocket function, which returns a teardown function.
- Testing connection events, database events to socket mapping, and log file changes via fs.watch.

Key functions include:

- `setupSocket`: Sets up the io mock object and returns a teardown function.
- `ioMock.on`: Attaches an event handler to the io mock object.
- `socketUser.emit`: Emits an event on the socket user object.
- `lastEmitted.find`: Finds the last emitted event in the array.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `node:test` | No | Provides testing utilities |
| `events` | No | Used by EventEmitter in MockWatcher class |
| `fs` | Yes | Provides file system methods for mocking |
| `module` | Yes | Provides require method to mock modules |
| `assert` | No | Provides assertion utilities |
| `path` | No | Not used in this file |

## Side Effects
- database: The setupSocket function creates a db object with a prepare method that returns a mock database response.
- log file changes: When the log file changes via fs.watch, the current watcher emits a 'log' event with the new log chunk data.

## Dependents
No known dependents.

## Cross-References
- [socket.js](../lib/socket.js.md)
