---
source_hash: 8877b365aab8bdc8
facts_hash: 07edcaba88f601a5
generated_at: 2026-06-13T16:42:30.290Z
generator_version: 1.0.0
model: fallback_no_llm
quality_score: 100
---
# File: lib/system/boot.js

## Purpose
Source file with 4 symbols and 84 lines. (LLM enrichment unavailable — fact-only mode.)

## Exports / API Surface
| Export | Type |
|--------|------|
| `boot` | cjs_named |
| `if` | method |
| `terminate` | cjs_named |

## Internal Logic
Detected symbols:
- `boot()` (function)
- `if(systemLoopsInterval)` (method)
- `seedAgents([
    { name: 'Sutradhar', role: 'Sutradhar' }, { name: 'Tark', role: 'Tark' }, { name: 'Shilpi', role: 'Shilpi' }, { name: 'Guru', role: 'Guru' }, { name: 'Shishya', role: 'Shishya' }, { name: 'Koshpal', role: 'Koshpal' }, { name: 'Rakshak', role: 'Rakshak' }, { name: 'Vishwakarma', role: 'Vishwakarma' }
  ];

  seedAgents.forEach(a)` (arrow)
- `terminate()` (function)

## Dependencies
| Module | Local |
|--------|-------|
| `../db` | Yes |
| `../server` | Yes |
| `./agentManager` | Yes |
| `./logger` | Yes |
| `fs` | No |
| `path` | No |

## Side Effects
- database
- env_access
- filesystem_write
- process_control

## Dependents
No known dependents.

## Cross-References
- [db.js](../db.js.md)
- [server.js](../server.js.md)
- [agentManager.js](./agentManager.js.md)
- `logger.js` _(doc not yet generated)_


## Symbol Dependencies

### Upstream (Internal Calls)

| Symbol | Source File | Doc |
| --- | --- | --- |
| `log` | `lib/Context.js` | [Doc](../Context.js.md) |
| `run` | `lib/Docker.js` | [Doc](../Docker.js.md) |
| `debug` | `lib/Logger.js` | [Doc](../Logger.js.md) |
| `catch` | `lib/onboarding/context-builder.js` | [Doc](../onboarding/context-builder.js.md) |
| `DashboardServer` | `lib/server.js` | [Doc](../server.js.md) |
| `start` | `lib/server.js` | [Doc](../server.js.md) |
| `stop` | `lib/server.js` | [Doc](../server.js.md) |
| `end` | `lib/SessionLogger.js` | [Doc](../SessionLogger.js.md) |
| `log` | `lib/SessionLogger.js` | [Doc](../SessionLogger.js.md) |
| `stop` | `lib/sockets/dashboard.js` | [Doc](../sockets/dashboard.js.md) |
| `spawnAgent` | `lib/system/agentManager.js` | [Doc](./agentManager.js.md) |
| `startSystemLoops` | `lib/system/agentManager.js` | [Doc](./agentManager.js.md) |
| `debug` | `lib/system/logger.js` | [Doc](./logger.js.md) |
| `log` | `lib/system/logger.js` | [Doc](./logger.js.md) |
| `setIo` | `lib/system/logger.js` | [Doc](./logger.js.md) |
| `prepare` | `tests/test-db-caching.js` | [Doc](../../tests/test-db-caching.js.md) |
| `run` | `tests/test-doc-quality-gate.js` | [Doc](../../tests/test-doc-quality-gate.js.md) |
| `log` | `tests/test-token-estimation.js` | [Doc](../../tests/test-token-estimation.js.md) |

### Downstream (Impacted By)

