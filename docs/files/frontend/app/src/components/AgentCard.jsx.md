---
source_hash: 06dbb4f7a1cfa22d
facts_hash: dbe958d40e63b829
generated_at: 2026-02-25T11:59:03.887Z
generator_version: 1.0.0
model: cheap
quality_score: 73
---
# File: frontend/app/src/components/AgentCard.jsx

## Purpose
The AgentCard component renders a card displaying an agent's name, role, and status, providing visual cues for offline or active agents.

| Export | Type | Description |
|--------|------|-------------|
| `AgentCard` | esm_default | Exports the AgentCard React component. |

## Internal Logic
The main execution flow involves:

* Calculating the card class and status class based on the agent's status.
* Rendering the card with the calculated classes, containing the agent's name, role, and status.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `classNames` | No | Provides a utility function for conditionally joining class names. |
| `./AgentCard.module.scss` | Yes | Contains CSS styles for styling the AgentCard component. |
| `react` | No | Provides the React library and its functionality, used by the AgentCard component. |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
- `AgentCard.module.scss` _(doc not yet generated)_
