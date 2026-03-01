---
source_hash: 92d9fcfff857e536
facts_hash: abfea3df55cb4704
generated_at: 2026-02-25T12:00:44.698Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: frontend/app/tests/e2e/dashboard.spec.js

## Purpose
This file contains two end-to-end tests for a dashboard feature in the application, using Playwright to simulate user interactions and verify visual regressions on legacy and new dashboards.

## Exports / API Surface
| Export | Description |
|--------|-------------|
| `test` | Defines an end-to-end test suite. |
| `expect` | Provides assertion methods for verifying test results. |

## Internal Logic
The main execution flow of this file is as follows:

1. Define two test suites: "Visual Regression: Legacy Dashboard Snapshot" and "Visual Regression: New Dashboard Snapshot".
2. In each test suite, simulate a user visiting the corresponding dashboard server (localhost:3000 or localhost:5173).
3. Wait for the initial load to complete.
4. Capture a screenshot of the dashboard using the `expect` function.
5. Assert that the captured screenshot matches the expected visual regression criteria.

Key functions:

* `page.goto()`: Simulates navigating to the corresponding dashboard server.
* `page.waitForLoadState()` and `page.waitForTimeout()`: Wait for the initial load to complete before proceeding with the test.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `@playwright/test` | Yes | Provides a testing framework for end-to-end tests. |

## Side Effects

## Dependents
No known dependents.

## Cross-References
No cross-references.
