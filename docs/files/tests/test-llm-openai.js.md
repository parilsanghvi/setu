# test-llm-openai.js

## Purpose
This file contains the unit tests for the OpenAI language model provider (`lib/llm/OpenAI.js`). It verifies the correct behavior of the OpenAI integration, including request formatting, response parsing, error handling (HTTP and network errors), and fallback mechanisms when an API key is missing. It ensures the provider adheres to the expected interface and robustly handles various edge cases.

## Exports
This file is a standalone test script and does not export any modules or functions.

## Dependencies
*   **assert**: Node.js built-in assertion library used to write test expectations and verify outcomes.
*   **module**: Node.js built-in module used to intercept and mock `require` calls, specifically for mocking the `https` module to avoid making real network requests during testing.
*   **../lib/llm/OpenAI.js**: The actual OpenAI provider implementation being tested.

## Side Effects
When executed, this script runs a series of asynchronous tests and outputs the results to the console (stdout/stderr). It modifies the global `Module.prototype.require` temporarily to inject the mocked `https` module, but this change is reverted in a `finally` block to prevent polluting the Node.js module cache for subsequent tests. If any test fails, it forcefully exits the process with a non-zero exit code (`process.exit(1)`).
