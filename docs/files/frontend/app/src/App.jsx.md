---
source_hash: 7cca3db59c10acf2
facts_hash: 7a21f93fa1563411
generated_at: 2026-02-25T11:58:57.164Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: frontend/app/src/App.jsx

## Purpose
The App file is the main entry point of a React application, responsible for rendering the user interface and managing the flow of data between components. It fetches agent, task, and log data from an API using the useSocket hook, which handles onboarding status updates. The App component also renders various UI elements, including AgentCard, TaskBoard, LogViewer, and ChatBox.

| Export | Type | Description |
|--------|------|-------------|
| App    | esm_default | Renders the main user interface of the application |

## Internal Logic
The App file's execution flow begins with the useSocket hook, which fetches data from an API. The resulting data is then used to calculate the active agents count and update the onboarding status if necessary. The component then renders various UI elements, including headers, agent lists, kanban boards, logs, and chat interfaces.

Key functions:
- `useSocket`: Fetches agent, task, and log data from an API.
- `fetch`: Sends a GET request to the `/api/onboarding` endpoint.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| useSocket | Yes | Provides real-time data from the server |
| AgentCard | Yes | Displays individual agent information |
| ChatBox | Yes | Handles live chat functionality with agents |
| LogViewer | Yes | Shows log entries from the application |
| TaskBoard | Yes | Manages task assignments and progress |
| components/AgentCard.js | No | 
| components/ChatBox.js | No | 
| components/LogViewer.js | No | 
| components/TaskBoard.js | No | 
| hooks/useSocket.js | Yes | Fetches data from the server in real-time |
| App.module.scss | Yes | Styles the application layout |
| index.scss | Yes | Applies global styles to the application |

## Side Effects
- network: The component fetches data from an API using `useSocket`, which sends a GET request to the `/api/onboarding` endpoint.

## Dependents
No known dependents.

## Cross-References
- `App.module.scss` _(doc not yet generated)_
- [AgentCard.jsx](./components/AgentCard.jsx.md)
- [ChatBox.jsx](./components/ChatBox.jsx.md)
- [LogViewer.jsx](./components/LogViewer.jsx.md)
- [TaskBoard.jsx](./components/TaskBoard.jsx.md)
- [useSocket.js](./hooks/useSocket.js.md)
- `index.scss` _(doc not yet generated)_
