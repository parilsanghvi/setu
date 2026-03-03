---
source_hash: e339f78027f791e8
facts_hash: cde56f09215a3f68
generated_at: 2026-03-03T07:14:41.918Z
generator_version: 1.0.0
model: cheap
quality_score: 91
---
# File: lib/Camera.js

## Purpose
This file defines the `Camera` class, which is responsible for managing a browser instance and taking screenshots of URLs, storing them in a directory with task IDs as subdirectories.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `snap` | function | Captures a screenshot of a URL and returns the relative URL path. |
| `init` | function | Initializes the browser instance if it doesn't exist. |
| `close` | function | Closes the browser instance. |
| `ensureDir` | function | Ensures a directory exists by creating it recursively. |

## Internal Logic
The main execution flow of this file is as follows:

1. The constructor initializes the logger, browser, and screenshots directory.
2. The `init` method launches a new chromium browser instance if one doesn't exist.
3. The `snap` method takes a screenshot of a URL by navigating to it in the browser context, saving it to disk, and returning the relative URL path.
4. The `close` method closes the browser instance.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `playwright-core` | No | Provides a high-level API for controlling browsers. |
| `Config` | Yes | Configures browser options, such as executable path and headless mode. |
| `Logger` | Yes | Logs events and errors to the console or file. |

## Side Effects
- filesystem_write: The program writes screenshots to disk in the specified directory.
- filesystem_read: This file does not read from disk; it only writes.

## Dependents
No known dependents.

## Cross-References
- [Config.js](./Config.js.md)
- [Logger.js](./Logger.js.md)
