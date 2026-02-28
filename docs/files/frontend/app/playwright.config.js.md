---
source_hash: 45ee651d9d9a9c31
facts_hash: 6eeef0e7c9315380
generated_at: 2026-02-25T11:58:13.552Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: frontend/app/playwright.config.js

## Purpose
This file defines the configuration for a Playwright test suite, specifying settings such as test directory, parallel execution, and web server management. It uses the `defineConfig` function from the `@playwright/test` module to configure the test environment. The configuration includes multiple projects, each with its own set of devices and command-line arguments.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| defineConfig | esm_default | Defines the test configuration |
| devices | global | Provides a collection of predefined devices for testing |

## Internal Logic
The main execution flow involves defining the test configuration using the `defineConfig` function, which takes an object as an argument. This object specifies various settings, such as the test directory, parallel execution, and web server management. The configuration is then used to set up the Playwright test environment.

Key functions include:

* `defineConfig`: defines the test configuration
* `testDir`, `fullyParallel`, `forbidOnly`, `retries`, `workers`, `reporter`, `use`, `projects`, and `webServer` are all configuration settings that modify the test environment

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| @playwright/test | No | Provides the `defineConfig` function for configuring tests |
| devices | Yes | Provides predefined devices for testing |

## Side Effects
- env_access: The file accesses environment variables, such as `process.env.CI`, to determine configuration settings based on whether the test is running in a CI (Continuous Integration) environment.

## Dependents
No known dependents.

## Cross-References
No cross-references.
