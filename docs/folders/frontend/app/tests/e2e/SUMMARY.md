---
source_hash: d26263340918fa84
facts_hash: d26263340918fa84
generated_at: 2026-03-03T07:57:11.447Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: frontend/app/tests/e2e

## Purpose
This folder contains end-to-end tests for the frontend application's UI components, ensuring they match their expected layouts and functionality. The tests in this folder are crucial for detecting regressions in the UI and verifying the modal focus functionality. This folder is responsible for validating the user interface of the application.

## Key Files
| File | Role |
| `dashboard.spec.js` | Verifies the layout of the legacy server against its expected snapshot. |
| `modal-focus.spec.js` | Ensures the modal does not interfere with keyboard navigation and restores focus to the task button after closing. |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: The tests in this folder follow the single responsibility principle, where each test file has a single clear responsibility.
| invariant/rule | description |
| --- | --- |
| Likely: No duplicated code between tests | All test code is unique and does not overlap.

## Cross-References
- [dashboard.spec.js-snapshots/](./dashboard.spec.js-snapshots/SUMMARY.md)
- [dashboard.spec.js](../../../../../files/frontend/app/tests/e2e/dashboard.spec.js.md)
- [modal-focus.spec.js](../../../../../files/frontend/app/tests/e2e/modal-focus.spec.js.md)

