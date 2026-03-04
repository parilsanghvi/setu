---
source_hash: d26263340918fa84
facts_hash: d26263340918fa84
generated_at: 2026-03-04T06:15:50.959Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: frontend/app/tests/e2e

## Purpose
This folder contains end-to-end tests for the frontend application, ensuring its functionality and usability in different environments. The key responsibilities of this folder are to verify the consistency of the UI and test the focus management of modals.

## Key Files
| File | Role |
| dashboard.spec.js | Ensures visual regression of legacy and new dashboard components. |
| modal-focus.spec.js | Verifies proper focus management of modals in web applications. |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: Code follows the Single Responsibility Principle, with each test suite having a single responsibility.
| Rule ID | Rule Description |
| 1      | Each test file has a descriptive name that clearly indicates its purpose. |
| 2      | All end-to-end tests are executed in parallel to minimize overall test run time. |

## Cross-References
- [dashboard.spec.js-snapshots/](./dashboard.spec.js-snapshots/SUMMARY.md)
- [dashboard.spec.js](../../../../../files/frontend/app/tests/e2e/dashboard.spec.js.md)
- [modal-focus.spec.js](../../../../../files/frontend/app/tests/e2e/modal-focus.spec.js.md)

