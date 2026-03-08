---
source_hash: 8c402d0ea01b6416
facts_hash: ed1de1f6087363c8
generated_at: 2026-03-08T19:57:26.462Z
generator_version: 1.0.0
model: fallback_no_llm
quality_score: 100
---
# File: lib/onboarding/context-builder.js

## Purpose
Source file with 12 symbols and 379 lines. (LLM enrichment unavailable — fact-only mode.)

## Exports / API Surface
| Export | Type |
|--------|------|
| `buildContextJSON` | cjs_named |
| `buildContextPackage` | cjs_named |
| `catch` | method |
| `for` | method |
| `if` | method |
| `resolveTargetFiles` | cjs_named |
| `scanAllFiles` | cjs_named |
| `walkDependencies` | cjs_named |

## Internal Logic
Detected symbols:
- `allFacts(allSourceFiles.map(f)` (arrow)
- `buildContextJSON({ targetFiles, taskDescription, repoRoot, depth = 2 })` (function)
- `buildContextPackage({ targetFiles, taskDescription, repoRoot, depth = 2 })` (function)
- `catch(_)` (method)
- `extractDocSections(docContent)` (function)
- `for(const relFile of allFiles)` (method)
- `if(matches.size === 0)` (method)
- `readFileDoc(relPath, repoRoot)` (function)
- `resolveTargetFiles(taskDescription, repoRoot)` (function)
- `scanAllFiles(repoRoot, dir = '')` (function)
- `targets(targetFiles.map(file)` (arrow)
- `walkDependencies(targetFiles, repoRoot, depth = 2)` (function)

## Dependencies
| Module | Local |
|--------|-------|
| `./dependency-engine` | Yes |
| `./doc-facts` | Yes |
| `./status` | Yes |
| `fs` | No |
| `path` | No |

## Side Effects
- database
- filesystem_read
- subprocess

## Dependents
No known dependents.

## Cross-References
- [dependency-engine.js](./dependency-engine.js.md)
- [doc-facts.js](./doc-facts.js.md)
- [status.js](./status.js.md)


## Symbol Dependencies

### Upstream (Internal Calls)

| Symbol | Source File | Doc |
| --- | --- | --- |
| `while` | `agents/Guru.js` | [Doc](../../agents/Guru.js.md) |
| `get` | `lib/Config.js` | [Doc](../Config.js.md) |
| `while` | `lib/CoreAgent.js` | [Doc](../CoreAgent.js.md) |
| `buildGlobalRegistry` | `lib/onboarding/dependency-engine.js` | [Doc](./dependency-engine.js.md) |
| `computeImpactMap` | `lib/onboarding/dependency-engine.js` | [Doc](./dependency-engine.js.md) |
| `extractFacts` | `lib/onboarding/doc-facts.js` | [Doc](./doc-facts.js.md) |
| `get` | `lib/SkillLoader.js` | [Doc](../SkillLoader.js.md) |
| `while` | `lib/utils.js` | [Doc](../utils.js.md) |
| `while` | `tests/benchmark_blocking.js` | [Doc](../../tests/benchmark_blocking.js.md) |

### Downstream (Impacted By)

