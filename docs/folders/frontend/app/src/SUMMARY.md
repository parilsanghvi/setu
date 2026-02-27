---
source_hash: c0476f83d0986764
facts_hash: c0476f83d0986764
generated_at: 2026-02-25T12:35:53.571Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: frontend/app/src

## Purpose
This folder contains the main entry points and core components of a React application, responsible for rendering the user interface, fetching data from an API, and managing the flow of information between components.

| Role |
|------|
| `App.jsx` | Renders the main user interface of the application and fetches agent, task, and log data from an API. |
| `main.jsx` | Sets up the root element of the app and renders the App component with StrictMode enabled. |

## Key Files
| File | Role |
|------|------|
| `App.jsx` | Renders the main user interface of the application and fetches agent, task, and log data from an API. |
| `main.jsx` | Sets up the root element of the app and renders the App component with StrictMode enabled. |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: All routes are protected by authentication.
Likely: The useSocket hook is used to handle onboarding status updates from the API.

## Cross-References
- `assets/` _(summary not yet generated)_
- [components/](./components/SUMMARY.md)
- [hooks/](./hooks/SUMMARY.md)
- `styles/` _(summary not yet generated)_
- [utils/](./utils/SUMMARY.md)
- [App.jsx](../../../../files/frontend/app/src/App.jsx.md)
- [main.jsx](../../../../files/frontend/app/src/main.jsx.md)

