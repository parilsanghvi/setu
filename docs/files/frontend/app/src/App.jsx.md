---
source_hash: 2a951777516e23fd
facts_hash: ea04e145180ea4e6
generated_at: 2026-03-03T07:10:16.726Z
generator_version: 1.0.0
model: cheap
quality_score: 94
---
# File: frontend/app/src/App.jsx

## Purpose
The App.jsx file is the main entry point of the application, responsible for rendering the UI and managing the state of the application's components. It fetches data from the socket API and uses it to render the agent list, kanban board, logs, chat box, and onboarding status. The app also updates its active agents count in real-time.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `App` | esm_default | Exports the App component as the default export |

## Internal Logic
The main execution flow of the App.jsx file is as follows:
- The app uses the `useSocket` hook to fetch data from the socket API, which returns the agents, tasks, and logs.
- The app then uses these values to render its components, including the agent list, kanban board, logs, chat box, and onboarding status.
- The app also updates its active agents count in real-time using the `useMemo` hook.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `./App.module.scss` | Yes | Defines the styles for the application's grid layout |
| `./components/AgentCard` | Yes | Provides a reusable component for displaying individual agents |
| `./components/ChatBox` | Yes | Offers a chat box functionality that displays messages and updates in real-time |
| `./components/LogViewer` | Yes | Displays logs from the application's activity |
| `./components/OnboardingStatus` | Yes | Renders the onboarding status of the application to the user |
| `./components/TaskBoard` | Yes | Provides a kanban board functionality for managing tasks |
| `./hooks/useSocket` | Yes | Fetches data from the socket API and provides it to the app's components |
| `./index.scss` | Yes | Defines global styles for the application |

## Side Effects
- network: The app fetches data from the `/api/onboarding` endpoint when the component mounts, which makes a GET request to the server.

## Dependents
No known dependents.

## Cross-References
- [App.module.scss](./App.module.scss.md)
- [AgentCard.jsx](./components/AgentCard.jsx.md)
- [ChatBox.jsx](./components/ChatBox.jsx.md)
- [LogViewer.jsx](./components/LogViewer.jsx.md)
- [OnboardingStatus.jsx](./components/OnboardingStatus.jsx.md)
- [TaskBoard.jsx](./components/TaskBoard.jsx.md)
- [useSocket.js](./hooks/useSocket.js.md)
- [index.scss](./index.scss.md)
