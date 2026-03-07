---
source_hash: cced78fceb6c23af
facts_hash: 24ee21668216b716
generated_at: 2026-03-07T20:03:51.548Z
generator_version: 1.0.0
model: fallback_no_llm
quality_score: 100
---
# File: lib/onboarding/dependency-engine.js

## Purpose
Source file with 5 symbols and 95 lines. (LLM enrichment unavailable — fact-only mode.)

## Exports / API Surface
| Export | Type |
|--------|------|
| `buildGlobalRegistry` | cjs_named |
| `computeImpactMap` | cjs_named |
| `for` | method |
| `resolveFileDependencies` | cjs_named |

## Internal Logic
Detected symbols:
- `buildGlobalRegistry(allFileFacts)` (function)
- `calls` (class)
- `computeImpactMap(allFileFacts, globalRegistry)` (function)
- `for(const facts of allFileFacts)` (method)
- `resolveFileDependencies(fileFacts, globalRegistry)` (function)

## Dependencies
| Module | Local |
|--------|-------|
| `fs` | No |
| `path` | No |

## Side Effects
No side effects detected.

## Dependents
- `context-builder.js` _(doc not yet generated)_
- [doc-enricher.js](./doc-enricher.js.md)

## Cross-References
- `context-builder.js` _(doc not yet generated)_
- [doc-enricher.js](./doc-enricher.js.md)


## Symbol Dependencies

### Upstream (Internal Calls)

