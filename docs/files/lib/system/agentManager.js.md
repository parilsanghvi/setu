---
source_hash: ad208129833a402c
facts_hash: c5d9d15a7a169621
generated_at: 2026-06-13T16:42:30.209Z
generator_version: 1.0.0
model: fallback_no_llm
quality_score: 100
---
# File: lib/system/agentManager.js

## Purpose
Source file with 4 symbols and 203 lines. (LLM enrichment unavailable — fact-only mode.)

## Exports / API Surface
| Export | Type |
|--------|------|
| `AGENT_MAP` | cjs_named |
| `if` | method |
| `RUNNING_PROCESSES` | cjs_named |
| `SPAWN_TIMES` | cjs_named |
| `spawnAgent` | cjs_named |
| `startSystemLoops` | cjs_named |

## Internal Logic
Detected symbols:
- `if(!scriptPath || typeof scriptPath !== 'string')` (method)
- `leanAgents(currentAgents.map(({ last_heartbeat, ...rest })` (arrow)
- `spawnAgent(name, role)` (function)
- `startSystemLoops(io)` (function)

## Dependencies
| Module | Local |
|--------|-------|
| `../db` | Yes |
| `./logger` | Yes |
| `child_process` | No |
| `path` | No |

## Side Effects
- database
- env_access
- subprocess

## Dependents
No known dependents.

## Cross-References
- [db.js](../db.js.md)
- `logger.js` _(doc not yet generated)_


## Symbol Dependencies

### Upstream (Internal Calls)

| Symbol | Source File | Doc |
| --- | --- | --- |
| `Guru` | `agents/Guru.js` | [Doc](../../agents/Guru.js.md) |
| `get` | `lib/Config.js` | [Doc](../Config.js.md) |
| `log` | `lib/Context.js` | [Doc](../Context.js.md) |
| `getAgents` | `lib/db.js` | [Doc](../db.js.md) |
| `getDeadAgents` | `lib/db.js` | [Doc](../db.js.md) |
| `getNewMessages` | `lib/db.js` | [Doc](../db.js.md) |
| `getTaskMeta` | `lib/db.js` | [Doc](../db.js.md) |
| `getTasks` | `lib/db.js` | [Doc](../db.js.md) |
| `send` | `lib/db.js` | [Doc](../db.js.md) |
| `run` | `lib/Docker.js` | [Doc](../Docker.js.md) |
| `debug` | `lib/Logger.js` | [Doc](../Logger.js.md) |
| `create` | `lib/models/factory.js` | [Doc](../models/factory.js.md) |
| `catch` | `lib/onboarding/context-builder.js` | [Doc](../onboarding/context-builder.js.md) |
| `log` | `lib/SessionLogger.js` | [Doc](../SessionLogger.js.md) |
| `get` | `lib/SkillLoader.js` | [Doc](../SkillLoader.js.md) |
| `debug` | `lib/system/logger.js` | [Doc](./logger.js.md) |
| `log` | `lib/system/logger.js` | [Doc](./logger.js.md) |
| `prepare` | `tests/test-db-caching.js` | [Doc](../../tests/test-db-caching.js.md) |
| `run` | `tests/test-doc-quality-gate.js` | [Doc](../../tests/test-doc-quality-gate.js.md) |
| `emit` | `tests/test-server.js` | [Doc](../../tests/test-server.js.md) |
| `on` | `tests/test-server.js` | [Doc](../../tests/test-server.js.md) |
| `log` | `tests/test-token-estimation.js` | [Doc](../../tests/test-token-estimation.js.md) |
| `send` | `tests/verify-auth-malformed-header.js` | [Doc](../../tests/verify-auth-malformed-header.js.md) |
| `send` | `tests/verify-auth-weak-default.js` | [Doc](../../tests/verify-auth-weak-default.js.md) |

### Downstream (Impacted By)

| Symbol | Caller File | Doc |
| --- | --- | --- |
| `if` | `agents/Rakshak.js` | [Doc](../../agents/Rakshak.js.md) |
| `if` | `benchmarks/log_benchmark.js` | [Doc](../../benchmarks/log_benchmark.js.md) |
| `if` | `frontend/app/src/App.jsx` | [Doc](../../frontend/app/src/App.jsx.md) |
| `if` | `frontend/app/src/components/OnboardingStatus.jsx` | [Doc](../../frontend/app/src/components/OnboardingStatus.jsx.md) |
| `if` | `frontend/app/src/components/ScreenshotGallery.jsx` | [Doc](../../frontend/app/src/components/ScreenshotGallery.jsx.md) |
| `if` | `frontend/app/src/components/TaskDetailModal.jsx` | [Doc](../../frontend/app/src/components/TaskDetailModal.jsx.md) |
| `if` | `lib/Context.js` | [Doc](../Context.js.md) |
| `if` | `lib/Contractor.js` | [Doc](../Contractor.js.md) |
| `if` | `lib/llm/BaseProvider.js` | [Doc](../llm/BaseProvider.js.md) |
| `if` | `lib/onboarding/codeowners.js` | [Doc](../onboarding/codeowners.js.md) |
| `if` | `lib/onboarding/dependency-engine.js` | [Doc](../onboarding/dependency-engine.js.md) |
| `if` | `lib/onboarding/paths.js` | [Doc](../onboarding/paths.js.md) |
| `if` | `lib/server.js` | [Doc](../server.js.md) |
| `spawnAgent` | `lib/system/boot.js` | [Doc](./boot.js.md) |
| `startSystemLoops` | `lib/system/boot.js` | [Doc](./boot.js.md) |
| `if` | `scripts/ignite.js` | [Doc](../../scripts/ignite.js.md) |
| `if` | `skills/drishti-v2/tools.js` | [Doc](../../skills/drishti-v2/tools.js.md) |
| `if` | `tests/test-agent-error-handling.js` | [Doc](../../tests/test-agent-error-handling.js.md) |
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
