# TaskCard Component

This component represents a single task on the Kanban board.
It renders the task ID, title, and handles click events to show the task modal.

## Properties
- `task`: The task object containing ID, title, owner, status, etc.
- `onClick`: Callback triggered when the card is clicked.

## Accessibility
The card implements proper aria labels and handles keyboard navigation (Enter/Space) to trigger the `onClick` event.