| Symbol | Source File | Doc |
| --- | --- | --- |
| `if` | `agents/Guru.js` | [Doc](../../agents/Guru.js.md) |
| `if` | `agents/Koshpal.js` | [Doc](../../agents/Koshpal.js.md) |
| `if` | `agents/Rakshak.js` | [Doc](../../agents/Rakshak.js.md) |
| `if` | `agents/Shilpi.js` | [Doc](../../agents/Shilpi.js.md) |
| `if` | `agents/Shishya.js` | [Doc](../../agents/Shishya.js.md) |
| `if` | `agents/Sutradhar.js` | [Doc](../../agents/Sutradhar.js.md) |
| `if` | `agents/Tark.js` | [Doc](../../agents/Tark.js.md) |
| `if` | `agents/TestAgent.js` | [Doc](../../agents/TestAgent.js.md) |
| `if` | `agents/TestDrona.js` | [Doc](../../agents/TestDrona.js.md) |
| `if` | `agents/Vaidya.js` | [Doc](../../agents/Vaidya.js.md) |
| `if` | `agents/Vishwakarma.js` | [Doc](../../agents/Vishwakarma.js.md) |
| `if` | `benchmarks/regex_loop_benchmark.js` | [Doc](../../benchmarks/regex_loop_benchmark.js.md) |
| `if` | `benchmarks/token_count.js` | [Doc](../../benchmarks/token_count.js.md) |
| `if` | `bin/dashboard.js` | [Doc](../../bin/dashboard.js.md) |
| `if` | `bin/setu-auth.js` | [Doc](../../bin/setu-auth.js.md) |
| `if` | `bin/setu-init.js` | [Doc](../../bin/setu-init.js.md) |
| `if` | `bin/setup.js` | [Doc](../../bin/setup.js.md) |
| `if` | `frontend/app/src/components/ChatBox.jsx` | [Doc](../../frontend/app/src/components/ChatBox.jsx.md) |
| `if` | `frontend/app/src/components/Modal.jsx` | [Doc](../../frontend/app/src/components/Modal.jsx.md) |
| `if` | `frontend/app/src/components/TaskBoard.jsx` | [Doc](../../frontend/app/src/components/TaskBoard.jsx.md) |
| `if` | `frontend/app/src/components/TaskCard.jsx` | [Doc](../../frontend/app/src/components/TaskCard.jsx.md) |
| `if` | `frontend/app/src/components/TaskCreationModal.jsx` | [Doc](../../frontend/app/src/components/TaskCreationModal.jsx.md) |
| `if` | `frontend/app/src/hooks/useSocket.js` | [Doc](../../frontend/app/src/hooks/useSocket.js.md) |
| `if` | `frontend/app/src/utils/logUtils.js` | [Doc](../../frontend/app/src/utils/logUtils.js.md) |
| `if` | `index.js` | [Doc](../../index.js.md) |
| `if` | `lib/Agent.js` | [Doc](../Agent.js.md) |
| `if` | `lib/AgentContextManager.js` | [Doc](../AgentContextManager.js.md) |
| `if` | `lib/AgentToolExecutor.js` | [Doc](../AgentToolExecutor.js.md) |
| `if` | `lib/auth/auth-store.js` | [Doc](../auth/auth-store.js.md) |
| `if` | `lib/auth/basic.js` | [Doc](../auth/basic.js.md) |
| `if` | `lib/auth/google.js` | [Doc](../auth/google.js.md) |
| `if` | `lib/auth/profile-mgr.js` | [Doc](../auth/profile-mgr.js.md) |
| `if` | `lib/Budget.js` | [Doc](../Budget.js.md) |
| `if` | `lib/Camera.js` | [Doc](../Camera.js.md) |
| `get` | `lib/Config.js` | [Doc](../Config.js.md) |
| `if` | `lib/Config.js` | [Doc](../Config.js.md) |
| `if` | `lib/CoreAgent.js` | [Doc](../CoreAgent.js.md) |
| `if` | `lib/db.js` | [Doc](../db.js.md) |
| `if` | `lib/Docker.js` | [Doc](../Docker.js.md) |
| `if` | `lib/LLM.js` | [Doc](../LLM.js.md) |
| `if` | `lib/llm/Anthropic.js` | [Doc](../llm/Anthropic.js.md) |
| `if` | `lib/llm/Ollama.js` | [Doc](../llm/Ollama.js.md) |
| `if` | `lib/llm/OpenAI.js` | [Doc](../llm/OpenAI.js.md) |
| `if` | `lib/llm/OpenAICompatible.js` | [Doc](../llm/OpenAICompatible.js.md) |
| `if` | `lib/Logger.js` | [Doc](../Logger.js.md) |
| `if` | `lib/middleware/auth.js` | [Doc](../middleware/auth.js.md) |
| `if` | `lib/middleware/socketAuth.js` | [Doc](../middleware/socketAuth.js.md) |
| `if` | `lib/models/config.js` | [Doc](../models/config.js.md) |
| `if` | `lib/models/factory.js` | [Doc](../models/factory.js.md) |
| `if` | `lib/models/providers/anthropic.js` | [Doc](../models/providers/anthropic.js.md) |
| `if` | `lib/models/providers/google.js` | [Doc](../models/providers/google.js.md) |
| `if` | `lib/models/providers/ollama.js` | [Doc](../models/providers/ollama.js.md) |
| `if` | `lib/models/providers/openai.js` | [Doc](../models/providers/openai.js.md) |
| `if` | `lib/onboarding/changed-files.js` | [Doc](./changed-files.js.md) |
| `if` | `lib/onboarding/context-builder.js` | [Doc](./context-builder.js.md) |
| `if` | `lib/onboarding/doc-enricher.js` | [Doc](./doc-enricher.js.md) |
| `if` | `lib/onboarding/doc-facts.js` | [Doc](./doc-facts.js.md) |
| `if` | `lib/onboarding/doc-links.js` | [Doc](./doc-links.js.md) |
| `if` | `lib/onboarding/drift.js` | [Doc](./drift.js.md) |
| `if` | `lib/onboarding/generator.js` | [Doc](./generator.js.md) |
| `if` | `lib/onboarding/governance-profiles.js` | [Doc](./governance-profiles.js.md) |
| `if` | `lib/onboarding/status.js` | [Doc](./status.js.md) |
| `if` | `lib/Pariksha.js` | [Doc](../Pariksha.js.md) |
| `if` | `lib/routes.js` | [Doc](../routes.js.md) |
| `if` | `lib/routes/api.js` | [Doc](../routes/api.js.md) |
| `if` | `lib/server.js` | [Doc](../server.js.md) |
| `if` | `lib/SessionLogger.js` | [Doc](../SessionLogger.js.md) |
| `get` | `lib/SkillLoader.js` | [Doc](../SkillLoader.js.md) |
| `if` | `lib/SkillLoader.js` | [Doc](../SkillLoader.js.md) |
| `if` | `lib/socket.js` | [Doc](../socket.js.md) |
| `if` | `lib/sockets/dashboard.js` | [Doc](../sockets/dashboard.js.md) |
| `if` | `lib/utils.js` | [Doc](../utils.js.md) |
| `if` | `lib/utils/JsonParser.js` | [Doc](../utils/JsonParser.js.md) |
| `if` | `scripts/check-doc-links.js` | [Doc](../../scripts/check-doc-links.js.md) |
| `if` | `scripts/drift-step-summary.js` | [Doc](../../scripts/drift-step-summary.js.md) |
| `if` | `scripts/onboarding-status.js` | [Doc](../../scripts/onboarding-status.js.md) |
| `if` | `scripts/test-google-internal.js` | [Doc](../../scripts/test-google-internal.js.md) |
| `if` | `scripts/test-model-list-internal.js` | [Doc](../../scripts/test-model-list-internal.js.md) |
| `if` | `scripts/test-model-list-refined.js` | [Doc](../../scripts/test-model-list-refined.js.md) |
| `if` | `scripts/test-model-list.js` | [Doc](../../scripts/test-model-list.js.md) |
| `if` | `tests/benchmark_blocking.js` | [Doc](../../tests/benchmark_blocking.js.md) |
| `if` | `tests/core_agent_upgrade.test.js` | [Doc](../../tests/core_agent_upgrade.test.js.md) |
| `if` | `tests/debug-payload.js` | [Doc](../../tests/debug-payload.js.md) |
| `if` | `tests/list-models.js` | [Doc](../../tests/list-models.js.md) |
| `if` | `tests/minimal-auth-test.js` | [Doc](../../tests/minimal-auth-test.js.md) |
| `if` | `tests/runner.js` | [Doc](../../tests/runner.js.md) |
| `if` | `tests/test-auth-cleanup.js` | [Doc](../../tests/test-auth-cleanup.js.md) |
| `if` | `tests/test-camera.js` | [Doc](../../tests/test-camera.js.md) |
| `if` | `tests/test-chat-input-security.js` | [Doc](../../tests/test-chat-input-security.js.md) |
| `if` | `tests/test-config.js` | [Doc](../../tests/test-config.js.md) |
| `if` | `tests/test-core-agent-compaction.js` | [Doc](../../tests/test-core-agent-compaction.js.md) |
| `if` | `tests/test-core-agent-control.js` | [Doc](../../tests/test-core-agent-control.js.md) |
| `if` | `tests/test-core-agent-security.js` | [Doc](../../tests/test-core-agent-security.js.md) |
| `if` | `tests/test-core-agent.js` | [Doc](../../tests/test-core-agent.js.md) |
| `if` | `tests/test-core-db-stress.js` | [Doc](../../tests/test-core-db-stress.js.md) |
| `if` | `tests/test-core-socket.js` | [Doc](../../tests/test-core-socket.js.md) |
| `if` | `tests/test-dashboard-api.js` | [Doc](../../tests/test-dashboard-api.js.md) |
| `if` | `tests/test-dashboard-socket.js` | [Doc](../../tests/test-dashboard-socket.js.md) |
| `if` | `tests/test-db-caching.js` | [Doc](../../tests/test-db-caching.js.md) |
| `if` | `tests/test-db.js` | [Doc](../../tests/test-db.js.md) |
| `if` | `tests/test-dictator.js` | [Doc](../../tests/test-dictator.js.md) |
| `if` | `tests/test-doc-quality-gate.js` | [Doc](../../tests/test-doc-quality-gate.js.md) |
| `if` | `tests/test-docker.js` | [Doc](../../tests/test-docker.js.md) |
| `if` | `tests/test-drona-learning.js` | [Doc](../../tests/test-drona-learning.js.md) |
| `if` | `tests/test-drona-parsing.js` | [Doc](../../tests/test-drona-parsing.js.md) |
| `if` | `tests/test-google-auth-binding.js` | [Doc](../../tests/test-google-auth-binding.js.md) |
| `if` | `tests/test-google-provider-security.js` | [Doc](../../tests/test-google-provider-security.js.md) |
| `if` | `tests/test-intern-gate.js` | [Doc](../../tests/test-intern-gate.js.md) |
| `if` | `tests/test-llm-anthropic.js` | [Doc](../../tests/test-llm-anthropic.js.md) |
| `if` | `tests/test-llm-concurrency.js` | [Doc](../../tests/test-llm-concurrency.js.md) |
| `if` | `tests/test-llm-delegation.js` | [Doc](../../tests/test-llm-delegation.js.md) |
| `if` | `tests/test-llm-openai-compatible.js` | [Doc](../../tests/test-llm-openai-compatible.js.md) |
| `if` | `tests/test-llm-openai.js` | [Doc](../../tests/test-llm-openai.js.md) |
| `if` | `tests/test-llm-rate-limit.js` | [Doc](../../tests/test-llm-rate-limit.js.md) |
| `if` | `tests/test-log-watcher.js` | [Doc](../../tests/test-log-watcher.js.md) |
| `if` | `tests/test-ollama.js` | [Doc](../../tests/test-ollama.js.md) |
| `if` | `tests/test-pariksha.js` | [Doc](../../tests/test-pariksha.js.md) |
| `if` | `tests/test-profile-mgr-selection.js` | [Doc](../../tests/test-profile-mgr-selection.js.md) |
| `if` | `tests/test-provider-factory.js` | [Doc](../../tests/test-provider-factory.js.md) |
| `if` | `tests/test-ranabhoomi.js` | [Doc](../../tests/test-ranabhoomi.js.md) |
| `if` | `tests/test-security-error-handling.js` | [Doc](../../tests/test-security-error-handling.js.md) |
| `if` | `tests/test-server-error-handling.js` | [Doc](../../tests/test-server-error-handling.js.md) |
| `if` | `tests/test-server.js` | [Doc](../../tests/test-server.js.md) |
| `if` | `tests/test-skill-loader-load.js` | [Doc](../../tests/test-skill-loader-load.js.md) |
| `if` | `tests/test-socket-auth.js` | [Doc](../../tests/test-socket-auth.js.md) |
| `if` | `tests/test-tasks-screenshots-security.js` | [Doc](../../tests/test-tasks-screenshots-security.js.md) |
| `if` | `tests/test-token-estimation.js` | [Doc](../../tests/test-token-estimation.js.md) |
| `if` | `tests/test-vishwakarma.js` | [Doc](../../tests/test-vishwakarma.js.md) |
| `if` | `tests/verify-agent-broadcast-optimization.js` | [Doc](../../tests/verify-agent-broadcast-optimization.js.md) |
| `if` | `tests/verify-async-logging.js` | [Doc](../../tests/verify-async-logging.js.md) |
| `if` | `tests/verify-auth-malformed-header.js` | [Doc](../../tests/verify-auth-malformed-header.js.md) |
| `if` | `tests/verify-auth-rate-limit.js` | [Doc](../../tests/verify-auth-rate-limit.js.md) |
| `if` | `tests/verify-auth-weak-default.js` | [Doc](../../tests/verify-auth-weak-default.js.md) |
| `if` | `tests/verify-core-agent-loop.js` | [Doc](../../tests/verify-core-agent-loop.js.md) |
| `if` | `tests/verify-core.js` | [Doc](../../tests/verify-core.js.md) |
| `if` | `tests/verify-google-auth-logger.js` | [Doc](../../tests/verify-google-auth-logger.js.md) |
| `if` | `tests/verify-google-auth-xss.js` | [Doc](../../tests/verify-google-auth-xss.js.md) |
| `if` | `tests/verify-headers.js` | [Doc](../../tests/verify-headers.js.md) |
| `if` | `tests/verify-index-broadcast.js` | [Doc](../../tests/verify-index-broadcast.js.md) |
| `if` | `tests/verify-onboarding-metrics.js` | [Doc](../../tests/verify-onboarding-metrics.js.md) |
| `if` | `tests/verify-path-traversal.js` | [Doc](../../tests/verify-path-traversal.js.md) |
| `if` | `tests/verify-proto-pollution.js` | [Doc](../../tests/verify-proto-pollution.js.md) |
| `if` | `tests/verify-rakshak.js` | [Doc](../../tests/verify-rakshak.js.md) |
| `if` | `tests/verify-task-escalation.js` | [Doc](../../tests/verify-task-escalation.js.md) |

### Downstream (Impacted By)

| Symbol | Caller File | Doc |
| --- | --- | --- |
| `for` | `benchmarks/fs_express_benchmark.js` | [Doc](../../benchmarks/fs_express_benchmark.js.md) |
| `for` | `benchmarks/repro_prepare.js` | [Doc](../../benchmarks/repro_prepare.js.md) |
| `for` | `bin/setu-init.js` | [Doc](../../bin/setu-init.js.md) |
| `for` | `lib/middleware/auth.js` | [Doc](../middleware/auth.js.md) |
| `buildGlobalRegistry` | `lib/onboarding/context-builder.js` | [Doc](./context-builder.js.md) |
| `computeImpactMap` | `lib/onboarding/context-builder.js` | [Doc](./context-builder.js.md) |
| `buildGlobalRegistry` | `lib/onboarding/doc-enricher.js` | [Doc](./doc-enricher.js.md) |
| `computeImpactMap` | `lib/onboarding/doc-enricher.js` | [Doc](./doc-enricher.js.md) |
| `resolveFileDependencies` | `lib/onboarding/doc-enricher.js` | [Doc](./doc-enricher.js.md) |
