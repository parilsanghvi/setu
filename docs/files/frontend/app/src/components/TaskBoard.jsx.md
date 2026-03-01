---
source_hash: e2d9cbbf89ba8103
facts_hash: 0b61918ffb441664
generated_at: 2026-02-25T11:59:57.729Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: frontend/app/src/components/TaskBoard.jsx

## Purpose
The TaskBoard file is responsible for rendering the task board component, which displays a list of tasks organized by status and allows users to create new tasks, view details, and navigate through visual history.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `TaskBoard` | esm_default | Renders the task board component and handles user interactions. |

## Internal Logic
The main execution flow of the TaskBoard file is as follows:
- The `TaskBoard` component receives a list of tasks as a prop.
- It uses the `useMemo` hook to categorize the tasks by status into columns.
- The component renders the task board with columns, headers, and individual task cards.
- When the user presses Enter or clicks on an empty space in the new task input field, the `createTask` function is called to create a new task.
- When the user clicks on a task card, the selected task state is updated.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| React | Yes | Provides the foundation for building user interfaces. |
| Modal | Yes | Allows users to view details of a selected task in a modal window. |
| ScreenshotGallery | Yes | Displays the visual history of a task. |
| Spinner | Yes | Indicates loading activity when creating a new task. |
| TaskBoard.module.scss | Yes | Defines the styles for the task board component. |

## Side Effects
- console_output: The file logs an error message if it fails to parse a task spec.
- network: The file sends a POST request to the API to create a new task when the `createTask` function is called.

## Dependents
No known dependents.

## Cross-References
- [Modal.jsx](./Modal.jsx.md)
- [ScreenshotGallery.jsx](./ScreenshotGallery.jsx.md)
- [Spinner.jsx](./Spinner.jsx.md)
- `TaskBoard.module.scss` _(doc not yet generated)_
