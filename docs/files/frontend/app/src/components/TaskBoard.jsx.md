---
source_hash: 21f2c6263972d7f7
facts_hash: 1320e3034d1927d3
generated_at: 2026-03-04T05:30:45.422Z
generator_version: 1.0.0
model: cheap
quality_score: 96
---
# File: frontend/app/src/components/TaskBoard.jsx

## Purpose
The TaskBoard component is a React functional component that displays a Kanban board, allowing users to create new tasks and view details of existing ones. It utilizes the TaskColumn component to render individual task columns and the TaskDetailModal component for task details. The onTaskCreateRequest function is used to handle task creation requests.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `TaskBoard` | function | A React functional component that displays a Kanban board. |

## Internal Logic
The main execution flow of the TaskBoard component involves rendering the header with the title, controls for adding new tasks, and the task columns. The cols object is created using the useMemo hook to categorize tasks by status. This object is then used to map over and render individual TaskColumn components.

Key functions:
- `useMemo`: a React hook that memoizes the cols object, which is re-created whenever the tasks array changes.
- `setSelectedTask`: an updated version of the `setSelectedTask` function from its parent scope, passed as a prop, to update the selected task state when a task in a column is clicked.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `useState` | Yes | Manages component state for tasks and selected task. |
| `useMemo` | Yes | Memoizes the cols object for performance optimization. |
| `TaskColumn` | Yes | Renders individual task columns based on the categorized tasks. |
| `TaskDetailModal` | Yes | Displays details of the selected task. |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
- [TaskBoard.module.scss](./TaskBoard.module.scss.md)
- [TaskColumn.jsx](./TaskColumn.jsx.md)
- [TaskDetailModal.jsx](./TaskDetailModal.jsx.md)
