# `lib/onboarding/dependency-engine.js`

## Purpose
This module provides the core dependency resolution logic for the onboarding process. It tracks and evaluates module dependencies to determine execution order and readiness.

## Exports
- `DependencyEngine`: A class managing dependency graphs.
- `resolveDependencies`: A helper function to evaluate dependencies.

## Dependencies
- `fs`: Core file system module.
- `path`: Core path manipulation module.

## Side Effects
- Analyzes the codebase filesystem for dependencies.
- Caches dependency information in memory for performance.
