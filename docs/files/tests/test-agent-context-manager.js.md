---
source_hash: 2a25437873dc5d0a
facts_hash: 130a3ebe1288137c
generated_at: 2026-05-17T12:58:34.166Z
generator_version: 1.0.0
model: fallback_no_llm
quality_score: 100
---
# File: tests/test-agent-context-manager.js

## Purpose
Source file with 2 symbols and 89 lines. (LLM enrichment unavailable — fact-only mode.)

## Exports / API Surface
No detected exports.


## Internal Logic
Detected symbols:
- `mockAgent({
        context: [], logger: {
            info: ()` (arrow)
- `runTest()` (function)

## Dependencies
| Module | Local |
|--------|-------|
| `../lib/AgentContextManager` | Yes |
| `assert` | No |
| `module` | No |

## Side Effects
- console_output
- process_control

## Dependents
No known dependents.

## Cross-References
- [AgentContextManager.js](../lib/AgentContextManager.js.md)


## Symbol Dependencies

### Upstream (Internal Calls)

| Symbol | Source File | Doc |
| --- | --- | --- |
| `if` | `agents/Guru.js` | [Doc](../agents/Guru.js.md) |
| `if` | `agents/Koshpal.js` | [Doc](../agents/Koshpal.js.md) |
| `if` | `agents/Rakshak.js` | [Doc](../agents/Rakshak.js.md) |
| `if` | `agents/Shilpi.js` | [Doc](../agents/Shilpi.js.md) |
| `if` | `agents/Shishya.js` | [Doc](../agents/Shishya.js.md) |
| `if` | `agents/Sutradhar.js` | [Doc](../agents/Sutradhar.js.md) |
| `if` | `agents/Tark.js` | [Doc](../agents/Tark.js.md) |
| `if` | `agents/TestAgent.js` | [Doc](../agents/TestAgent.js.md) |
| `if` | `agents/TestDrona.js` | [Doc](../agents/TestDrona.js.md) |
| `if` | `agents/Vaidya.js` | [Doc](../agents/Vaidya.js.md) |
| `if` | `agents/Vishwakarma.js` | [Doc](../agents/Vishwakarma.js.md) |
| `if` | `benchmarks/regex_loop_benchmark.js` | [Doc](../benchmarks/regex_loop_benchmark.js.md) |
| `if` | `benchmarks/token_count.js` | [Doc](../benchmarks/token_count.js.md) |
| `if` | `bin/dashboard.js` | [Doc](../bin/dashboard.js.md) |
| `if` | `bin/setu-auth.js` | [Doc](../bin/setu-auth.js.md) |
| `if` | `bin/setu-init.js` | [Doc](../bin/setu-init.js.md) |
| `if` | `bin/setup.js` | [Doc](../bin/setup.js.md) |
| `if` | `frontend/app/src/components/ChatBox.jsx` | [Doc](../frontend/app/src/components/ChatBox.jsx.md) |
| `if` | `frontend/app/src/components/Modal.jsx` | [Doc](../frontend/app/src/components/Modal.jsx.md) |
| `if` | `frontend/app/src/components/TaskBoard.jsx` | [Doc](../frontend/app/src/components/TaskBoard.jsx.md) |
| `if` | `frontend/app/src/components/TaskCard.jsx` | [Doc](../frontend/app/src/components/TaskCard.jsx.md) |
| `if` | `frontend/app/src/components/TaskCreationModal.jsx` | [Doc](../frontend/app/src/components/TaskCreationModal.jsx.md) |
| `if` | `frontend/app/src/hooks/useSocket.js` | [Doc](../frontend/app/src/hooks/useSocket.js.md) |
| `if` | `frontend/app/src/utils/logUtils.js` | [Doc](../frontend/app/src/utils/logUtils.js.md) |
| `if` | `index.js` | [Doc](../index.js.md) |
| `if` | `lib/Agent.js` | [Doc](../lib/Agent.js.md) |
| `AgentContextManager` | `lib/AgentContextManager.js` | [Doc](../lib/AgentContextManager.js.md) |
| `estimateJsonLength` | `lib/AgentContextManager.js` | [Doc](../lib/AgentContextManager.js.md) |
| `estimateTokenCount` | `lib/AgentContextManager.js` | [Doc](../lib/AgentContextManager.js.md) |
| `if` | `lib/AgentContextManager.js` | [Doc](../lib/AgentContextManager.js.md) |
| `if` | `lib/AgentToolExecutor.js` | [Doc](../lib/AgentToolExecutor.js.md) |
| `if` | `lib/auth/auth-store.js` | [Doc](../lib/auth/auth-store.js.md) |
| `if` | `lib/auth/basic.js` | [Doc](../lib/auth/basic.js.md) |
| `if` | `lib/auth/google.js` | [Doc](../lib/auth/google.js.md) |
| `if` | `lib/auth/profile-mgr.js` | [Doc](../lib/auth/profile-mgr.js.md) |
| `if` | `lib/Budget.js` | [Doc](../lib/Budget.js.md) |
| `if` | `lib/Camera.js` | [Doc](../lib/Camera.js.md) |
| `if` | `lib/Config.js` | [Doc](../lib/Config.js.md) |
| `log` | `lib/Context.js` | [Doc](../lib/Context.js.md) |
| `estimateTokenCount` | `lib/CoreAgent.js` | [Doc](../lib/CoreAgent.js.md) |
| `if` | `lib/CoreAgent.js` | [Doc](../lib/CoreAgent.js.md) |
| `if` | `lib/db.js` | [Doc](../lib/db.js.md) |
| `if` | `lib/Docker.js` | [Doc](../lib/Docker.js.md) |
| `if` | `lib/LLM.js` | [Doc](../lib/LLM.js.md) |
| `if` | `lib/llm/Anthropic.js` | [Doc](../lib/llm/Anthropic.js.md) |
| `if` | `lib/llm/Ollama.js` | [Doc](../lib/llm/Ollama.js.md) |
| `if` | `lib/llm/OpenAI.js` | [Doc](../lib/llm/OpenAI.js.md) |
| `if` | `lib/llm/OpenAICompatible.js` | [Doc](../lib/llm/OpenAICompatible.js.md) |
| `error` | `lib/Logger.js` | [Doc](../lib/Logger.js.md) |
| `if` | `lib/Logger.js` | [Doc](../lib/Logger.js.md) |
| `if` | `lib/middleware/auth.js` | [Doc](../lib/middleware/auth.js.md) |
| `if` | `lib/middleware/socketAuth.js` | [Doc](../lib/middleware/socketAuth.js.md) |
| `if` | `lib/models/config.js` | [Doc](../lib/models/config.js.md) |
| `if` | `lib/models/factory.js` | [Doc](../lib/models/factory.js.md) |
| `if` | `lib/models/providers/anthropic.js` | [Doc](../lib/models/providers/anthropic.js.md) |
| `if` | `lib/models/providers/google.js` | [Doc](../lib/models/providers/google.js.md) |
| `if` | `lib/models/providers/ollama.js` | [Doc](../lib/models/providers/ollama.js.md) |
| `if` | `lib/models/providers/openai.js` | [Doc](../lib/models/providers/openai.js.md) |
| `if` | `lib/onboarding/changed-files.js` | [Doc](../lib/onboarding/changed-files.js.md) |
| `catch` | `lib/onboarding/context-builder.js` | [Doc](../lib/onboarding/context-builder.js.md) |
| `if` | `lib/onboarding/context-builder.js` | [Doc](../lib/onboarding/context-builder.js.md) |
| `if` | `lib/onboarding/doc-enricher.js` | [Doc](../lib/onboarding/doc-enricher.js.md) |
| `if` | `lib/onboarding/doc-facts.js` | [Doc](../lib/onboarding/doc-facts.js.md) |
| `if` | `lib/onboarding/doc-links.js` | [Doc](../lib/onboarding/doc-links.js.md) |
| `if` | `lib/onboarding/drift.js` | [Doc](../lib/onboarding/drift.js.md) |
| `if` | `lib/onboarding/generator.js` | [Doc](../lib/onboarding/generator.js.md) |
| `if` | `lib/onboarding/governance-profiles.js` | [Doc](../lib/onboarding/governance-profiles.js.md) |
| `if` | `lib/onboarding/status.js` | [Doc](../lib/onboarding/status.js.md) |
| `if` | `lib/Pariksha.js` | [Doc](../lib/Pariksha.js.md) |
| `if` | `lib/routes.js` | [Doc](../lib/routes.js.md) |
| `if` | `lib/routes/api.js` | [Doc](../lib/routes/api.js.md) |
| `if` | `lib/server.js` | [Doc](../lib/server.js.md) |
| `if` | `lib/SessionLogger.js` | [Doc](../lib/SessionLogger.js.md) |
| `log` | `lib/SessionLogger.js` | [Doc](../lib/SessionLogger.js.md) |
| `if` | `lib/SkillLoader.js` | [Doc](../lib/SkillLoader.js.md) |
| `if` | `lib/socket.js` | [Doc](../lib/socket.js.md) |
| `if` | `lib/sockets/dashboard.js` | [Doc](../lib/sockets/dashboard.js.md) |
| `estimateJsonLength` | `lib/utils.js` | [Doc](../lib/utils.js.md) |
| `if` | `lib/utils.js` | [Doc](../lib/utils.js.md) |
| `if` | `lib/utils/JsonParser.js` | [Doc](../lib/utils/JsonParser.js.md) |
| `if` | `scripts/check-doc-links.js` | [Doc](../scripts/check-doc-links.js.md) |
| `if` | `scripts/drift-step-summary.js` | [Doc](../scripts/drift-step-summary.js.md) |
| `if` | `scripts/onboarding-status.js` | [Doc](../scripts/onboarding-status.js.md) |
| `if` | `scripts/test-google-internal.js` | [Doc](../scripts/test-google-internal.js.md) |
| `if` | `scripts/test-model-list-internal.js` | [Doc](../scripts/test-model-list-internal.js.md) |
| `if` | `scripts/test-model-list-refined.js` | [Doc](../scripts/test-model-list-refined.js.md) |
| `if` | `scripts/test-model-list.js` | [Doc](../scripts/test-model-list.js.md) |
| `if` | `tests/benchmark_blocking.js` | [Doc](./benchmark_blocking.js.md) |
| `if` | `tests/core_agent_upgrade.test.js` | [Doc](./core_agent_upgrade.test.js.md) |
| `if` | `tests/debug-payload.js` | [Doc](./debug-payload.js.md) |
| `if` | `tests/list-models.js` | [Doc](./list-models.js.md) |
| `if` | `tests/minimal-auth-test.js` | [Doc](./minimal-auth-test.js.md) |
| `if` | `tests/runner.js` | [Doc](./runner.js.md) |
| `if` | `tests/test-auth-cleanup.js` | [Doc](./test-auth-cleanup.js.md) |
| `if` | `tests/test-camera.js` | [Doc](./test-camera.js.md) |
| `if` | `tests/test-chat-input-security.js` | [Doc](./test-chat-input-security.js.md) |
| `if` | `tests/test-config.js` | [Doc](./test-config.js.md) |
| `if` | `tests/test-core-agent-compaction.js` | [Doc](./test-core-agent-compaction.js.md) |
| `if` | `tests/test-core-agent-control.js` | [Doc](./test-core-agent-control.js.md) |
| `if` | `tests/test-core-agent-security.js` | [Doc](./test-core-agent-security.js.md) |
| `if` | `tests/test-core-agent.js` | [Doc](./test-core-agent.js.md) |
| `if` | `tests/test-core-db-stress.js` | [Doc](./test-core-db-stress.js.md) |
| `if` | `tests/test-core-socket.js` | [Doc](./test-core-socket.js.md) |
| `if` | `tests/test-dashboard-api.js` | [Doc](./test-dashboard-api.js.md) |
| `if` | `tests/test-dashboard-socket.js` | [Doc](./test-dashboard-socket.js.md) |
| `if` | `tests/test-db-caching.js` | [Doc](./test-db-caching.js.md) |
| `if` | `tests/test-db.js` | [Doc](./test-db.js.md) |
| `if` | `tests/test-dictator.js` | [Doc](./test-dictator.js.md) |
| `if` | `tests/test-doc-quality-gate.js` | [Doc](./test-doc-quality-gate.js.md) |
| `if` | `tests/test-docker.js` | [Doc](./test-docker.js.md) |
| `if` | `tests/test-drona-learning.js` | [Doc](./test-drona-learning.js.md) |
| `if` | `tests/test-drona-parsing.js` | [Doc](./test-drona-parsing.js.md) |
| `if` | `tests/test-google-auth-binding.js` | [Doc](./test-google-auth-binding.js.md) |
| `if` | `tests/test-google-provider-security.js` | [Doc](./test-google-provider-security.js.md) |
| `if` | `tests/test-intern-gate.js` | [Doc](./test-intern-gate.js.md) |
| `if` | `tests/test-llm-anthropic.js` | [Doc](./test-llm-anthropic.js.md) |
| `if` | `tests/test-llm-concurrency.js` | [Doc](./test-llm-concurrency.js.md) |
| `if` | `tests/test-llm-delegation.js` | [Doc](./test-llm-delegation.js.md) |
| `if` | `tests/test-llm-openai-compatible.js` | [Doc](./test-llm-openai-compatible.js.md) |
| `if` | `tests/test-llm-openai.js` | [Doc](./test-llm-openai.js.md) |
| `if` | `tests/test-llm-rate-limit.js` | [Doc](./test-llm-rate-limit.js.md) |
| `if` | `tests/test-log-watcher.js` | [Doc](./test-log-watcher.js.md) |
| `if` | `tests/test-ollama.js` | [Doc](./test-ollama.js.md) |
| `if` | `tests/test-pariksha.js` | [Doc](./test-pariksha.js.md) |
| `if` | `tests/test-profile-mgr-selection.js` | [Doc](./test-profile-mgr-selection.js.md) |
| `if` | `tests/test-provider-factory.js` | [Doc](./test-provider-factory.js.md) |
| `if` | `tests/test-ranabhoomi.js` | [Doc](./test-ranabhoomi.js.md) |
| `error` | `tests/test-security-error-handling.js` | [Doc](./test-security-error-handling.js.md) |
| `if` | `tests/test-security-error-handling.js` | [Doc](./test-security-error-handling.js.md) |
| `error` | `tests/test-server-error-handling.js` | [Doc](./test-server-error-handling.js.md) |
| `if` | `tests/test-server-error-handling.js` | [Doc](./test-server-error-handling.js.md) |
| `if` | `tests/test-server.js` | [Doc](./test-server.js.md) |
| `if` | `tests/test-skill-loader-load.js` | [Doc](./test-skill-loader-load.js.md) |
| `if` | `tests/test-socket-auth.js` | [Doc](./test-socket-auth.js.md) |
| `if` | `tests/test-tasks-screenshots-security.js` | [Doc](./test-tasks-screenshots-security.js.md) |
| `if` | `tests/test-token-estimation.js` | [Doc](./test-token-estimation.js.md) |
| `log` | `tests/test-token-estimation.js` | [Doc](./test-token-estimation.js.md) |
| `if` | `tests/test-vishwakarma.js` | [Doc](./test-vishwakarma.js.md) |
| `if` | `tests/verify-agent-broadcast-optimization.js` | [Doc](./verify-agent-broadcast-optimization.js.md) |
| `if` | `tests/verify-auth-malformed-header.js` | [Doc](./verify-auth-malformed-header.js.md) |
| `if` | `tests/verify-auth-rate-limit.js` | [Doc](./verify-auth-rate-limit.js.md) |
| `if` | `tests/verify-auth-weak-default.js` | [Doc](./verify-auth-weak-default.js.md) |
| `if` | `tests/verify-core-agent-loop.js` | [Doc](./verify-core-agent-loop.js.md) |
| `if` | `tests/verify-core.js` | [Doc](./verify-core.js.md) |
| `if` | `tests/verify-google-auth-logger.js` | [Doc](./verify-google-auth-logger.js.md) |
| `if` | `tests/verify-google-auth-xss.js` | [Doc](./verify-google-auth-xss.js.md) |
| `if` | `tests/verify-headers.js` | [Doc](./verify-headers.js.md) |
| `if` | `tests/verify-index-broadcast.js` | [Doc](./verify-index-broadcast.js.md) |
| `if` | `tests/verify-onboarding-metrics.js` | [Doc](./verify-onboarding-metrics.js.md) |
| `if` | `tests/verify-path-traversal.js` | [Doc](./verify-path-traversal.js.md) |
| `if` | `tests/verify-proto-pollution.js` | [Doc](./verify-proto-pollution.js.md) |
| `if` | `tests/verify-rakshak.js` | [Doc](./verify-rakshak.js.md) |
| `if` | `tests/verify-task-escalation.js` | [Doc](./verify-task-escalation.js.md) |

*No downstream callers detected.*
