---
source_hash: f8e317d9fc437a79
facts_hash: 1c45c3a59b2b1dc7
generated_at: 2026-03-04T05:30:54.874Z
generator_version: 1.0.0
model: cheap
quality_score: 77
---
# File: frontend/app/src/components/TaskCard.jsx

## Purpose
This file defines the TaskCard component, a reusable UI element that displays task details and allows users to view task information by clicking on it. The TaskCard component is responsible for rendering the task's title, status, assignee, and creation time. It also handles keyboard input to enable entering tasks.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `TaskCard` | React_component | Renders a task card with task details and allows users to view task information by clicking on it. |
| `getTimeSince` | function | Calculates the time elapsed since a given timestamp. |

## Internal Logic
The main execution flow of this file is as follows:
- The `TaskCard` component receives task data through its props (`task` and `onClick`) and renders the task's details.
- The `getTimeSince` function calculates the time elapsed since a given timestamp string, taking into account units such as seconds, minutes, hours, and days.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| React | Yes | Provides the foundation for building user interfaces. |
| './TaskCard.module.scss' | Yes | Styles the task card component with CSS classes. |

## Dependents
- [TaskColumn.jsx](./TaskColumn.jsx.md)

## Cross-References
- `TaskCard.module.scss` _(doc not yet generated)_
- [TaskColumn.jsx](./TaskColumn.jsx.md)
