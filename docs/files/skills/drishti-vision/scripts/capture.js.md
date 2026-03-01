---
source_hash: 04161a0d06601256
facts_hash: 60a4ea3ba13a1a4b
generated_at: 2026-02-25T12:15:50.940Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: skills/drishti-vision/scripts/capture.js

## Purpose
This file exports a single function, `capture`, which is used to capture screenshots of web pages and save them to a specified output path. It can be called with two command-line arguments: the URL of the webpage to capture, and the desired output filename.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `capture` | function | `url, outputPath` | Captures a screenshot of the specified web page and saves it to the given output path. |

## Internal Logic
The main execution flow is as follows:
1. The `capture` function is called with two command-line arguments: `url` and `outputPath`.
2. It logs a message indicating that it's capturing the webpage, then launches a Chromium browser instance.
3. A new page is created in the browser and navigated to the specified URL using the `waitUntil` property.
4. The page is then screenshot, with the output saved to the specified path.
5. Finally, the browser is closed.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `playwright-core` | No | Provides a high-level API for automating web browsers. |
| `path` | Yes | Allows the script to work with file paths and directories. |

## Side Effects
- console_output: The script logs messages to the console indicating its progress, including when it's capturing a webpage and when the screenshot has been saved.

## Dependents
No known dependents.

## Cross-References
No cross-references.
