## Purpose
The purpose of the \`TaskColumn.jsx\` file is to act as a container for a specific status column (e.g., TODO, IN_PROGRESS, DONE) within the Kanban board. It organizes multiple \`TaskCard\` components.

## Exports
- The default export is the \`TaskColumn\` React functional component.

## Dependencies
- Depends on React for state and prop management.
- Integrates with \`TaskCard.jsx\` for rendering children nodes.

## Side Effects
- Outputs a column layout to the DOM. May handle drag-and-drop enter/leave events, modifying local UI state.
