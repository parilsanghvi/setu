---
source_hash: e339f78027f791e8
facts_hash: 2bbaafa67046e06f
generated_at: 2026-03-04T05:34:26.027Z
generator_version: 1.0.0
model: cheap
quality_score: 88
---
# File: lib/Camera.js

## Purpose
The Camera class is a browser automation tool that allows taking screenshots of web pages and saving them to a directory. It initializes a Chromium browser instance, sets up a screenshot directory, and provides methods for taking screenshots of specific URLs. The class uses the Config and Logger modules for configuration and logging purposes.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| Camera | cjs_default | Creates a new Camera instance for browser automation. |
| init | function | Initializes the Chromium browser instance and sets up screenshot directory. |
| snap | function | Takes a screenshot of a URL and saves it to a file. |
| close | function | Closes the Chromium browser instance. |

## Internal Logic
The main execution flow involves:

*   Initializing the Camera class with a new logger, browser instance, and screenshot directory.
*   The `init` method is called when the browser instance needs to be initialized or updated. It launches a new Chromium browser instance with headless mode enabled.
*   The `snap` method takes a URL as input, navigates to it using the browser instance, captures a screenshot of the page, and saves it to a file in the screenshot directory.
*   The `close` method closes the Chromium browser instance when it is no longer needed.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| playwright-core | No | Provides browser automation functionality. |
| Config | Yes | Supplies configuration settings for browser launch and screenshot directory. |
| Logger | Yes | Logs important events during browser initialization, screenshot capture, and browser closure. |

## Side Effects
-   **filesystem_write**: Screenshots are saved to the specified directory in a PNG format.
-   **filesystem_read**: The `snap` method reads URLs and screenshot file paths from user input to determine which screenshot to take.

## Dependents
No known dependents.

## Cross-References
- [Config.js](./Config.js.md)
- [Logger.js](./Logger.js.md)
