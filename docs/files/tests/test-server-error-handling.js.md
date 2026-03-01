# `tests/test-server-error-handling.js`

## 1. Overview
This file verifies the server's error handling capabilities. It ensures that the server responds with appropriate status codes and safe error messages without leaking internal details.

## 2. Key Components
*   **Error Responses**: Verifies that exceptions result in 500 status codes.
*   **Information Disclosure Prevention**: Checks that stack traces are not returned in API responses.

## 3. Usage
Executed during the standard test suite run via `node tests/runner.js`.

## 4. Dependencies
*   Testing libraries.