| Symbol | Caller File | Doc |
| --- | --- | --- |
| `catch` | `agents/Guru.js` | [Doc](../../agents/Guru.js.md) |
| `if` | `agents/Rakshak.js` | [Doc](../../agents/Rakshak.js.md) |
| `catch` | `agents/Sutradhar.js` | [Doc](../../agents/Sutradhar.js.md) |
| `buildContextJSON` | `agents/Vaidya.js` | [Doc](../../agents/Vaidya.js.md) |
| `buildContextPackage` | `agents/Vaidya.js` | [Doc](../../agents/Vaidya.js.md) |
| `catch` | `agents/Vaidya.js` | [Doc](../../agents/Vaidya.js.md) |
| `catch` | `agents/Vishwakarma.js` | [Doc](../../agents/Vishwakarma.js.md) |
| `catch` | `benchmarks/fs_express_benchmark.js` | [Doc](../../benchmarks/fs_express_benchmark.js.md) |
| `for` | `benchmarks/fs_express_benchmark.js` | [Doc](../../benchmarks/fs_express_benchmark.js.md) |
| `catch` | `benchmarks/log_benchmark.js` | [Doc](../../benchmarks/log_benchmark.js.md) |
| `if` | `benchmarks/log_benchmark.js` | [Doc](../../benchmarks/log_benchmark.js.md) |
| `for` | `benchmarks/repro_prepare.js` | [Doc](../../benchmarks/repro_prepare.js.md) |
| `catch` | `bin/dashboard.js` | [Doc](../../bin/dashboard.js.md) |
| `catch` | `bin/setu-auth.js` | [Doc](../../bin/setu-auth.js.md) |
| `catch` | `bin/setu-init.js` | [Doc](../../bin/setu-init.js.md) |
| `for` | `bin/setu-init.js` | [Doc](../../bin/setu-init.js.md) |
| `catch` | `bin/setup.js` | [Doc](../../bin/setup.js.md) |
| `catch` | `bin/test-dashboard.js` | [Doc](../../bin/test-dashboard.js.md) |
| `catch` | `frontend/app/src/App.jsx` | [Doc](../../frontend/app/src/App.jsx.md) |
| `if` | `frontend/app/src/App.jsx` | [Doc](../../frontend/app/src/App.jsx.md) |
| `if` | `frontend/app/src/components/OnboardingStatus.jsx` | [Doc](../../frontend/app/src/components/OnboardingStatus.jsx.md) |
| `catch` | `frontend/app/src/components/ScreenshotGallery.jsx` | [Doc](../../frontend/app/src/components/ScreenshotGallery.jsx.md) |
| `if` | `frontend/app/src/components/ScreenshotGallery.jsx` | [Doc](../../frontend/app/src/components/ScreenshotGallery.jsx.md) |
| `if` | `frontend/app/src/components/TaskDetailModal.jsx` | [Doc](../../frontend/app/src/components/TaskDetailModal.jsx.md) |
| `catch` | `frontend/app/src/hooks/useSocket.js` | [Doc](../../frontend/app/src/hooks/useSocket.js.md) |
| `catch` | `index.js` | [Doc](../../index.js.md) |
| `catch` | `lib/Agent.js` | [Doc](../Agent.js.md) |
| `catch` | `lib/AgentContextManager.js` | [Doc](../AgentContextManager.js.md) |
| `catch` | `lib/AgentToolExecutor.js` | [Doc](../AgentToolExecutor.js.md) |
| `catch` | `lib/auth/auth-store.js` | [Doc](../auth/auth-store.js.md) |
| `catch` | `lib/auth/basic.js` | [Doc](../auth/basic.js.md) |
| `catch` | `lib/auth/google.js` | [Doc](../auth/google.js.md) |
| `catch` | `lib/Camera.js` | [Doc](../Camera.js.md) |
| `if` | `lib/Context.js` | [Doc](../Context.js.md) |
| `catch` | `lib/Contractor.js` | [Doc](../Contractor.js.md) |
| `if` | `lib/Contractor.js` | [Doc](../Contractor.js.md) |
| `catch` | `lib/CoreAgent.js` | [Doc](../CoreAgent.js.md) |
| `catch` | `lib/db.js` | [Doc](../db.js.md) |
| `catch` | `lib/Docker.js` | [Doc](../Docker.js.md) |
| `catch` | `lib/LLM.js` | [Doc](../LLM.js.md) |
| `catch` | `lib/llm/Anthropic.js` | [Doc](../llm/Anthropic.js.md) |
| `if` | `lib/llm/BaseProvider.js` | [Doc](../llm/BaseProvider.js.md) |
| `catch` | `lib/llm/Ollama.js` | [Doc](../llm/Ollama.js.md) |
| `catch` | `lib/llm/OpenAI.js` | [Doc](../llm/OpenAI.js.md) |
| `catch` | `lib/llm/OpenAICompatible.js` | [Doc](../llm/OpenAICompatible.js.md) |
| `for` | `lib/middleware/auth.js` | [Doc](../middleware/auth.js.md) |
| `catch` | `lib/models/config.js` | [Doc](../models/config.js.md) |
| `catch` | `lib/models/providers/anthropic.js` | [Doc](../models/providers/anthropic.js.md) |
| `catch` | `lib/models/providers/google.js` | [Doc](../models/providers/google.js.md) |
| `catch` | `lib/models/providers/ollama.js` | [Doc](../models/providers/ollama.js.md) |
| `catch` | `lib/models/providers/openai.js` | [Doc](../models/providers/openai.js.md) |
| `catch` | `lib/onboarding/changed-files.js` | [Doc](./changed-files.js.md) |
| `if` | `lib/onboarding/codeowners.js` | [Doc](./codeowners.js.md) |
| `if` | `lib/onboarding/dependency-engine.js` | [Doc](./dependency-engine.js.md) |
| `catch` | `lib/onboarding/doc-enricher.js` | [Doc](./doc-enricher.js.md) |
| `catch` | `lib/onboarding/doc-facts.js` | [Doc](./doc-facts.js.md) |
| `catch` | `lib/onboarding/drift.js` | [Doc](./drift.js.md) |
| `catch` | `lib/onboarding/generator.js` | [Doc](./generator.js.md) |
| `catch` | `lib/onboarding/governance-profiles.js` | [Doc](./governance-profiles.js.md) |
| `if` | `lib/onboarding/paths.js` | [Doc](./paths.js.md) |
| `catch` | `lib/onboarding/status.js` | [Doc](./status.js.md) |
| `catch` | `lib/Pariksha.js` | [Doc](../Pariksha.js.md) |
| `catch` | `lib/routes.js` | [Doc](../routes.js.md) |
| `catch` | `lib/routes/api.js` | [Doc](../routes/api.js.md) |
| `if` | `lib/server.js` | [Doc](../server.js.md) |
| `catch` | `lib/SessionLogger.js` | [Doc](../SessionLogger.js.md) |
| `catch` | `lib/SkillLoader.js` | [Doc](../SkillLoader.js.md) |
| `catch` | `lib/socket.js` | [Doc](../socket.js.md) |
| `catch` | `lib/sockets/dashboard.js` | [Doc](../sockets/dashboard.js.md) |
| `catch` | `lib/utils.js` | [Doc](../utils.js.md) |
| `catch` | `lib/utils/JsonParser.js` | [Doc](../utils/JsonParser.js.md) |
| `catch` | `scripts/drift-step-summary.js` | [Doc](../../scripts/drift-step-summary.js.md) |
| `if` | `scripts/ignite.js` | [Doc](../../scripts/ignite.js.md) |
| `catch` | `scripts/onboarding-status.js` | [Doc](../../scripts/onboarding-status.js.md) |
| `catch` | `scripts/test-google-internal.js` | [Doc](../../scripts/test-google-internal.js.md) |
| `catch` | `scripts/test-model-list-internal.js` | [Doc](../../scripts/test-model-list-internal.js.md) |
| `catch` | `scripts/test-model-list-refined.js` | [Doc](../../scripts/test-model-list-refined.js.md) |
| `catch` | `scripts/test-model-list.js` | [Doc](../../scripts/test-model-list.js.md) |
| `catch` | `scripts/test-universal-llm.js` | [Doc](../../scripts/test-universal-llm.js.md) |
| `catch` | `skills/drishti-v2/tools.js` | [Doc](../../skills/drishti-v2/tools.js.md) |
| `catch` | `skills/drishti-vision/scripts/capture.js` | [Doc](../../skills/drishti-vision/scripts/capture.js.md) |
| `catch` | `tests/benchmark_blocking.js` | [Doc](../../tests/benchmark_blocking.js.md) |
| `catch` | `tests/core_agent_upgrade.test.js` | [Doc](../../tests/core_agent_upgrade.test.js.md) |
| `catch` | `tests/debug-payload.js` | [Doc](../../tests/debug-payload.js.md) |
| `catch` | `tests/list-models.js` | [Doc](../../tests/list-models.js.md) |
| `catch` | `tests/minimal-auth-test.js` | [Doc](../../tests/minimal-auth-test.js.md) |
| `if` | `tests/test-agent-error-handling.js` | [Doc](../../tests/test-agent-error-handling.js.md) |
| `catch` | `tests/test-agent.js` | [Doc](../../tests/test-agent.js.md) |
| `if` | `tests/test-agent.js` | [Doc](../../tests/test-agent.js.md) |
| `catch` | `tests/test-auth-store-save-failure.js` | [Doc](../../tests/test-auth-store-save-failure.js.md) |
| `if` | `tests/test-auth-store-save-failure.js` | [Doc](../../tests/test-auth-store-save-failure.js.md) |
| `catch` | `tests/test-auth-store.js` | [Doc](../../tests/test-auth-store.js.md) |
| `if` | `tests/test-auth-store.js` | [Doc](../../tests/test-auth-store.js.md) |
| `catch` | `tests/test-base-provider.js` | [Doc](../../tests/test-base-provider.js.md) |
| `if` | `tests/test-budget.js` | [Doc](../../tests/test-budget.js.md) |
| `catch` | `tests/test-camera.js` | [Doc](../../tests/test-camera.js.md) |
| `catch` | `tests/test-chat-input-security.js` | [Doc](../../tests/test-chat-input-security.js.md) |
| `catch` | `tests/test-context.js` | [Doc](../../tests/test-context.js.md) |
| `if` | `tests/test-context.js` | [Doc](../../tests/test-context.js.md) |
| `catch` | `tests/test-contractor.js` | [Doc](../../tests/test-contractor.js.md) |
| `if` | `tests/test-contractor.js` | [Doc](../../tests/test-contractor.js.md) |
| `catch` | `tests/test-core-agent-compaction.js` | [Doc](../../tests/test-core-agent-compaction.js.md) |
| `catch` | `tests/test-core-agent-security.js` | [Doc](../../tests/test-core-agent-security.js.md) |
| `catch` | `tests/test-core-server-routes.js` | [Doc](../../tests/test-core-server-routes.js.md) |
| `if` | `tests/test-core-server-routes.js` | [Doc](../../tests/test-core-server-routes.js.md) |
| `catch` | `tests/test-dashboard-api.js` | [Doc](../../tests/test-dashboard-api.js.md) |
| `catch` | `tests/test-doc-quality-gate.js` | [Doc](../../tests/test-doc-quality-gate.js.md) |
| `if` | `tests/test-events.js` | [Doc](../../tests/test-events.js.md) |
| `catch` | `tests/test-google-auth-binding.js` | [Doc](../../tests/test-google-auth-binding.js.md) |
| `catch` | `tests/test-google-provider-security.js` | [Doc](../../tests/test-google-provider-security.js.md) |
| `catch` | `tests/test-json-parser.js` | [Doc](../../tests/test-json-parser.js.md) |
| `if` | `tests/test-json-parser.js` | [Doc](../../tests/test-json-parser.js.md) |
| `catch` | `tests/test-llm-anthropic.js` | [Doc](../../tests/test-llm-anthropic.js.md) |
| `catch` | `tests/test-llm-concurrency.js` | [Doc](../../tests/test-llm-concurrency.js.md) |
| `catch` | `tests/test-llm-delegation.js` | [Doc](../../tests/test-llm-delegation.js.md) |
| `catch` | `tests/test-llm-openai-compatible.js` | [Doc](../../tests/test-llm-openai-compatible.js.md) |
| `catch` | `tests/test-llm-openai.js` | [Doc](../../tests/test-llm-openai.js.md) |
| `catch` | `tests/test-llm-rate-limit.js` | [Doc](../../tests/test-llm-rate-limit.js.md) |
| `catch` | `tests/test-llm.js` | [Doc](../../tests/test-llm.js.md) |
| `if` | `tests/test-log-reader.js` | [Doc](../../tests/test-log-reader.js.md) |
| `catch` | `tests/test-log-watcher.js` | [Doc](../../tests/test-log-watcher.js.md) |
| `catch` | `tests/test-logger.js` | [Doc](../../tests/test-logger.js.md) |
| `if` | `tests/test-logger.js` | [Doc](../../tests/test-logger.js.md) |
| `if` | `tests/test-models-config.js` | [Doc](../../tests/test-models-config.js.md) |
| `catch` | `tests/test-ollama.js` | [Doc](../../tests/test-ollama.js.md) |
| `if` | `tests/test-pariksha-security.js` | [Doc](../../tests/test-pariksha-security.js.md) |
| `catch` | `tests/test-profile-mgr-selection.js` | [Doc](../../tests/test-profile-mgr-selection.js.md) |
| `catch` | `tests/test-provider-factory.js` | [Doc](../../tests/test-provider-factory.js.md) |
| `catch` | `tests/test-ranabhoomi.js` | [Doc](../../tests/test-ranabhoomi.js.md) |
| `catch` | `tests/test-security-error-handling.js` | [Doc](../../tests/test-security-error-handling.js.md) |
| `catch` | `tests/test-server-error-handling.js` | [Doc](../../tests/test-server-error-handling.js.md) |
| `catch` | `tests/test-server.js` | [Doc](../../tests/test-server.js.md) |
| `if` | `tests/test-session-logger.js` | [Doc](../../tests/test-session-logger.js.md) |
| `catch` | `tests/test-skill-loader-load.js` | [Doc](../../tests/test-skill-loader-load.js.md) |
| `if` | `tests/test-steering.js` | [Doc](../../tests/test-steering.js.md) |
| `catch` | `tests/test-swarm-protocol.js` | [Doc](../../tests/test-swarm-protocol.js.md) |
| `catch` | `tests/test-tasks-api.js` | [Doc](../../tests/test-tasks-api.js.md) |
| `if` | `tests/test-tasks-api.js` | [Doc](../../tests/test-tasks-api.js.md) |
| `catch` | `tests/test-token-estimation.js` | [Doc](../../tests/test-token-estimation.js.md) |
| `catch` | `tests/verify-agent-broadcast-optimization.js` | [Doc](../../tests/verify-agent-broadcast-optimization.js.md) |
| `catch` | `tests/verify-auth-weak-default.js` | [Doc](../../tests/verify-auth-weak-default.js.md) |
| `catch` | `tests/verify-google-auth-logger.js` | [Doc](../../tests/verify-google-auth-logger.js.md) |
| `catch` | `tests/verify-google-auth-xss.js` | [Doc](../../tests/verify-google-auth-xss.js.md) |
| `catch` | `tests/verify-index-broadcast.js` | [Doc](../../tests/verify-index-broadcast.js.md) |
| `catch` | `tests/verify-llm-connection.js` | [Doc](../../tests/verify-llm-connection.js.md) |
| `if` | `tests/verify-log-watch.js` | [Doc](../../tests/verify-log-watch.js.md) |
| `catch` | `tests/verify-onboarding-metrics.js` | [Doc](../../tests/verify-onboarding-metrics.js.md) |
| `catch` | `tests/verify-path-traversal.js` | [Doc](../../tests/verify-path-traversal.js.md) |
| `if` | `tests/verify-proto-pollution.js` | [Doc](../../tests/verify-proto-pollution.js.md) |
