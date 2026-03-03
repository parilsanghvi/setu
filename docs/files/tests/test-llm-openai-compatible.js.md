# tests/test-llm-openai-compatible.js

## Purpose
This file contains the unit tests for the `OpenAICompatible` class located in `lib/llm/OpenAICompatible.js`. It verifies that the provider correctly constructs configuration objects, parses and normalizes base URLs, issues correct HTTP/HTTPS POST requests to the downstream API endpoints, and correctly processes responses, errors, and fallback scenarios.

## Exports
This file is an executable test script and does not export any modules. It is intended to be run via the custom `tests/runner.js` script or standalone using `node tests/test-llm-openai-compatible.js`.

## Dependencies
*   `assert`: Node.js built-in assertion module used for validating test outcomes.
*   `http`, `https`: Node.js built-in modules, which are mocked in this script to intercept and assert against API requests.
*   `../lib/llm/OpenAICompatible`: The class under test.

## Side Effects
*   Intercepts and mocks `http.request` and `https.request` during execution to simulate network communication. The original functions are restored in a `finally` block before exiting to prevent cross-test pollution.
