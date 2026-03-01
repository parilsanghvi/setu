# tests/verify-path-traversal.js

## Purpose
This file contains security-focused tests to verify that the `CoreAgent` (and related file-system interacting components) successfully prevents path traversal vulnerabilities. It asserts that the system properly isolates agents to their designated scope directories by testing attempts to read, write, or access files outside the allowed path using techniques like `../` (parent directory traversal) or absolute paths pointing to sensitive system files.

## Exports
This script is executed by the test runner and does not export any modules or APIs for consumption by other parts of the codebase.

## Dependencies
- `node:test` for setting up the test definitions.
- `node:assert` for asserting that access is denied or errors are thrown.
- `lib/CoreAgent.js` (or related modules) which contains the actual path resolution and validation logic being tested.
- `fs` (or `fs.promises`) to create temporary directories and files for testing boundary conditions.

## Side Effects
- May create temporary test files or directories within a safe `/tmp` or `.setu` location to verify path boundary logic. These should be cleaned up after execution.
- Tests exception paths and error handling which may output expected warning logs during the test run.
