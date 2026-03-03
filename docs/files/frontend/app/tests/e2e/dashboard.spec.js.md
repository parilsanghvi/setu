---
source_hash: 92d9fcfff857e536
facts_hash: 5b8e5c6751703927
generated_at: 2026-03-03T07:12:45.591Z
generator_version: 1.0.0
model: cheap
quality_score: 80
---
# File: frontend/app/tests/e2e/dashboard.spec.js

## Purpose
This file contains two end-to-end tests for visual regression, ensuring that the legacy and new dashboard components match their expected layouts. The first test, "Visual Regression: Legacy Dashboard Snapshot", verifies the layout of the legacy server, while the second test, "Visual Regression: New Dashboard Snapshot", verifies the layout of the new server. These tests are crucial in detecting any regressions in the UI.

## Exports / API Surface
| Export | Description |
|--------|-------------|
| `test` | Runs a test case with the given configuration and callback function. |
| `expect` | Verifies that a certain condition is met, throwing an error if not. |

## Internal Logic
The main execution flow of this file is as follows:
- The first test navigates to the legacy server, waits for initial load, and captures a screenshot.
- The second test navigates to the new server, waits for initial load, and captures a screenshot.

Key functions include `page.goto()`, which navigates to a URL, `page.waitForLoadState()`, which waits for a specific load state, and `expect(page).toHaveScreenshot()`, which verifies that a certain condition is met (in this case, the presence of a screenshot).

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `@playwright/test` | No | Provides testing utilities.

## Dependents
No known dependents.

## Cross-References
No cross-references.
