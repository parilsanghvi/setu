# TaskColumn Component

This component represents a single column on the Kanban board.
It renders the column title, a list of tasks, or an empty state if there are no tasks for its specific status.

## Properties
- `status`: The status identifier (e.g., 'TODO', 'IN_PROGRESS', 'DONE').
- `items`: An array of task objects to render in this column.
- `onTaskClick`: A callback function passed down to the `TaskCard` items.

## Behavior
If `items.length === 0`, it shows an empty state message corresponding to the current status.
Otherwise, it maps through the `items` array and renders a `TaskCard` for each.
