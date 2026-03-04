---
source_hash: 5f3b9ccc71d5af6e
facts_hash: a097875575366229
generated_at: 2026-03-04T05:32:31.290Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: frontend/app/tests/e2e/modal-focus.spec.js

## Purpose
This file, modal-focus.spec.js, contains an end-to-end test for the focus management of a modal in a web application. The test verifies that when a modal is opened and closed, the focus is properly trapped and restored to its original location. The test uses the Playwright library to simulate user interactions with the application.

## Exports / API Surface
| Export | Description |
|--------|-------------|
| `test` | Defines an asynchronous test function for testing web applications. |
| `expect` | Verifies expected conditions in the application's UI after a test step has been executed. |

## Internal Logic
The main execution flow of this file consists of 6 steps:

1. Authenticate the user with the application.
2. Create a new task to ensure that one exists for focus testing.
3. Simulate keyboard navigation to focus on the task button.
4. Open the modal by clicking the task button.
5. Close the modal via escape key press.
6. Verify that the focus is properly restored to the task button after closing the modal.

Key functions:

* `page.goto()`: Navigates the application's context to a specific URL.
* `page.getByPlaceholder()`, `page.getByRole()`, `page.keyboard.press()`: Selects HTML elements in the application's UI and simulates user interactions with them.
* `expect(pageBy).toBeVisible()` / `expect(pageBy).toBeFocused()`: Verifies that an element in the application's UI is visible or focused.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `@playwright/test` | No | Provides test automation utilities. |
| `page context().setHTTPCredentials()` | Yes | Allows setting HTTP credentials for the application context. |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
No cross-references.
