---
source_hash: 2c63ace2a3375554
facts_hash: eec136dec0f08a0d
generated_at: 2026-02-25T12:33:24.331Z
generator_version: 1.0.0
model: cheap
quality_score: 84
---
# File: tests/verify-google-auth-logger.js

## Purpose
This file tests the Google Auth Logger replacement functionality in the `googleAuth` module, verifying that it correctly logs token expiration and refresh events.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
|  | function | req, res | Handles incoming requests |
| expiredLog | arrow | logs.find(l => l.msg.includes('expired (or close), refreshing')) | Logs token expiration event |
| if | method | id === './auth-store' | Mocks authentication store dependency |

## Internal Logic
The main execution flow of this file involves mocking dependencies for the `googleAuth` module, including a mock authentication store and fetch functions. The test then calls the `getValidToken` function to retrieve a new access token, verifies that it matches expectations, and checks the logs for successful and expired token events.

| Key Function | What It Does |
|---------------|--------------|
| Mock fetch | Simulates API responses for testing purposes |

## Dependencies
The file imports modules to provide necessary utilities and dependencies for testing the `googleAuth` module.

| Module | Local | Why |
|--------|-------|-----|
| assert | Yes | Validates expected values |
| module | No | Provides built-in functionality for mocking require() |
| path | No | Not used in this file |

## Side Effects
The test has the following side effects:
- console_output: The test logs success and failure messages to the console.
- global_mutation: The `global.fetch` function is modified to return mock responses during testing.
- network: No network requests are made by this test, as it uses simulated API responses.
- process_control: The `process.exit(1)` call is used to indicate test failure.
- subprocess: No subprocesses are created or manipulated by this test.

## Dependents
No known dependents.

## Cross-References
- [google.js](../lib/auth/google.js.md)
