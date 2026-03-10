---
source_hash: 6ac1f950b9225246
facts_hash: 4e6b83da97413088
generated_at: 2026-03-04T07:12:18.816Z
generator_version: 1.0.0
model: cheap
quality_score: 98
---
# File: agents/Guru.js

## Purpose
This file defines a class named `Guru` that extends the `CoreAgent` class, which is responsible for handling tasks and learning new skills. The `Guru` class uses various methods to analyze patterns from code and tasks, learn new languages or frameworks from documentation, track dependencies and create migration skills, and attempt self-repair. These actions are essential for improving the agent's knowledge and decision-making capabilities.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `Guru` | cjs_default | Handles incoming requests and returns a response |
| `analyzeCrash` | method | Analyzes an agent crash to generate a warning skill |
| `attemptSelfRepair` | method | Attempts self-repair by fixing a bug in the code |
| `extractPattern` | method | Extracts patterns from a task or code snippet |
| `learnLanguage` | method | Learns a new language or framework from documentation |
| `parseResponse` | method | Parses the response from an LLM model |
| `processMessage` | method | Handles incoming requests and processes messages |
| `saveSkill` | method | Saves a skill to the file system |
| `trackDrift` | method | Tracks dependencies and creates migration skills |

## Internal Logic
The main execution flow of this file is as follows:
1. The constructor initializes the `Guru` object with its name, role, and skills.
2. The `processMessage` method handles incoming requests and determines which action to take based on the message type.
3. If the message is a "TASK_DONE" event, the `extractPattern` method is called to extract patterns from the task.
4. If the message is an "AGENT_CRASH" event, the `analyzeCrash` method is called to analyze the crash and generate a warning skill.
5. If the message is an "ingest_docs" event, the `learnLanguage` method is called to learn a new language or framework from documentation.
6. If the message is a "track_drift" event, the `trackDrift` method is called to track dependencies and create migration skills.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/CoreAgent` | Yes | Provides the base class for agents |
| `../lib/db` | Yes | Allows communication with the database |
| `../lib/LLM` | Yes | Enables interaction with a language model |
| `../lib/SkillLoader` | Yes | Loads and manages skills |
| `../lib/utils/JsonParser` | Yes | Parses JSON responses from models |

## Side Effects
- console_output: This script logs various messages to the console, including success messages, error messages, and debug information.
- filesystem_read: This script reads files from the file system, specifically to load skills and save changes to the file system.
- filesystem_write: This script writes files to the file system, including saving new skills and backing up modified files.
- network: Although not explicitly used in this script, it is likely that communication with the LLM model occurs over a network connection.

## Dependents
No known dependents.

## Cross-References
- [CoreAgent.js](../lib/CoreAgent.js.md)
- [db.js](../lib/db.js.md)
- [LLM.js](../lib/LLM.js.md)
- [SkillLoader.js](../lib/SkillLoader.js.md)
- [JsonParser.js](../lib/utils/JsonParser.js.md)


## Symbol Dependencies

### Upstream (Internal Calls)

| Symbol | Source File | Doc |
| --- | --- | --- |
| `boot` | `agents/Vaidya.js` | [Doc](./Vaidya.js.md) |
| `boot` | `lib/Agent.js` | [Doc](../lib/Agent.js.md) |
| `speak` | `lib/Agent.js` | [Doc](../lib/Agent.js.md) |
| `load` | `lib/auth/auth-store.js` | [Doc](../lib/auth/auth-store.js.md) |
| `load` | `lib/Config.js` | [Doc](../lib/Config.js.md) |
| `log` | `lib/Context.js` | [Doc](../lib/Context.js.md) |
| `load` | `lib/Contractor.js` | [Doc](../lib/Contractor.js.md) |
| `setTools` | `lib/CoreAgent.js` | [Doc](../lib/CoreAgent.js.md) |
| `heartbeat` | `lib/db.js` | [Doc](../lib/db.js.md) |
| `generate` | `lib/LLM.js` | [Doc](../lib/LLM.js.md) |
| `generate` | `lib/llm/Anthropic.js` | [Doc](../lib/llm/Anthropic.js.md) |
| `generate` | `lib/llm/BaseProvider.js` | [Doc](../lib/llm/BaseProvider.js.md) |
| `generate` | `lib/llm/Ollama.js` | [Doc](../lib/llm/Ollama.js.md) |
| `generate` | `lib/llm/OpenAI.js` | [Doc](../lib/llm/OpenAI.js.md) |
| `generate` | `lib/llm/OpenAICompatible.js` | [Doc](../lib/llm/OpenAICompatible.js.md) |
| `error` | `lib/Logger.js` | [Doc](../lib/Logger.js.md) |
| `warn` | `lib/Logger.js` | [Doc](../lib/Logger.js.md) |
| `load` | `lib/models/config.js` | [Doc](../lib/models/config.js.md) |
| `generate` | `lib/models/providers/anthropic.js` | [Doc](../lib/models/providers/anthropic.js.md) |
| `generate` | `lib/models/providers/base.js` | [Doc](../lib/models/providers/base.js.md) |
| `generate` | `lib/models/providers/google.js` | [Doc](../lib/models/providers/google.js.md) |
| `generate` | `lib/models/providers/ollama.js` | [Doc](../lib/models/providers/ollama.js.md) |
| `generate` | `lib/models/providers/openai.js` | [Doc](../lib/models/providers/openai.js.md) |
| `log` | `lib/SessionLogger.js` | [Doc](../lib/SessionLogger.js.md) |
| `load` | `lib/SkillLoader.js` | [Doc](../lib/SkillLoader.js.md) |
| `error` | `tests/test-security-error-handling.js` | [Doc](../tests/test-security-error-handling.js.md) |
| `error` | `tests/test-server-error-handling.js` | [Doc](../tests/test-server-error-handling.js.md) |
| `log` | `tests/test-token-estimation.js` | [Doc](../tests/test-token-estimation.js.md) |

### Downstream (Impacted By)

| Symbol | Caller File | Doc |
| --- | --- | --- |
| `if` | `agents/Rakshak.js` | [Doc](./Rakshak.js.md) |
| `if` | `benchmarks/log_benchmark.js` | [Doc](../benchmarks/log_benchmark.js.md) |
| `if` | `frontend/app/src/App.jsx` | [Doc](../frontend/app/src/App.jsx.md) |
| `if` | `frontend/app/src/components/OnboardingStatus.jsx` | [Doc](../frontend/app/src/components/OnboardingStatus.jsx.md) |
| `if` | `frontend/app/src/components/ScreenshotGallery.jsx` | [Doc](../frontend/app/src/components/ScreenshotGallery.jsx.md) |
| `if` | `frontend/app/src/components/TaskDetailModal.jsx` | [Doc](../frontend/app/src/components/TaskDetailModal.jsx.md) |
| `Guru` | `index.js` | [Doc](../index.js.md) |
| `if` | `lib/Context.js` | [Doc](../lib/Context.js.md) |
| `if` | `lib/Contractor.js` | [Doc](../lib/Contractor.js.md) |
| `if` | `lib/llm/BaseProvider.js` | [Doc](../lib/llm/BaseProvider.js.md) |
| `if` | `lib/onboarding/codeowners.js` | [Doc](../lib/onboarding/codeowners.js.md) |
| `if` | `lib/onboarding/dependency-engine.js` | |
| `while` | `lib/onboarding/doc-facts.js` | [Doc](../lib/onboarding/doc-facts.js.md) |
| `while` | `lib/onboarding/doc-links.js` | [Doc](../lib/onboarding/doc-links.js.md) |
| `if` | `lib/onboarding/paths.js` | [Doc](../lib/onboarding/paths.js.md) |
| `if` | `lib/server.js` | [Doc](../lib/server.js.md) |
| `if` | `scripts/ignite.js` | [Doc](../scripts/ignite.js.md) |
| `processMessage` | `tests/core_agent_upgrade.test.js` | [Doc](../tests/core_agent_upgrade.test.js.md) |
| `processMessage` | `tests/steering-agent.js` | [Doc](../tests/steering-agent.js.md) |
| `if` | `tests/test-agent-error-handling.js` | [Doc](../tests/test-agent-error-handling.js.md) |
| `if` | `tests/test-agent.js` | [Doc](../tests/test-agent.js.md) |
| `if` | `tests/test-auth-store-save-failure.js` | [Doc](../tests/test-auth-store-save-failure.js.md) |
| `if` | `tests/test-auth-store.js` | [Doc](../tests/test-auth-store.js.md) |
| `if` | `tests/test-budget.js` | [Doc](../tests/test-budget.js.md) |
| `if` | `tests/test-context.js` | [Doc](../tests/test-context.js.md) |
| `if` | `tests/test-contractor.js` | [Doc](../tests/test-contractor.js.md) |
| `processMessage` | `tests/test-core-agent.js` | [Doc](../tests/test-core-agent.js.md) |
| `if` | `tests/test-core-server-routes.js` | [Doc](../tests/test-core-server-routes.js.md) |
| `Guru` | `tests/test-drona-learning.js` | [Doc](../tests/test-drona-learning.js.md) |
| `processMessage` | `tests/test-drona-learning.js` | [Doc](../tests/test-drona-learning.js.md) |
| `Guru` | `tests/test-drona-parsing.js` | [Doc](../tests/test-drona-parsing.js.md) |
| `parseResponse` | `tests/test-drona-parsing.js` | [Doc](../tests/test-drona-parsing.js.md) |
| `if` | `tests/test-events.js` | [Doc](../tests/test-events.js.md) |
| `if` | `tests/test-json-parser.js` | [Doc](../tests/test-json-parser.js.md) |
| `if` | `tests/test-log-reader.js` | [Doc](../tests/test-log-reader.js.md) |
| `if` | `tests/test-logger.js` | [Doc](../tests/test-logger.js.md) |
| `if` | `tests/test-models-config.js` | [Doc](../tests/test-models-config.js.md) |
| `if` | `tests/test-pariksha-security.js` | [Doc](../tests/test-pariksha-security.js.md) |
| `if` | `tests/test-session-logger.js` | [Doc](../tests/test-session-logger.js.md) |
| `while` | `tests/test-skill-loader-load.js` | [Doc](../tests/test-skill-loader-load.js.md) |
| `if` | `tests/test-steering.js` | [Doc](../tests/test-steering.js.md) |
| `if` | `tests/test-tasks-api.js` | [Doc](../tests/test-tasks-api.js.md) |
| `while` | `tests/verify-agent-broadcast-optimization.js` | [Doc](../tests/verify-agent-broadcast-optimization.js.md) |
| `processMessage` | `tests/verify-core-agent-loop.js` | [Doc](../tests/verify-core-agent-loop.js.md) |
| `Guru` | `tests/verify-core.js` | [Doc](../tests/verify-core.js.md) |
| `if` | `tests/verify-log-watch.js` | [Doc](../tests/verify-log-watch.js.md) |
| `if` | `tests/verify-proto-pollution.js` | [Doc](../tests/verify-proto-pollution.js.md) |
