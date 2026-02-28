# test-core-agent-security.js

## Purpose
This comprehensive and critical test suite meticulously verifies the `CoreAgent` module for devastating security vulnerabilities, specifically focusing on completely preventing arbitrary path traversal attacks during file and log reading operations. It ensures that malicious inputs cannot trick the agent into reading or exposing sensitive system files outside of its strictly designated sandbox directories.

## Exports
N/A (This file operates as standalone test suite and does not export any functions or classes for consumption)

## Dependencies
- `node:test` (Built-in Node.js test runner)
- `node:assert` (Built-in Node.js assertion library for verifying logical constraints)
- `../lib/CoreAgent.js` (The primary target being thoroughly tested for security flaws)

## Side Effects
Creates several temporary directories, dummy scripts, and mock files on the host filesystem during the setup phase to realistically simulate an attacker's attempt to dynamically traverse outside safe directory structures, all of which are cleaned up after execution.
