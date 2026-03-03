---
source_hash: dbeb429abe92eb00
facts_hash: dbeb429abe92eb00
generated_at: 2026-03-03T07:56:57.081Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: frontend/app/src

## Purpose
This folder contains the main entry point of a React application, responsible for rendering the UI and managing state. It fetches data from the socket API and updates its active agents count in real-time. The app renders various components, including the agent list, kanban board, logs, chat box, and onboarding status.

## Key Files
| File | Role |
| App.jsx | Renders the application's UI and manages state |
| main.jsx | Sets up the root element for the app and imports necessary styles |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: The React StrictMode is used to ensure that all components receive props. 
Likely: The createRoot function from react-dom/client ensures that the app's JSX is properly rendered in the browser DOM.
| Rule | Description |
| Use of StrictMode | Ensure all components receive props by wrapping them with StrictMode. |
| Proper rendering | Use createRoot to render the app's JSX in the correct context.

## Cross-References
- [assets/](./assets/SUMMARY.md)
- [components/](./components/SUMMARY.md)
- [hooks/](./hooks/SUMMARY.md)
- [styles/](./styles/SUMMARY.md)
- [utils/](./utils/SUMMARY.md)
- [App.jsx](../../../../files/frontend/app/src/App.jsx.md)
- [main.jsx](../../../../files/frontend/app/src/main.jsx.md)

