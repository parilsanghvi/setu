## Purpose
This file tests the `lib/db.js` module, which provides the main interface for interacting with the local SQLite database used for message passing, agent state, and task tracking.

## Exports
None

## Dependencies
* `node:test`
* `node:assert`
* `module`
* `better-sqlite3`

## Side Effects
* Uses `Module.prototype.require` to mock `better-sqlite3` to force an in-memory database (`:memory:`) ensuring tests are isolated and don't affect the local disk state.
* Clears the `require.cache` for `../lib/db.js` to ensure a clean load.
