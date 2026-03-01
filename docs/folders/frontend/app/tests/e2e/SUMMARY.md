---
source_hash: 5504e5f18c301ef5
facts_hash: 5504e5f18c301ef5
generated_at: 2026-02-25T12:36:02.315Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# Folder: frontend/app/tests/e2e

## Purpose
This folder contains end-to-end tests for a dashboard feature in the application using Playwright, ensuring visual regressions are caught and authenticated user interactions are validated.

## Key Files
| File | Role |
| `dashboard.spec.js` | Ensures visual regressions are verified on legacy and new dashboards. |
| `utils/*` | Provides shared utility functions for end-to-end tests. |

## Ownership
Not yet assigned.

## Invariants / Rules
* Follows TDD (Test-Driven Development) best practices to ensure unit tests are written before feature implementation.
* Adheres to the Cucumber framework for structured test description and data-driven testing.
* Likely: All tests are executed on a CI/CD pipeline to ensure automation and repeatability.

## Cross-References
- `dashboard.spec.js-snapshots/` _(summary not yet generated)_
- [dashboard.spec.js](../../../../../files/frontend/app/tests/e2e/dashboard.spec.js.md)

