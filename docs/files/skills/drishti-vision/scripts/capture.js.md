---
source_hash: 04161a0d06601256
facts_hash: e5f17ceefaf8b778
generated_at: 2026-03-04T05:50:06.458Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: skills/drishti-vision/scripts/capture.js

## Purpose
This file provides a single function, `capture`, which is used to take a screenshot of a given URL and save it to a specified output path. The function is the main entry point for capturing screenshots in the Drishti-Vision system. It is designed to be executed from the command line.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `capture` | function | `url, outputPath` | Captures a screenshot of the specified URL and saves it to the output path. |

## Internal Logic
The main execution flow of this file is as follows:
- The `capture` function is called with two arguments: `url` and `outputPath`.
- The function launches a new browser instance using `chromium.launch()`.
- A new page object is created from the browser instance using `browser.newPage()`.
- The page navigates to the specified URL using `page.goto(url, { waitUntil: 'networkidle' })`, waiting for the network to idle before proceeding.
- The page takes a screenshot of the full page using `page.screenshot({ path: outputPath, fullPage: true })` and saves it to the output path.
- If any errors occur during this process, an error message is logged to the console. Otherwise, a success message is logged indicating that the screenshot has been saved successfully.
- Finally, the browser instance is closed using `browser.close()`.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `path` | No | Provides functionality for working with file paths. |
| `playwright-core` | No | Allows launching a new browser instance and interacting with it programmatically. |

## Side Effects
- console_output: The function logs messages to the console both when the screenshot is captured successfully and when an error occurs during capture.

## Dependents
No known dependents.

## Cross-References
No cross-references.
