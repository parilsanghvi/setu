---
source_hash: e2abde831e5a0614
facts_hash: 6e39418caf9754c3
generated_at: 2026-05-18T20:10:09.264Z
generator_version: 1.0.0
model: fallback_no_llm
quality_score: 100
---
# File: tests/verify-auth-git-commit.js

## Purpose
Source file with 4 symbols and 70 lines. (LLM enrichment unavailable — fact-only mode.)

## Exports / API Surface
| Export | Type |
|--------|------|
| `if` | method |

## Internal Logic
Detected symbols:
- `if(path === 'express')` (method)
- `mockAuthMiddleware(req, res, next)` (function)
- `mockExpress()` (arrow)
- `mockLogger({ error: ()` (arrow)

## Dependencies
| Module | Local |
|--------|-------|
| `../lib/routes` | Yes |
| `assert` | No |
| `express` | No |
| `module` | No |

## Side Effects
- console_output
- database
- process_control

## Dependents
No known dependents.

## Cross-References
- [routes.js](../lib/routes.js.md)


## Symbol Dependencies

### Upstream (Internal Calls)

| Symbol | Source File | Doc |
| --- | --- | --- |
| `log` | `lib/Context.js` | [Doc](../lib/Context.js.md) |
| `error` | `lib/Logger.js` | [Doc](../lib/Logger.js.md) |
| `catch` | `lib/onboarding/context-builder.js` | [Doc](../lib/onboarding/context-builder.js.md) |
| `setupRoutes` | `lib/routes.js` | [Doc](../lib/routes.js.md) |
| `setupRoutes` | `lib/server.js` | [Doc](../lib/server.js.md) |
| `log` | `lib/SessionLogger.js` | [Doc](../lib/SessionLogger.js.md) |
| `error` | `tests/test-security-error-handling.js` | [Doc](./test-security-error-handling.js.md) |
| `error` | `tests/test-server-error-handling.js` | [Doc](./test-server-error-handling.js.md) |
| `log` | `tests/test-token-estimation.js` | [Doc](./test-token-estimation.js.md) |

### Downstream (Impacted By)

| Symbol | Caller File | Doc |
| --- | --- | --- |
| `if` | `agents/Rakshak.js` | [Doc](../agents/Rakshak.js.md) |
| `if` | `benchmarks/log_benchmark.js` | [Doc](../benchmarks/log_benchmark.js.md) |
| `if` | `frontend/app/src/App.jsx` | [Doc](../frontend/app/src/App.jsx.md) |
| `if` | `frontend/app/src/components/OnboardingStatus.jsx` | [Doc](../frontend/app/src/components/OnboardingStatus.jsx.md) |
| `if` | `frontend/app/src/components/ScreenshotGallery.jsx` | [Doc](../frontend/app/src/components/ScreenshotGallery.jsx.md) |
| `if` | `frontend/app/src/components/TaskDetailModal.jsx` | [Doc](../frontend/app/src/components/TaskDetailModal.jsx.md) |
| `if` | `lib/Context.js` | [Doc](../lib/Context.js.md) |
| `if` | `lib/Contractor.js` | [Doc](../lib/Contractor.js.md) |
| `if` | `lib/llm/BaseProvider.js` | [Doc](../lib/llm/BaseProvider.js.md) |
| `if` | `lib/onboarding/codeowners.js` | [Doc](../lib/onboarding/codeowners.js.md) |
| `if` | `lib/onboarding/dependency-engine.js` | [Doc](../lib/onboarding/dependency-engine.js.md) |
| `if` | `lib/onboarding/paths.js` | [Doc](../lib/onboarding/paths.js.md) |
| `if` | `lib/server.js` | [Doc](../lib/server.js.md) |
| `if` | `scripts/ignite.js` | [Doc](../scripts/ignite.js.md) |
| `if` | `skills/drishti-v2/tools.js` | [Doc](../skills/drishti-v2/tools.js.md) |
| `if` | `tests/test-agent-error-handling.js` | [Doc](./test-agent-error-handling.js.md) |
| `if` | `tests/test-agent.js` | [Doc](./test-agent.js.md) |
| `if` | `tests/test-auth-store-save-failure.js` | [Doc](./test-auth-store-save-failure.js.md) |
| `if` | `tests/test-auth-store.js` | [Doc](./test-auth-store.js.md) |
| `if` | `tests/test-budget.js` | [Doc](./test-budget.js.md) |
| `if` | `tests/test-context.js` | [Doc](./test-context.js.md) |
| `if` | `tests/test-contractor.js` | [Doc](./test-contractor.js.md) |
| `if` | `tests/test-core-server-routes.js` | [Doc](./test-core-server-routes.js.md) |
| `if` | `tests/test-events.js` | [Doc](./test-events.js.md) |
| `if` | `tests/test-json-parser.js` | [Doc](./test-json-parser.js.md) |
| `if` | `tests/test-log-reader.js` | [Doc](./test-log-reader.js.md) |
| `if` | `tests/test-logger.js` | [Doc](./test-logger.js.md) |
| `if` | `tests/test-models-config.js` | [Doc](./test-models-config.js.md) |
| `if` | `tests/test-pariksha-security.js` | [Doc](./test-pariksha-security.js.md) |
| `if` | `tests/test-session-logger.js` | [Doc](./test-session-logger.js.md) |
| `if` | `tests/test-steering.js` | [Doc](./test-steering.js.md) |
| `if` | `tests/test-tasks-api.js` | [Doc](./test-tasks-api.js.md) |
| `if` | `tests/verify-async-logging.js` | [Doc](./verify-async-logging.js.md) |
| `if` | `tests/verify-log-watch.js` | [Doc](./verify-log-watch.js.md) |
| `if` | `tests/verify-proto-pollution.js` | [Doc](./verify-proto-pollution.js.md) |
