# test-changed-files.js

## Purpose
This test file verifies the security fix for command injection in `lib/onboarding/changed-files.js`. It ensures that user-provided `baseRef` inputs cannot execute arbitrary shell commands when resolving changed files using `git diff`.

## Exports
None. This is an executable test script.

## Dependencies
- `assert`: Built-in Node.js module used for assertions.
- `path`: Built-in Node.js module used for path resolution.
- `fs`: Built-in Node.js module used for file system operations.
- `lib/onboarding/changed-files`: The module being tested.

## Side Effects
This script runs the `resolveChangedFiles` function with a malicious input string and checks the file system for the presence of an injected artifact file (`injected.txt`) to ensure the command injection fails safely.
