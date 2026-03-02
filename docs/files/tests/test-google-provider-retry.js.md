# `tests/test-google-provider-retry.js`

## Purpose
This file tests the retry logic implemented in the `GoogleProvider` class, specifically focusing on the `fetchWithBackoff` method. The goal is to ensure that the provider correctly handles 429 Too Many Requests errors by applying an exponential backoff with jitter and successfully retrying the request. It also verifies that the provider appropriately fails after exceeding the maximum number of allowed retries, preventing infinite loops or excessive API calls.

## Exports
This file does not export any modules. It is an executable test script leveraging the `node:test` framework designed to be run directly via Node.js or through the project's test runner to validate the `GoogleProvider`'s behavior under simulated API rate-limiting conditions.

## Dependencies
This file depends on the built-in Node.js `node:test` module for the testing framework and `node:assert` module for assertions to verify test outcomes. It imports the `GoogleProvider` class from `../lib/models/providers/google` to instantiate and test its methods. It also mocks global environments (`global.fetch`, `global.setTimeout`, `console.log`) directly to simulate network responses and control execution timing without needing external mocking libraries.

## Side Effects
This script patches and mocks `global.fetch` to intercept and supply dummy responses for testing purposes. It overrides `global.setTimeout` to execute the callback immediately, allowing tests to run quickly without waiting for the actual backoff delay. It also intercepts `console.log` to track logging output for verification. All modified global functions are restored to their original state at the conclusion of the test run to prevent interference with subsequent tests or the broader application environment.
