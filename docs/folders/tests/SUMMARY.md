---
source_hash: 3018c70c298b7b7a
facts_hash: 3018c70c298b7b7a
generated_at: 2026-02-25T12:39:25.509Z
generator_version: 1.0.0
model: cheap
quality_score: 78
---
# Folder: tests

## Purpose
This folder contains a comprehensive set of tests for various components and features within an application, ensuring its reliability, security, and performance.

## Key Files
| File | Role |
|------|------|
| `verify-agent-broadcast-optimization.js` | Verifies agent broadcast optimization functionality. |
| `verify-auth-malformed-header.js` | Tests authentication middleware handling malformed headers. |
| `verify-auth-rate-limit.js` | Evaluates authentication rate limiting effectiveness. |
| `verify-core-agent-loop.js` | Ensures core agent loop logic correctness. |
| `verify-headers.js` | Validates security headers presence on API endpoints. |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: The application's components and features are thoroughly tested to ensure they meet the required standards.
Rule 1: All test files should be written in a consistent style, adhering to the standard naming conventions and coding structure used within the project.

## Cross-References
- [lib/](./lib/SUMMARY.md)
- [benchmark_blocking.js](../../files/tests/benchmark_blocking.js.md)
- [core_agent_upgrade.test.js](../../files/tests/core_agent_upgrade.test.js.md)
- [debug-payload.js](../../files/tests/debug-payload.js.md)
- [list-models.js](../../files/tests/list-models.js.md)
- [minimal-auth-test.js](../../files/tests/minimal-auth-test.js.md)
- [runner.js](../../files/tests/runner.js.md)
- [steering-agent.js](../../files/tests/steering-agent.js.md)
- [test-agent-error-handling.js](../../files/tests/test-agent-error-handling.js.md)
- [test-agent.js](../../files/tests/test-agent.js.md)
- [test-api-auth.js](../../files/tests/test-api-auth.js.md)
- [test-auth-basic.js](../../files/tests/test-auth-basic.js.md)
- [test-auth-store-save-failure.js](../../files/tests/test-auth-store-save-failure.js.md)
- [test-auth-store.js](../../files/tests/test-auth-store.js.md)
- [test-base-provider.js](../../files/tests/test-base-provider.js.md)

