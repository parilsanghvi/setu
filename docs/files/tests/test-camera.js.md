---
source_hash: 1c16ded8370fc4b7
facts_hash: b19e1f1e71f297eb
generated_at: 2026-02-25T12:19:59.860Z
generator_version: 1.0.0
model: cheap
quality_score: 83
---
# File: tests/test-camera.js

## Purpose
This file contains tests for the Camera class, ensuring that its methods behave correctly in various scenarios.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `require` | function | `id` | Returns the required module or mock object if it exists. |
| `gotoCall` | arrow | `mocks.calls.find(c => c.method === 'page.goto')` | Retrieves the goto call from the mocks array. |
| `hasTraversal` | arrow | `mkdirCalls.some(c => c.args[0].includes('..'))` | Checks if any mkdir call contains a traversal. |
| `initCall` | arrow | `mkdirCalls.find(c => c.args[0].endsWith('/screenshots'))` | Retrieves the init call that created the screenshots directory. |
| `launchCall` | arrow | `mocks.calls.find(c => c.method === 'browser.launch')` | Retrieves the launch call from the mocks array. |
| `mkdirCalls` | arrow | `mocks.calls.filter(c => c.method === 'mkdirSync')` | Retrieves all mkdir calls from the mocks array. |
| `mockBrowser` | arrow | `{ newContext: async (options) => { ... } }` | Returns a mock browser object with a new context method. |
| `mockContext` | arrow | `{ newPage: async () => { ... } }` | Returns a mock context object with a new page method. |
| `mockPage` | arrow | `{ goto: async (url, options) => { ... } }` | Returns a mock page object with a goto method. |
| `mocks` | arrow | `{ 'playwright-core': { chromium: { launch: async (options) => { ... } } } }` | Returns the main mocks object with a playwright core entry. |
| `safeCall` | arrow | `mkdirCalls.find(c => c.args[0].includes('etc/passwd'))` | Retrieves a mkdir call that created a safe directory path. |
| `screenshotCall` | arrow | `mocks.calls.find(c => c.method === 'page.screenshot')` | Retrieves the screenshot call from the mocks array. |

## Internal Logic
The file defines several key functions:
- The `require` function is patched to return a mock object instead of the actual module, allowing for testing.
- The `Camera` class has an init method that launches a new browser instance using the `mockBrowser` and `mockContext` objects.
- The `snap` method creates a new screenshot by navigating to the specified URL and taking a screenshot using the `mockPage` object.
- The `close` method cleans up by closing the browser instance using the `mockBrowser.close` method.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `node:test` | No | Provides testing utilities. |
| `path` | No | Provides path manipulation functions. |

## Side Effects
- console_output: The file logs error messages to the console if an issue occurs while requiring the Camera class.
- fs_output: The file uses the `fs.mkdirSync` function to create directories, which can affect the file system during testing.

## Dependents
No known dependents.

## Cross-References
No cross-references.
