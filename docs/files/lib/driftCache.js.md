---
source_hash: a994cc6dedf92313
facts_hash: 51943391ddec2dc5
generated_at: 2026-06-13T16:46:33.109Z
generator_version: 1.0.0
model: fallback_no_llm
quality_score: 100
---
# File: lib/driftCache.js

## Purpose
Source file with 4 symbols and 71 lines. (LLM enrichment unavailable — fact-only mode.)

## Exports / API Surface
| Export | Type |
|--------|------|
| `for` | method |
| `getTotalRuns` | cjs_named |
| `if` | method |

## Internal Logic
Detected symbols:
- `for(let i = 0; i < chunk.length; ++i)` (method)
- `getTotalRuns(logPath)` (function)
- `if(!stats)` (method)
- `new_lines(0;
        await new Promise((resolve, reject)` (arrow)

## Dependencies
| Module | Local |
|--------|-------|
| `fs` | No |

## Side Effects
- console_output
- filesystem_read

## Dependents
No known dependents.

## Cross-References
No cross-references.


## Symbol Dependencies

### Upstream (Internal Calls)

| Symbol | Source File | Doc |
| --- | --- | --- |
| `error` | `lib/Logger.js` | [Doc](./Logger.js.md) |
| `catch` | `lib/onboarding/context-builder.js` | [Doc](./onboarding/context-builder.js.md) |
| `error` | `tests/test-security-error-handling.js` | [Doc](../tests/test-security-error-handling.js.md) |
| `error` | `tests/test-server-error-handling.js` | [Doc](../tests/test-server-error-handling.js.md) |
| `on` | `tests/test-server.js` | [Doc](../tests/test-server.js.md) |

### Downstream (Impacted By)

| Symbol | Caller File | Doc |
| --- | --- | --- |
| `if` | `agents/Rakshak.js` | [Doc](../agents/Rakshak.js.md) |
| `for` | `benchmarks/fs_express_benchmark.js` | [Doc](../benchmarks/fs_express_benchmark.js.md) |
| `if` | `benchmarks/log_benchmark.js` | [Doc](../benchmarks/log_benchmark.js.md) |
| `for` | `benchmarks/repro_prepare.js` | [Doc](../benchmarks/repro_prepare.js.md) |
| `for` | `bin/setu-init.js` | [Doc](../bin/setu-init.js.md) |
| `if` | `frontend/app/src/App.jsx` | [Doc](../frontend/app/src/App.jsx.md) |
| `if` | `frontend/app/src/components/OnboardingStatus.jsx` | [Doc](../frontend/app/src/components/OnboardingStatus.jsx.md) |
| `if` | `frontend/app/src/components/ScreenshotGallery.jsx` | [Doc](../frontend/app/src/components/ScreenshotGallery.jsx.md) |
| `if` | `frontend/app/src/components/TaskDetailModal.jsx` | [Doc](../frontend/app/src/components/TaskDetailModal.jsx.md) |
| `getTotalRuns` | `index.js` | [Doc](../index.js.md) |
| `if` | `lib/Context.js` | [Doc](./Context.js.md) |
| `if` | `lib/Contractor.js` | [Doc](./Contractor.js.md) |
| `if` | `lib/llm/BaseProvider.js` | [Doc](./llm/BaseProvider.js.md) |
| `for` | `lib/middleware/auth.js` | [Doc](./middleware/auth.js.md) |
| `if` | `lib/onboarding/codeowners.js` | [Doc](./onboarding/codeowners.js.md) |
| `if` | `lib/onboarding/dependency-engine.js` | [Doc](./onboarding/dependency-engine.js.md) |
| `if` | `lib/onboarding/paths.js` | [Doc](./onboarding/paths.js.md) |
| `getTotalRuns` | `lib/routes.js` | [Doc](./routes.js.md) |
| `getTotalRuns` | `lib/routes/api.js` | [Doc](./routes/api.js.md) |
| `if` | `lib/server.js` | [Doc](./server.js.md) |
| `if` | `scripts/ignite.js` | [Doc](../scripts/ignite.js.md) |
| `if` | `skills/drishti-v2/tools.js` | [Doc](../skills/drishti-v2/tools.js.md) |
| `if` | `tests/test-agent-error-handling.js` | [Doc](../tests/test-agent-error-handling.js.md) |
| `if` | `tests/test-agent.js` | [Doc](../tests/test-agent.js.md) |
| `if` | `tests/test-auth-store-save-failure.js` | [Doc](../tests/test-auth-store-save-failure.js.md) |
| `if` | `tests/test-auth-store.js` | [Doc](../tests/test-auth-store.js.md) |
| `if` | `tests/test-budget.js` | [Doc](../tests/test-budget.js.md) |
| `if` | `tests/test-context.js` | [Doc](../tests/test-context.js.md) |
| `if` | `tests/test-contractor.js` | [Doc](../tests/test-contractor.js.md) |
| `if` | `tests/test-core-server-routes.js` | [Doc](../tests/test-core-server-routes.js.md) |
| `if` | `tests/test-events.js` | [Doc](../tests/test-events.js.md) |
| `if` | `tests/test-json-parser.js` | [Doc](../tests/test-json-parser.js.md) |
| `if` | `tests/test-log-reader.js` | [Doc](../tests/test-log-reader.js.md) |
| `if` | `tests/test-logger.js` | [Doc](../tests/test-logger.js.md) |
| `if` | `tests/test-models-config.js` | [Doc](../tests/test-models-config.js.md) |
| `if` | `tests/test-pariksha-security.js` | [Doc](../tests/test-pariksha-security.js.md) |
| `if` | `tests/test-session-logger.js` | [Doc](../tests/test-session-logger.js.md) |
| `if` | `tests/test-steering.js` | [Doc](../tests/test-steering.js.md) |
| `if` | `tests/test-tasks-api.js` | [Doc](../tests/test-tasks-api.js.md) |
| `if` | `tests/verify-async-logging.js` | [Doc](../tests/verify-async-logging.js.md) |
| `if` | `tests/verify-log-watch.js` | [Doc](../tests/verify-log-watch.js.md) |
| `if` | `tests/verify-proto-pollution.js` | [Doc](../tests/verify-proto-pollution.js.md) |