| Symbol | Caller File | Doc |
| --- | --- | --- |
| `boot` | `agents/Guru.js` | [Doc](../../agents/Guru.js.md) |
| `boot` | `agents/Koshpal.js` | [Doc](../../agents/Koshpal.js.md) |
| `boot` | `agents/Rakshak.js` | [Doc](../../agents/Rakshak.js.md) |
| `if` | `agents/Rakshak.js` | [Doc](../../agents/Rakshak.js.md) |
| `boot` | `agents/Shilpi.js` | [Doc](../../agents/Shilpi.js.md) |
| `boot` | `agents/Shishya.js` | [Doc](../../agents/Shishya.js.md) |
| `boot` | `agents/Sutradhar.js` | [Doc](../../agents/Sutradhar.js.md) |
| `boot` | `agents/Tark.js` | [Doc](../../agents/Tark.js.md) |
| `boot` | `agents/TestAgent.js` | [Doc](../../agents/TestAgent.js.md) |
| `boot` | `agents/Vishwakarma.js` | [Doc](../../agents/Vishwakarma.js.md) |
| `if` | `benchmarks/log_benchmark.js` | [Doc](../../benchmarks/log_benchmark.js.md) |
| `if` | `frontend/app/src/App.jsx` | [Doc](../../frontend/app/src/App.jsx.md) |
| `if` | `frontend/app/src/components/OnboardingStatus.jsx` | [Doc](../../frontend/app/src/components/OnboardingStatus.jsx.md) |
| `if` | `frontend/app/src/components/ScreenshotGallery.jsx` | [Doc](../../frontend/app/src/components/ScreenshotGallery.jsx.md) |
| `if` | `frontend/app/src/components/TaskDetailModal.jsx` | [Doc](../../frontend/app/src/components/TaskDetailModal.jsx.md) |
| `boot` | `index.js` | [Doc](../../index.js.md) |
| `if` | `lib/Context.js` | [Doc](../Context.js.md) |
| `if` | `lib/Contractor.js` | [Doc](../Contractor.js.md) |
| `if` | `lib/llm/BaseProvider.js` | [Doc](../llm/BaseProvider.js.md) |
| `if` | `lib/onboarding/codeowners.js` | [Doc](../onboarding/codeowners.js.md) |
| `if` | `lib/onboarding/dependency-engine.js` | [Doc](../onboarding/dependency-engine.js.md) |
| `if` | `lib/onboarding/paths.js` | [Doc](../onboarding/paths.js.md) |
| `if` | `lib/server.js` | [Doc](../server.js.md) |
| `if` | `scripts/ignite.js` | [Doc](../../scripts/ignite.js.md) |
| `if` | `skills/drishti-v2/tools.js` | [Doc](../../skills/drishti-v2/tools.js.md) |
| `if` | `tests/test-agent-error-handling.js` | [Doc](../../tests/test-agent-error-handling.js.md) |
| `boot` | `tests/test-agent.js` | [Doc](../../tests/test-agent.js.md) |
| `if` | `tests/test-agent.js` | [Doc](../../tests/test-agent.js.md) |
| `if` | `tests/test-auth-store-save-failure.js` | [Doc](../../tests/test-auth-store-save-failure.js.md) |
| `if` | `tests/test-auth-store.js` | [Doc](../../tests/test-auth-store.js.md) |
| `if` | `tests/test-budget.js` | [Doc](../../tests/test-budget.js.md) |
| `if` | `tests/test-context.js` | [Doc](../../tests/test-context.js.md) |
| `if` | `tests/test-contractor.js` | [Doc](../../tests/test-contractor.js.md) |
| `if` | `tests/test-core-server-routes.js` | [Doc](../../tests/test-core-server-routes.js.md) |
| `if` | `tests/test-events.js` | [Doc](../../tests/test-events.js.md) |
| `if` | `tests/test-json-parser.js` | [Doc](../../tests/test-json-parser.js.md) |
| `if` | `tests/test-log-reader.js` | [Doc](../../tests/test-log-reader.js.md) |
| `if` | `tests/test-logger.js` | [Doc](../../tests/test-logger.js.md) |
| `if` | `tests/test-models-config.js` | [Doc](../../tests/test-models-config.js.md) |
| `if` | `tests/test-pariksha-security.js` | [Doc](../../tests/test-pariksha-security.js.md) |
| `if` | `tests/test-session-logger.js` | [Doc](../../tests/test-session-logger.js.md) |
| `if` | `tests/test-steering.js` | [Doc](../../tests/test-steering.js.md) |
| `if` | `tests/test-tasks-api.js` | [Doc](../../tests/test-tasks-api.js.md) |
| `if` | `tests/verify-async-logging.js` | [Doc](../../tests/verify-async-logging.js.md) |
| `if` | `tests/verify-log-watch.js` | [Doc](../../tests/verify-log-watch.js.md) |
| `if` | `tests/verify-proto-pollution.js` | [Doc](../../tests/verify-proto-pollution.js.md) |
