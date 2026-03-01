---
source_hash: 211052bdab5aa028
facts_hash: 23038fb2592d3315
generated_at: 2026-02-25T12:22:59.101Z
generator_version: 1.0.0
model: cheap
quality_score: 80
---
# File: tests/test-db.js

## Purpose
This file provides test cases for the `Bus` class, which is responsible for managing chat messages and tasks between users. The tests cover various scenarios, including sending and receiving messages, marking messages as read, retrieving chat history, and updating tasks.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `MockDatabase` | class | `` | Mocks the better-sqlite3 database for testing purposes. |
| `bus` | object | `` | Provides methods for sending and receiving messages, retrieving chat history, and updating tasks. |

## Internal Logic
The main execution flow of this file involves setting up a mock database using the `better-sqlite3` library and creating an instance of the `Bus` class. The tests are then run in sequence, each one exercising a specific aspect of the `Bus` functionality.

Key functions include:
* `send`: sends a message between two users
* `getUnread`: retrieves a list of unread messages for a user
* `markRead`: marks a message as read
* `getChatHistory`: retrieves a list of chat history for two users, optionally with a time limit
* `updateTask`: updates the status of a task

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `better-sqlite3` | No | Provides in-memory database functionality. |
| `../lib/db` | Yes | Provides access to the chat and task databases. |
| `node:assert` | No | Provides assertion functions for testing. |

## Side Effects
- Database:
  * When sending a message, a new entry is inserted into the `messages` table with the current timestamp.
  * When retrieving unread messages, the database query returns all rows where the `read_at` column is null or undefined.
  * When marking a message as read, the `read_at` column is updated to the current timestamp for the corresponding row in the `messages` table.
  * When retrieving chat history, the database query returns all rows sorted by the `created_at` column in descending order, with optional filtering based on the time limit provided.

## Dependents
No known dependents.

## Cross-References
- [db.js](../lib/db.js.md)
