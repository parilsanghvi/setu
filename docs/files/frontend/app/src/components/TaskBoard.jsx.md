---
source_hash: c74444e083e4e8ae
facts_hash: da37274f7ddf67b6
generated_at: 2026-03-03T07:11:34.632Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: frontend/app/src/components/TaskBoard.jsx

## Purpose
The TaskBoard file is a React component that displays a task board, allowing users to create new tasks, view existing ones, and navigate through different columns. The component handles the creation of new tasks via a POST request to the API and updates the UI accordingly. It also enables modal windows for selected tasks.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `TaskBoard` | function | Renders the task board with columns and allows user input for new tasks |
| `React.memo` | esm_default | Memoizes the TaskBoard component to improve performance |

## Internal Logic
The main execution flow of the file is as follows:

* The `TaskBoard` component receives a list of tasks as an argument.
* It initializes local state variables for the new task, selected task, and creating flag.
* The `createTask` function handles the creation of new tasks by sending a POST request to the API with the new task title and type. When successful, it resets the new task input field.
* The `handleKeyDown` function handles keyboard events, specifically the Enter key press, which triggers the creation of a new task when not in creating mode.
* The `cols` variable is computed using `useMemo`, grouping tasks by their status into three columns: TODO, IN_PROGRESS, and DONE. This computation depends on the `tasks` array provided to the component.
* The component renders its UI, including a modal window for selected tasks and input fields for new task creation.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| React | Yes | Essential library for building user interfaces |
| Modal | Yes | Used to display details of selected tasks in a modal window |
| ScreenshotGallery | Yes | Displays visual history screenshots for selected tasks |
| Spinner | Yes | Displays a loading spinner when creating a new task |
| TaskBoard.module.scss | Yes | Styles the component's layout and appearance |
| TaskColumn | Yes | Renders individual columns on the task board with their items and click handlers |

## Side Effects
* network: The `createTask` function sends a POST request to the API, which may affect the component's state or trigger server-side actions.

## Dependents
No known dependents.

## Cross-References
- [Modal.jsx](./Modal.jsx.md)
- [ScreenshotGallery.jsx](./ScreenshotGallery.jsx.md)
- [Spinner.jsx](./Spinner.jsx.md)
- [TaskBoard.module.scss](./TaskBoard.module.scss.md)
- [TaskColumn.jsx](./TaskColumn.jsx.md)
