# File: tests/test-chatbox-resilience.js

## Purpose
Verifies the `ChatBox` filtering logic is resilient to mixed log formats. It ensures that the component can handle both string logs and object logs without crashing or misfiltering.

## Exports
- None (Test file)

## Dependencies
- `node:test`: Standard Node.js test runner.
- `node:assert`: Standard assertion library.

## Side Effects
- None

${'x'.repeat(400)}
