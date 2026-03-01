# tests/test-logger.js

Unit tests for the `Logger` utility class (`lib/Logger.js`).

## Purpose

This file contains isolated unit tests designed to verify the correct functionality of the custom `Logger` class without requiring external dependencies or testing frameworks. It tests core logging behaviors such as:

- Outputting correct JSON log objects
- Proper routing to `console.log` vs `console.error` depending on the log level (`info`, `warn`, `error`, `debug`)
- Safely serializing and capturing `Error` objects and their stack traces
- Appending extra arguments or merging extra object properties into the JSON output

## Implementation Notes

- These tests run via the custom `tests/runner.js`.
- `console.log` and `console.error` are temporarily mocked during test execution to intercept output and prevent cluttering the test runner's terminal output, ensuring that what gets "printed" matches expectations exactly.
