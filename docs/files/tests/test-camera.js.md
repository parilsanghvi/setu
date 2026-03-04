---
source_hash: 1c16ded8370fc4b7
facts_hash: 9382eedbeb7b6bfe
generated_at: 2026-03-04T05:54:26.510Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: tests/test-camera.js

## Purpose
This file is a test suite for the Camera class, which is responsible for handling screenshot functionality in an application. It tests various scenarios such as constructor initialization, browser launch, screenshot taking, and error handling.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `require` | function |  | Provides helper utilities to the Camera class |
| `gotoCall` | arrow | `mocks.calls.find(c => c.method === 'page.goto')` | Returns a mock call for the page.goto method |
| `hasTraversal` | arrow | `mkdirCalls.some(c => c.args[0].includes('..'))` | Checks if any mkdir call contains a directory traversal |
| `if` | method | `id === 'playwright-core'` | Conditionally returns a mock object based on the module ID |
| `initCall` | arrow | `mkdirCalls.find(c => c.args[0].endsWith('/screenshots'))` | Returns a mock call for creating the screenshots directory |
| `launchCall` | arrow | `mocks.calls.find(c => c.method === 'browser.launch')` | Returns a mock call for launching the browser |
| `mkdirCalls` | arrow | `mocks.calls.filter(c => c.method === 'mkdirSync')` | Returns an array of mock calls for mkdir operations |
| `mockBrowser` | arrow | `{ newContext: async (options) => { ... } }` | Mocks the browser object with a new context creation method |
| `mockContext` | arrow | `{ newPage: async () => { ... } }` | Mocks the context object with a new page creation method |
| `mockPage` | arrow | `{ goto: async (url, options) => { ... } }` | Mocks the page object with a goto method |
| `mocks` | arrow | `{ 'playwright-core': { chromium: { launch: async (options) => { ... } } } }` | Mocks the mocks object with playwright core configuration |
| `safeCall` | arrow | `mkdirCalls.find(c => c.args[0].includes('etc/passwd'))` | Returns a mock call for creating a safe directory path |
| `screenshotCall` | arrow | `mocks.calls.find(c => c.method === 'page.screenshot')` | Returns a mock call for the page screenshot method |

## Internal Logic
The main execution flow of this file is as follows:

1. The test suite requires the necessary modules, including `node:test`, `node:assert`, and `path`.
2. It sets up mocks for various methods, such as `require`, `goto`, `screenshot`, and `close`.
3. The Camera class is initialized with a mock browser object.
4. Various tests are run to verify the behavior of the Camera class, including constructor initialization, browser launch, screenshot taking, and error handling.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `node:test` | No | Provides testing utilities |
| `node:assert` | No | Provides assertion utilities |
| `path` | No | Provides path manipulation utilities |

## Side Effects
- console_output: The file logs error messages to the console when required modules cannot be loaded.
- console_output: The file prints the results of each test case.

## Dependents
No known dependents.

## Cross-References
No cross-references.
