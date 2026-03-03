---
source_hash: 6a037ddc5c34475f
facts_hash: dfcc010ed49dbf31
generated_at: 2026-03-03T07:11:04.637Z
generator_version: 1.0.0
model: cheap
quality_score: 84
---
# File: frontend/app/src/components/OnboardingStatus.jsx

## Purpose
The OnboardingStatus component displays the status of an onboarding process, including whether it is complete, incomplete, stale, or missing items, and provides instructions to fix any issues.

| Export | Type | Description |
|--------|------|-------------|
| `OnboardingStatus` | function | Renders the onboarding status component with props |
| `React.memo` | esm_default | Memoizes the OnboardingStatus component for performance optimization |

## Internal Logic
The main execution flow of the OnboardingStatus component involves:
- Checking if the data prop is provided and returning null if not.
- Extracting relevant data from the props (ok, completeness, stale, missing, generatedAt).
- Determining the status class based on the ok prop.
- Rendering a container div with the determined status class.
- Inside the container div, rendering:
  - A header section with an icon indicating success or failure, a completion percentage, and a "stale" indicator if applicable.
  - A details section only visible when the component is incomplete, showing missing items and providing instructions to fix the issue.
  - A timestamp section displaying when the onboarding was last updated.

| Module | Local | Why |
|--------|-------|-----|
| `OnboardingStatus` | Yes | Defines the main logic for rendering the onboarding status component |
| `./OnboardingStatus.module.scss` | Yes | Provides CSS styles for styling the onboarding status component |
| `react` | No | Enables React functionality for building the component |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
- [OnboardingStatus.module.scss](./OnboardingStatus.module.scss.md)
