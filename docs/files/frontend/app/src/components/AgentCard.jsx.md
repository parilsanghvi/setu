---
source_hash: cf8d376d3dacc12e
facts_hash: 742707fd6ad103b2
generated_at: 2026-03-03T07:10:25.415Z
generator_version: 1.0.0
model: cheap
quality_score: 75
---
# File: frontend/app/src/components/AgentCard.jsx

## Purpose
The AgentCard file is a React component that renders an agent's information in a card layout, displaying their name, role, and status. The AgentCard component uses the `React.memo` function to optimize performance by memoizing its props. The AgentCard module also includes CSS styles for styling the component.

| Export | Type | Description |
|--------|------|-------------|
| React.memo(AgentCard) | esm_default | Renders an agent's information in a card layout, displaying their name, role, and status |
| AgentCard | function | A memoized React component that renders an agent's information |

## Internal Logic
The main execution flow of the AgentCard file involves:
- Initializing the `isOffline` variable to determine if the agent is offline based on its status.
- Calculating the `cardClass` and `statusClass` using the `classNames` function, which conditionally applies styles based on the `isOffline` state.
- Returning a JSX element with two main sections: one for displaying the agent's name and role, and another for displaying their status.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| classNames | No | Provides a utility function to conditionally apply CSS classes. |
| './AgentCard.module.scss' | Yes | Contains CSS styles for styling the AgentCard component. |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
- [AgentCard.module.scss](./AgentCard.module.scss.md)
