---
source_hash: 9b2aa5142433c203
facts_hash: 08d70bbf8947be68
generated_at: 2026-02-25T12:02:17.876Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: lib/Camera.js

## Purpose
This file defines a `Camera` class that provides functionality for capturing screenshots of web pages using the Playwright library, allowing for automated testing and verification purposes.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `snap` | function | Captures a screenshot of a URL and returns the relative path to the saved image. |
| `init` | function | Initializes the browser instance, launching it in headless mode if necessary. |
| `close` | function | Closes the browser instance. |
| `ensureDir` | function | Ensures that a directory exists, creating it if necessary. |

## Internal Logic
The main execution flow of this file involves the following key functions:
- `init`: This function initializes the browser instance, launching it in headless mode if necessary.
- `snap`: This function captures a screenshot of a URL and returns the relative path to the saved image. It first checks if the browser is already initialized, then navigates to the specified URL using Playwright's newPage method, takes a screenshot, and saves it to a file.
- `close`: This function closes the browser instance.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `playwright-core` | No | Provides the necessary functionality for launching and controlling browsers. |
| `path` | No | Provides utility functions for working with file paths. |
| `fs` | No | Provides file system utilities, including creating directories. |

## Side Effects
- console_output: The `init`, `snap`, and `close` methods may output log messages to the console, including success or failure indicators.
- filesystem_read: The `snap` method reads the contents of a URL and saves it to a file on disk.
- filesystem_write: The `snap` method writes the screenshot data to a file on disk.

## Dependents
No known dependents.

## Cross-References
- [Config.js](./Config.js.md)
