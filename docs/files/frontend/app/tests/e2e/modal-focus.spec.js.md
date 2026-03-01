# modal-focus.spec.js

## Purpose
This Playwright test verifies that the focus management logic in the `Modal` component works correctly. It ensures that when a modal is opened and then closed (via the Escape key), the keyboard focus is restored to the element that triggered the modal opening.

## Key Test Cases
1.  **Initial State**: Authenticates as admin and ensures a task exists on the dashboard.
2.  **Trigger Focus**: Focuses the task card button.
3.  **Open Modal**: Clicks the button to open the modal and verifies focus moves into the dialog.
4.  **Close Modal**: Presses Escape to close the modal.
5.  **Restore Focus**: Asserts that focus returns to the original task card button.

## Dependencies
-   `@playwright/test`: For test execution and assertions.
