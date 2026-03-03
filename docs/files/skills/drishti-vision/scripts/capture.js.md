---
source_hash: 04161a0d06601256
facts_hash: 8dc5de101ce559e7
generated_at: 2026-03-03T07:30:48.016Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: skills/drishti-vision/scripts/capture.js

## Purpose
This file contains the `capture` function, which is used to capture a screenshot of a web page and save it to a specified output path. The function takes two parameters: the URL of the webpage to capture, and the desired output path for the screenshot. It is called with default values from command-line arguments if not provided.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `capture` | function | `url, outputPath` | Captures a screenshot of a webpage and saves it to the specified output path. |

## Internal Logic
The main execution flow of this file is as follows:
- The script reads command-line arguments for the URL and output path.
- It launches a chromium browser instance using the `playwright-core` library.
- It navigates to the specified URL in the browser page.
- It captures a screenshot of the entire webpage and saves it to the specified output path.
- If an error occurs during capture, it logs an error message to the console.
- Finally, it closes the browser instance.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `playwright-core` | No | Provides a way to automate browsers. |
| `path` | Yes | Helps with handling file paths and output directories. |

## Side Effects
- console_output: The script logs messages to the console during execution, including a success message when the screenshot is saved, an error message if capture fails, and a progress indicator at the start of the process.

## Dependents
No known dependents.

## Cross-References
No cross-references.
