---
source_hash: 9e29489cf6d4746b
facts_hash: fc337e9611ca1f63
generated_at: 2026-06-13T16:42:30.310Z
generator_version: 1.0.0
model: fallback_no_llm
quality_score: 100
---
# File: lib/system/logger.js

## Purpose
Source file with 4 symbols and 46 lines. (LLM enrichment unavailable — fact-only mode.)

## Exports / API Surface
| Export | Type |
|--------|------|
| `debug` | cjs_named |
| `if` | method |
| `log` | cjs_named |
| `LOG_LEVEL` | cjs_named |
| `logStream` | cjs_named |
| `setIo` | cjs_named |

## Internal Logic
Detected symbols:
- `debug(msg)` (function)
- `if(globalIo)` (method)
- `log(msg, level = 'info')` (function)
- `setIo(ioInstance)` (function)

## Dependencies
| Module | Local |
|--------|-------|
| `fs` | No |
| `path` | No |

## Side Effects
- console_output
- env_access
- filesystem_write

## Dependents
No known dependents.

## Cross-References
No cross-references.


## Symbol Dependencies

### Upstream (Internal Calls)

| Symbol | Source File | Doc |
| --- | --- | --- |
| `write` | `lib/Context.js` | [Doc](../Context.js.md) |
| `error` | `lib/Logger.js` | [Doc](../Logger.js.md) |
| `error` | `tests/test-security-error-handling.js` | [Doc](../../tests/test-security-error-handling.js.md) |
| `error` | `tests/test-server-error-handling.js` | [Doc](../../tests/test-server-error-handling.js.md) |
| `emit` | `tests/test-server.js` | [Doc](../../tests/test-server.js.md) |
| `on` | `tests/test-server.js` | [Doc](../../tests/test-server.js.md) |

### Downstream (Impacted By)

