# `tests/verify-path-traversal.js`

## 1. Overview
This file contains security tests specifically targeting path traversal vulnerabilities. It verifies that core components (like the `CoreAgent`) properly sandbox file system operations.

## 2. Key Components
*   **Path Isolation Tests**: Attempts to access files outside the allowed directory using `../` and absolute paths.
*   **Verification**: Ensures that the `_resolvePath` method throws appropriate errors when traversal is attempted.

## 3. Usage
Executed via the custom test runner.

## 4. Dependencies
*   `lib/CoreAgent.js`: The component being tested.
