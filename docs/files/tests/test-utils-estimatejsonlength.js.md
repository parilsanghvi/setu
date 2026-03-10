## Purpose
This file contains unit tests for the `estimateJsonLength` utility function found in `lib/utils.js`. The purpose of these tests is to verify that the length estimation correctly mimics `JSON.stringify().length` behavior for primitives, arrays, and objects, handling corner cases such as `undefined`, `null`, symbols, and functions in various contexts.

## Exports
This file doesn't export anything; it runs tests using `node:test` framework.

## Dependencies
- `node:test`: Used for test definition.
- `assert`: Used for test assertions.
- `lib/utils.js`: The module containing the `estimateJsonLength` utility that is being tested.

## Side Effects
This test suite executes synchronous assertions, outputting the test results using the native node test runner. It has no external side effects such as file I/O or network requests.