| Symbol | Caller File | Doc |
| --- | --- | --- |
| `log` | `.github/workflows/onboarding-gate.yml` | [Doc](../../.github/workflows/onboarding-gate.yml.md) |
| `log` | `agents/Guru.js` | [Doc](../../agents/Guru.js.md) |
| `log` | `agents/Koshpal.js` | [Doc](../../agents/Koshpal.js.md) |
| `if` | `agents/Rakshak.js` | [Doc](../../agents/Rakshak.js.md) |
| `log` | `agents/Rakshak.js` | [Doc](../../agents/Rakshak.js.md) |
| `log` | `agents/Shilpi.js` | [Doc](../../agents/Shilpi.js.md) |
| `log` | `agents/Shishya.js` | [Doc](../../agents/Shishya.js.md) |
| `log` | `agents/Sutradhar.js` | [Doc](../../agents/Sutradhar.js.md) |
| `log` | `agents/Tark.js` | [Doc](../../agents/Tark.js.md) |
| `log` | `agents/TestAgent.js` | [Doc](../../agents/TestAgent.js.md) |
| `log` | `agents/TestDrona.js` | [Doc](../../agents/TestDrona.js.md) |
| `log` | `agents/Vaidya.js` | [Doc](../../agents/Vaidya.js.md) |
| `log` | `agents/Vishwakarma.js` | [Doc](../../agents/Vishwakarma.js.md) |
| `log` | `benchmarks/fs_express_benchmark.js` | [Doc](../../benchmarks/fs_express_benchmark.js.md) |
| `log` | `benchmarks/fs_read_benchmark.js` | [Doc](../../benchmarks/fs_read_benchmark.js.md) |
| `if` | `benchmarks/log_benchmark.js` | [Doc](../../benchmarks/log_benchmark.js.md) |
| `log` | `benchmarks/log_benchmark.js` | [Doc](../../benchmarks/log_benchmark.js.md) |
| `log` | `benchmarks/regex_loop_benchmark.js` | [Doc](../../benchmarks/regex_loop_benchmark.js.md) |
| `log` | `benchmarks/token_count.js` | [Doc](../../benchmarks/token_count.js.md) |
| `log` | `bin/dashboard.js` | [Doc](../../bin/dashboard.js.md) |
| `log` | `bin/setu-auth.js` | [Doc](../../bin/setu-auth.js.md) |
| `log` | `bin/setu-init.js` | [Doc](../../bin/setu-init.js.md) |
| `log` | `bin/setup.js` | [Doc](../../bin/setup.js.md) |
| `log` | `bin/test-dashboard.js` | [Doc](../../bin/test-dashboard.js.md) |
| `if` | `frontend/app/src/App.jsx` | [Doc](../../frontend/app/src/App.jsx.md) |
| `if` | `frontend/app/src/components/OnboardingStatus.jsx` | [Doc](../../frontend/app/src/components/OnboardingStatus.jsx.md) |
| `if` | `frontend/app/src/components/ScreenshotGallery.jsx` | [Doc](../../frontend/app/src/components/ScreenshotGallery.jsx.md) |
| `if` | `frontend/app/src/components/TaskDetailModal.jsx` | [Doc](../../frontend/app/src/components/TaskDetailModal.jsx.md) |
| `log` | `frontend/app/src/hooks/useSocket.js` | [Doc](../../frontend/app/src/hooks/useSocket.js.md) |
| `log` | `index.js` | [Doc](../../index.js.md) |
| `log` | `lib/AgentContextManager.js` | [Doc](../AgentContextManager.js.md) |
| `log` | `lib/Budget.js` | [Doc](../Budget.js.md) |
| `if` | `lib/Context.js` | [Doc](../Context.js.md) |
| `if` | `lib/Contractor.js` | [Doc](../Contractor.js.md) |
| `log` | `lib/Contractor.js` | [Doc](../Contractor.js.md) |
| `log` | `lib/CoreAgent.js` | [Doc](../CoreAgent.js.md) |
| `log` | `lib/db.js` | [Doc](../db.js.md) |
| `log` | `lib/LLM.js` | [Doc](../LLM.js.md) |
| `if` | `lib/llm/BaseProvider.js` | [Doc](../llm/BaseProvider.js.md) |
| `log` | `lib/Logger.js` | [Doc](../Logger.js.md) |
| `log` | `lib/models/providers/google.js` | [Doc](../models/providers/google.js.md) |
| `if` | `lib/onboarding/codeowners.js` | [Doc](../onboarding/codeowners.js.md) |
| `if` | `lib/onboarding/dependency-engine.js` | [Doc](../onboarding/dependency-engine.js.md) |
| `log` | `lib/onboarding/doc-enricher.js` | [Doc](../onboarding/doc-enricher.js.md) |
| `if` | `lib/onboarding/paths.js` | [Doc](../onboarding/paths.js.md) |
| `if` | `lib/server.js` | [Doc](../server.js.md) |
| `debug` | `lib/system/agentManager.js` | [Doc](./agentManager.js.md) |
| `log` | `lib/system/agentManager.js` | [Doc](./agentManager.js.md) |
| `debug` | `lib/system/boot.js` | [Doc](./boot.js.md) |
| `log` | `lib/system/boot.js` | [Doc](./boot.js.md) |
| `setIo` | `lib/system/boot.js` | [Doc](./boot.js.md) |
| `log` | `scripts/check-doc-links.js` | [Doc](../../scripts/check-doc-links.js.md) |
| `if` | `scripts/ignite.js` | [Doc](../../scripts/ignite.js.md) |
| `log` | `scripts/ignite.js` | [Doc](../../scripts/ignite.js.md) |
| `log` | `scripts/init_swarm.js` | [Doc](../../scripts/init_swarm.js.md) |
| `log` | `scripts/onboarding-status.js` | [Doc](../../scripts/onboarding-status.js.md) |
| `log` | `scripts/test-google-internal.js` | [Doc](../../scripts/test-google-internal.js.md) |
| `log` | `scripts/test-model-list-internal.js` | [Doc](../../scripts/test-model-list-internal.js.md) |
| `log` | `scripts/test-model-list-refined.js` | [Doc](../../scripts/test-model-list-refined.js.md) |
| `log` | `scripts/test-model-list.js` | [Doc](../../scripts/test-model-list.js.md) |
| `log` | `scripts/test-universal-llm.js` | [Doc](../../scripts/test-universal-llm.js.md) |
| `if` | `skills/drishti-v2/tools.js` | [Doc](../../skills/drishti-v2/tools.js.md) |
| `log` | `skills/drishti-vision/scripts/capture.js` | [Doc](../../skills/drishti-vision/scripts/capture.js.md) |
| `log` | `tests/benchmark_blocking.js` | [Doc](../../tests/benchmark_blocking.js.md) |
| `log` | `tests/core_agent_upgrade.test.js` | [Doc](../../tests/core_agent_upgrade.test.js.md) |
| `log` | `tests/debug-payload.js` | [Doc](../../tests/debug-payload.js.md) |
| `log` | `tests/list-models.js` | [Doc](../../tests/list-models.js.md) |
| `log` | `tests/minimal-auth-test.js` | [Doc](../../tests/minimal-auth-test.js.md) |
| `log` | `tests/runner.js` | [Doc](../../tests/runner.js.md) |
| `log` | `tests/steering-agent.js` | [Doc](../../tests/steering-agent.js.md) |
| `if` | `tests/test-agent-error-handling.js` | [Doc](../../tests/test-agent-error-handling.js.md) |
| `if` | `tests/test-agent.js` | [Doc](../../tests/test-agent.js.md) |
| `log` | `tests/test-agent.js` | [Doc](../../tests/test-agent.js.md) |
| `if` | `tests/test-auth-store-save-failure.js` | [Doc](../../tests/test-auth-store-save-failure.js.md) |
| `log` | `tests/test-auth-store-save-failure.js` | [Doc](../../tests/test-auth-store-save-failure.js.md) |
| `if` | `tests/test-auth-store.js` | [Doc](../../tests/test-auth-store.js.md) |
| `log` | `tests/test-auth-store.js` | [Doc](../../tests/test-auth-store.js.md) |
| `log` | `tests/test-base-provider.js` | [Doc](../../tests/test-base-provider.js.md) |
| `if` | `tests/test-budget.js` | [Doc](../../tests/test-budget.js.md) |
| `log` | `tests/test-chat-input-security.js` | [Doc](../../tests/test-chat-input-security.js.md) |
| `if` | `tests/test-context.js` | [Doc](../../tests/test-context.js.md) |
| `log` | `tests/test-context.js` | [Doc](../../tests/test-context.js.md) |
| `if` | `tests/test-contractor.js` | [Doc](../../tests/test-contractor.js.md) |
| `log` | `tests/test-contractor.js` | [Doc](../../tests/test-contractor.js.md) |
| `log` | `tests/test-core-agent-compaction.js` | [Doc](../../tests/test-core-agent-compaction.js.md) |
| `log` | `tests/test-core-agent-control.js` | [Doc](../../tests/test-core-agent-control.js.md) |
| `log` | `tests/test-core-agent-security.js` | [Doc](../../tests/test-core-agent-security.js.md) |
| `log` | `tests/test-core-agent.js` | [Doc](../../tests/test-core-agent.js.md) |
| `if` | `tests/test-core-server-routes.js` | [Doc](../../tests/test-core-server-routes.js.md) |
| `log` | `tests/test-dashboard-api.js` | [Doc](../../tests/test-dashboard-api.js.md) |
| `log` | `tests/test-dashboard-socket.js` | [Doc](../../tests/test-dashboard-socket.js.md) |
| `log` | `tests/test-dead-agents.js` | [Doc](../../tests/test-dead-agents.js.md) |
| `log` | `tests/test-dictator.js` | [Doc](../../tests/test-dictator.js.md) |
| `log` | `tests/test-doc-quality-gate.js` | [Doc](../../tests/test-doc-quality-gate.js.md) |
| `log` | `tests/test-drona-learning.js` | [Doc](../../tests/test-drona-learning.js.md) |
| `log` | `tests/test-drona-parsing.js` | [Doc](../../tests/test-drona-parsing.js.md) |
| `if` | `tests/test-events.js` | [Doc](../../tests/test-events.js.md) |
| `log` | `tests/test-events.js` | [Doc](../../tests/test-events.js.md) |
| `log` | `tests/test-google-auth-binding.js` | [Doc](../../tests/test-google-auth-binding.js.md) |
| `log` | `tests/test-google-provider-security.js` | [Doc](../../tests/test-google-provider-security.js.md) |
| `log` | `tests/test-intern-gate.js` | [Doc](../../tests/test-intern-gate.js.md) |
| `if` | `tests/test-json-parser.js` | [Doc](../../tests/test-json-parser.js.md) |
| `log` | `tests/test-json-parser.js` | [Doc](../../tests/test-json-parser.js.md) |
| `log` | `tests/test-llm-anthropic.js` | [Doc](../../tests/test-llm-anthropic.js.md) |
| `log` | `tests/test-llm-concurrency.js` | [Doc](../../tests/test-llm-concurrency.js.md) |
| `log` | `tests/test-llm-delegation.js` | [Doc](../../tests/test-llm-delegation.js.md) |
| `log` | `tests/test-llm-openai-compatible.js` | [Doc](../../tests/test-llm-openai-compatible.js.md) |
| `log` | `tests/test-llm-openai.js` | [Doc](../../tests/test-llm-openai.js.md) |
| `log` | `tests/test-llm-rate-limit.js` | [Doc](../../tests/test-llm-rate-limit.js.md) |
| `log` | `tests/test-llm.js` | [Doc](../../tests/test-llm.js.md) |
| `if` | `tests/test-log-reader.js` | [Doc](../../tests/test-log-reader.js.md) |
| `log` | `tests/test-log-reader.js` | [Doc](../../tests/test-log-reader.js.md) |
| `log` | `tests/test-log-watcher.js` | [Doc](../../tests/test-log-watcher.js.md) |
| `debug` | `tests/test-logger.js` | [Doc](../../tests/test-logger.js.md) |
| `if` | `tests/test-logger.js` | [Doc](../../tests/test-logger.js.md) |
| `log` | `tests/test-logger.js` | [Doc](../../tests/test-logger.js.md) |
| `if` | `tests/test-models-config.js` | [Doc](../../tests/test-models-config.js.md) |
| `log` | `tests/test-ollama.js` | [Doc](../../tests/test-ollama.js.md) |
| `if` | `tests/test-pariksha-security.js` | [Doc](../../tests/test-pariksha-security.js.md) |
| `log` | `tests/test-pariksha-security.js` | [Doc](../../tests/test-pariksha-security.js.md) |
| `log` | `tests/test-profile-mgr-selection.js` | [Doc](../../tests/test-profile-mgr-selection.js.md) |
| `log` | `tests/test-provider-factory.js` | [Doc](../../tests/test-provider-factory.js.md) |
| `log` | `tests/test-ranabhoomi.js` | [Doc](../../tests/test-ranabhoomi.js.md) |
| `log` | `tests/test-security-error-handling.js` | [Doc](../../tests/test-security-error-handling.js.md) |
| `log` | `tests/test-server-error-handling.js` | [Doc](../../tests/test-server-error-handling.js.md) |
| `log` | `tests/test-server.js` | [Doc](../../tests/test-server.js.md) |
| `if` | `tests/test-session-logger.js` | [Doc](../../tests/test-session-logger.js.md) |
| `log` | `tests/test-session-logger.js` | [Doc](../../tests/test-session-logger.js.md) |
| `if` | `tests/test-steering.js` | [Doc](../../tests/test-steering.js.md) |
| `log` | `tests/test-steering.js` | [Doc](../../tests/test-steering.js.md) |
| `log` | `tests/test-swarm-protocol.js` | [Doc](../../tests/test-swarm-protocol.js.md) |
| `if` | `tests/test-tasks-api.js` | [Doc](../../tests/test-tasks-api.js.md) |
| `log` | `tests/test-tasks-api.js` | [Doc](../../tests/test-tasks-api.js.md) |
| `log` | `tests/test-tasks-screenshots-security.js` | [Doc](../../tests/test-tasks-screenshots-security.js.md) |
| `log` | `tests/test-vishwakarma.js` | [Doc](../../tests/test-vishwakarma.js.md) |
| `log` | `tests/verify-agent-broadcast-optimization.js` | [Doc](../../tests/verify-agent-broadcast-optimization.js.md) |
| `if` | `tests/verify-async-logging.js` | [Doc](../../tests/verify-async-logging.js.md) |
| `log` | `tests/verify-async-logging.js` | [Doc](../../tests/verify-async-logging.js.md) |
| `log` | `tests/verify-auth-rate-limit.js` | [Doc](../../tests/verify-auth-rate-limit.js.md) |
| `log` | `tests/verify-auth-weak-default.js` | [Doc](../../tests/verify-auth-weak-default.js.md) |
| `log` | `tests/verify-core-agent-loop.js` | [Doc](../../tests/verify-core-agent-loop.js.md) |
| `log` | `tests/verify-core.js` | [Doc](../../tests/verify-core.js.md) |
| `log` | `tests/verify-google-auth-logger.js` | [Doc](../../tests/verify-google-auth-logger.js.md) |
| `log` | `tests/verify-google-auth-xss.js` | [Doc](../../tests/verify-google-auth-xss.js.md) |
| `log` | `tests/verify-headers.js` | [Doc](../../tests/verify-headers.js.md) |
| `log` | `tests/verify-index-broadcast.js` | [Doc](../../tests/verify-index-broadcast.js.md) |
| `log` | `tests/verify-llm-connection.js` | [Doc](../../tests/verify-llm-connection.js.md) |
| `if` | `tests/verify-log-watch.js` | [Doc](../../tests/verify-log-watch.js.md) |
| `log` | `tests/verify-log-watch.js` | [Doc](../../tests/verify-log-watch.js.md) |
| `log` | `tests/verify-onboarding-metrics.js` | [Doc](../../tests/verify-onboarding-metrics.js.md) |
| `if` | `tests/verify-proto-pollution.js` | [Doc](../../tests/verify-proto-pollution.js.md) |
| `log` | `tests/verify-proto-pollution.js` | [Doc](../../tests/verify-proto-pollution.js.md) |
| `log` | `tests/verify-rakshak.js` | [Doc](../../tests/verify-rakshak.js.md) |
