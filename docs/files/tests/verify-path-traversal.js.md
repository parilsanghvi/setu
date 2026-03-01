# `tests/verify-path-traversal.js`

## Purpose
This file tests path traversal mitigation in `CoreAgent`, verifying that the isolation correctly handles absolute paths and directory escapes (`..`). This ensures that the agent cannot access files outside its designated workspace directory.

## Exports
None.

## Dependencies
- `lib/CoreAgent.js` is the primary module being tested for path isolation.

## Side Effects
None.

