---
description: Unit tests for the Logger class.
---

# `tests/test-logger.js`

This file contains unit tests to verify the functionality of the `Logger` class (`lib/Logger.js`).

It covers:
- The standard logging methods (`info`, `warn`, `error`, `debug`).
- Verification that the correct console method (`console.log` vs `console.error`) is used based on log level.
- Correct serialization of log entries into JSON format, including `timestamp`, `level`, `name`, and `message`.
- Handling and formatting of `Error` objects, specifically capturing message and stack trace.
- Merging extra object arguments into the main JSON log structure.
- Handling multiple arguments correctly without breaking serialization.

The script mocks `console.log` and `console.error` to intercept and assert against output, enabling testing without external frameworks or polluting test runner outputs.
