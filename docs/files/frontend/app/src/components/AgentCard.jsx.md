---
source_hash: cf8d376d3dacc12e
facts_hash: 7c851f5b74f0bef2
generated_at: 2026-03-04T05:29:31.867Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: frontend/app/src/components/AgentCard.jsx

## Purpose
The AgentCard file is a React component that renders a card displaying information about an agent, including their name, role, and status. It utilizes the classNames library to conditionally apply CSS classes based on the agent's status. The component is memoized using React.memo to optimize performance.

| Export | Type | Description |
|--------|------|-------------|
| `AgentCard` | function | Renders a card displaying agent information |
| `React` | esm_default | Provides a way to build user interfaces |

## Internal Logic
The AgentCard component uses the `agent` prop to determine its status and apply corresponding CSS classes. The main execution flow involves:
- Initializing `isOffline` based on the agent's status.
- Using classNames to conditionally apply CSS classes to the card and status elements.
- Returning a JSX element with the agent's name, role, and status.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `AgentCard` | Yes | Defines the AgentCard component itself |
| `./AgentCard.module.scss` | Yes | Provides CSS styles for the component |
| `classnames` | No | Offers a utility function for conditionally applying CSS classes |
| `react` | No | Enables React functionality |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
- [AgentCard.module.scss](./AgentCard.module.scss.md)
