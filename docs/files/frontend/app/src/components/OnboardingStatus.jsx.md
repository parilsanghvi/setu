---
source_hash: 0f6f130eb139215b
facts_hash: e7580337fd542929
generated_at: 2026-03-04T05:30:17.988Z
generator_version: 1.0.0
model: cheap
quality_score: 75
---
# File: frontend/app/src/components/OnboardingStatus.jsx

## Purpose
The OnboardingStatus component displays the status of onboarding, including completeness, staleness, and missing items, and provides an action to fix missing items. It updates when new data is provided. The component uses React memoization to optimize re-rendering.

| Export | Type | Description |
|--------|------|-------------|
| `OnboardingStatus` | function | Renders the onboarding status component with provided data |
| `React` | esm_default | Provides a way to create reusable React components |

## Internal Logic
The main execution flow of the OnboardingStatus component involves:
- Receiving data through the props object and extracting its components (ok, completeness, stale, missing, generatedAt).
- Calculating the completeness status based on the provided data.
- Determining the CSS class for the container element based on the completeness status.
- Rendering the header with an icon indicating completion or failure, along with the percentage of completeness.
- Displaying a stale badge if data is stale and rendering details about missing items if necessary.
- Showing an action to fix missing items if incomplete.
- Displaying the timestamp of last update.

| Module | Local | Why |
|--------|-------|-----|
| `OnboardingStatus` | Yes | Provides a reusable onboarding status component |
| `./OnboardingStatus.module.scss` | Yes | Defines CSS styles for the component's appearance |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
- [OnboardingStatus.module.scss](./OnboardingStatus.module.scss.md)
