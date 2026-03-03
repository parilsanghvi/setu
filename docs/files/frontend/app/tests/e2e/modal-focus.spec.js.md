---
source_hash: 5f3b9ccc71d5af6e
facts_hash: 9400960e68bb1d0a
generated_at: 2026-03-03T07:12:56.419Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: frontend/app/tests/e2e/modal-focus.spec.js

## Purpose
This file, `modal-focus.spec.js`, contains an end-to-end test for the modal focus functionality in a web application. It tests that the task button is focused before opening and closing the modal, and that focus is restored to the task button after closing the modal. This ensures that the modal does not interfere with keyboard navigation.

## Exports / API Surface

| Export | Description |
|--------|-------------|
| `test` | Runs a test case in the test framework. |
| `expect` | Verifies an assertion in the test case. |

## Internal Logic
The main execution flow of this file is to:
1. Authenticate with the application by setting HTTP credentials.
2. Create a new task on the dashboard and verify that it appears.
3. Focus the task button, open the modal, and verify that focus is inside the modal.
4. Close the modal via Escape key press and verify that focus is restored to the task button.

The main functions used in this file are:
- `test`: Runs a test case in the test framework.
- `expect`: Verifies an assertion in the test case.
- `page.goto()`: Navigates to a URL in the page context.
- `page.getByPlaceholder()`, `page.getByRole()`, and other similar functions: Retrieves elements on the page by their placeholder, role, or other properties.
- `await taskButton.first().focus()`: Focuses an element using keyboard navigation.
- `page.keyboard.press()`: Simulates a key press event.

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| `@playwright/test` | No | Provides a test framework for end-to-end testing. |

## Side Effects

## Dependents
No known dependents.

## Cross-References
No cross-references.
