# tests/verify-path-traversal.js

Security verification test. Ensures the `CoreAgent` path resolution safely prevents directory traversal outside of the agent's defined scope (e.g., using `..` or absolute paths).

## Purpose
This ensures `..` pathing is blocked correctly inside the agent.

## Exports
None.

## Dependencies
Requires CoreAgent.

## Side Effects
None.
