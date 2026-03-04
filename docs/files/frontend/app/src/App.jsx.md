---
source_hash: 355be5cca6c86820
facts_hash: 7d774b27c312e6a9
generated_at: 2026-03-04T05:29:23.514Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: frontend/app/src/App.jsx

## Purpose
The App file is the main entry point of the frontend application, rendering the user interface and handling interactions between various components.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `App` | esm_default | Exports the App component as the default export. |

## Internal Logic
The App file initializes state using `useState`, fetches onboarding data in the effect hook, and defines several utility functions:
- `activeAgentsCount`: calculates the number of active agents.
- `handleGitCommit`: commits to Git when the button is clicked.
- `handleTaskCreateRequest`: opens the task creation modal.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `useSocket` | Yes | Provides a hook for interacting with the socket connection. |
| `./App.module.scss` | Yes | Imports CSS styles for the application. |
| `./components/AgentCard` | Yes | Imports a reusable AgentCard component. |
| `./components/ChatBox` | Yes | Imports a reusable ChatBox component. |
| `./components/LogViewer` | Yes | Imports a reusable LogViewer component. |
| `./components/OnboardingStatus` | Yes | Imports a reusable OnboardingStatus component. |
| `./components/TaskBoard` | Yes | Imports a reusable TaskBoard component. |
| `./components/TaskCreationModal` | Yes | Imports a reusable TaskCreationModal component. |
| `./hooks/useSocket` | Yes | Provides a hook for interacting with the socket connection. |
| `./index.scss` | Yes | Imports CSS styles for the application index page. |

## Side Effects
- network: The App file fetches onboarding data from the server when it mounts, and performs a Git commit when the "Commit to Git" button is clicked.

## Dependents
No known dependents.

## Cross-References
- [App.module.scss](./App.module.scss.md)
- [AgentCard.jsx](./components/AgentCard.jsx.md)
- [ChatBox.jsx](./components/ChatBox.jsx.md)
- [LogViewer.jsx](./components/LogViewer.jsx.md)
- [OnboardingStatus.jsx](./components/OnboardingStatus.jsx.md)
- [TaskBoard.jsx](./components/TaskBoard.jsx.md)
- [TaskCreationModal.jsx](./components/TaskCreationModal.jsx.md)
- [useSocket.js](./hooks/useSocket.js.md)
- [index.scss](./index.scss.md)
