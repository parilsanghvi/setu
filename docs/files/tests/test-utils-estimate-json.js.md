# File: tests/test-utils-estimate-json.js

## Purpose
This file provides unit tests for the `estimateJsonLength` utility function found in `lib/utils.js`. It ensures that token counting remains accurate across various types of JavaScript data structures (primitives, arrays, objects) without incurring the performance penalty of actual JSON serialization.

## Exports
- This file is intended to be run as an executable test script, it does not export any modules.

## Dependencies
- `assert`: Built-in Node.js assertion library used for validation.
- `lib/utils.js`: The module being tested, specifically the `estimateJsonLength` function.

## Side Effects
- No side effects. Contains pure assertions and console logging.
