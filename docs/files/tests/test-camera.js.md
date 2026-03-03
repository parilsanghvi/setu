---
source_hash: 1c16ded8370fc4b7
facts_hash: 6ac8712fe86a6ae4
generated_at: 2026-03-03T07:35:16.997Z
generator_version: 1.0.0
model: cheap
quality_score: 83
---
# File: tests/test-camera.js

## Purpose
This file contains tests for the Camera class, ensuring its constructor sets up a screenshots directory, initializes and launches a browser instance on init(), takes and saves screenshots using snap(), and cleans up resources upon close(). The tests also verify that path traversal attempts are prevented.

## Exports / API Surface
| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `require` | function | `id` | Handles module loading |
| `gotoCall` | arrow | `mocks.calls.find(c => c.method === 'page.goto')` | Finds the call to page.goto() in mocks.calls |
| `hasTraversal` | arrow | `mkdirCalls.some(c => c.args[0].includes('..'))` | Checks if any mkdirSync call contains a traversal |
| `if` | method | `id === 'playwright-core'` | Conditionally returns the required module based on id |
| `initCall` | arrow | `mkdirCalls.find(c => c.args[0].endsWith('/screenshots')` | Finds the call to mkdirSync() that creates the screenshots directory |
| `launchCall` | arrow | `mocks.calls.find(c => c.method === 'browser.launch')` | Finds the call to browser.launch() in mocks.calls |
| `mkdirCalls` | arrow | `mocks.calls.filter(c => c.method === 'mkdirSync')` | Filters calls to find mkdirSync calls |
| `mockBrowser` | arrow | `{ newContext: async (options) => { ... } }` | Mocked browser module with a constructor that creates a new context |
| `mockContext` | arrow | `{ newPage: async () => { ... } }` | Mocked context module with a method to create a new page |
| `mockPage` | arrow | `{ goto: async (url, options) => { ... } }` | Mocked page module with methods for navigation and screenshotting |
| `mocks` | arrow | `{ 'playwright-core': { chromium: { launch: async (options) => { ... } } } }` | Mocked module that patches require to return the mock browser module on certain loads |
| `safeCall` | arrow | `mkdirCalls.find(c => c.args[0].includes('/screenshots/'))` | Finds a mkdirSync call that creates a safe directory path |
| `screenshotCall` | arrow | `mocks.calls.find(c => c.method === 'page.screenshot')` | Finds the call to page.screenshot() in mocks.calls |

## Internal Logic
The main execution flow of this file involves:
1. The test suite is initialized with the node:test module.
2. The Camera class is required and an attempt is made to create it, which triggers the constructor.
3. The constructor sets up the screenshots directory by calling mkdirSync() on certain calls.
4. The init() method launches a browser instance using launch().
5. The snap() method takes and saves a screenshot by navigating to the specified URL using page.goto().
6. The close() method cleans up resources, including closing the browser instance.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `node:test` | No | Provides a testing framework for writing tests |
| `path` | No | Provides utilities for working with file paths |
| `module` | Yes | Provides helper utilities for module loading and management |

## Side Effects
- console_output: The `console.error()` statement outputs an error message to the console when attempting to require the Camera class.

## Dependents
No known dependents.

## Cross-References
No cross-references.
