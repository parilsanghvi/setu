---
source_hash: fc9f2b57af18ad2b
facts_hash: a8f09f103aa719e6
generated_at: 2026-03-04T05:31:27.997Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: frontend/app/src/components/TaskDetailModal.jsx

## Purpose
The TaskDetailModal component displays a modal window with detailed information about a specific task, including its title, status, owner, assignee, description, and visual history.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `TaskDetailModal` | function | Renders the TaskDetailModal component as a memoized React element. |
| `React.memo` | function | Returns a memoized version of the TaskDetailModal component, optimizing re-renders based on props changes. |

## Internal Logic
The main execution flow of the TaskDetailModal component involves rendering its various sub-components and handling user interactions.

- The `TaskDetailModal` function takes in two props: `task` and `onClose`, which are used to render the modal's content and handle the "close" action, respectively.
- Upon initialization, the component checks if the `task` prop is present; if not, it returns null.
- The component then renders its sub-components:
  - A header with the task's title and type (if available).
  - An action row with delete and revert buttons (for tasks marked as "DONE").
  - A meta grid displaying task ID, status, owner, and assignee information.
  - A description block (if present) containing the task's description.
  - A visual history section rendered by the ScreenshotGallery component.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `Modal` | Yes | Provides a basic modal component for rendering content. |
| `ScreenshotGallery` | Yes | Offers an interface for displaying visual history related to tasks. |
| `./TaskDetailModal.module.scss` | Yes | Defines CSS styles for styling the TaskDetailModal component's layout and appearance. |

## Side Effects
- network: 
  - The delete and revert buttons trigger a network request using the Fetch API to delete or update the task on the server, respectively.

## Dependents
- [TaskBoard.jsx](./TaskBoard.jsx.md)

## Cross-References
- [Modal.jsx](./Modal.jsx.md)
- [ScreenshotGallery.jsx](./ScreenshotGallery.jsx.md)
- `TaskDetailModal.module.scss` _(doc not yet generated)_
- [TaskBoard.jsx](./TaskBoard.jsx.md)
