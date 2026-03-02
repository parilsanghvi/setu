# File: tests/test-pariksha-security.js

## Purpose
This file contains security-specific tests for `lib/Pariksha.js`. Its primary goal is to ensure that the `Pariksha` agent tool cannot be exploited via shell injection vectors when executing commands, verifying that the fix utilizing `child_process.execFile` works as expected and successfully blocks attempts to execute arbitrary shell commands.

## Exports
This file does not export any modules or functions. It is a standalone test suite intended to be run by the project's test runner (`tests/runner.js`) or directly via `node:test`.

## Dependencies
- `node:test`: The built-in Node.js testing module, used for defining `describe` blocks and `it` cases.
- `node:assert`: The built-in Node.js assertion library, used for verifying test expectations.
- `../lib/Pariksha`: The actual Pariksha class under test, loaded to verify execution behaviour without mocks.
- `path`, `fs`, `os`: Built-in Node.js modules used for creating, locating, and tearing down temporary test environments.

## Side Effects
When executed, this test suite provisions temporary directories within the host's operating system's temp folder. It simulates command execution using `child_process.execFile`. Following the assertions, the `finally` blocks ensure that these temporary directories and any sentinel files created during the simulation are removed from the filesystem, preventing side effects from leaking across test runs.
