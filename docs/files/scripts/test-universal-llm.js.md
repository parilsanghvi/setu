---
source_hash: c8fb6389cca5c7da
facts_hash: 6b805c02fccf998e
generated_at: 2026-03-03T07:30:26.300Z
generator_version: 1.0.0
model: cheap
quality_score: 89
---
# File: scripts/test-universal-llm.js

## Purpose
This file contains a test function that exercises the LLM's generate method using both an expensive and a cheap model. The test logs output to the console, displaying the configuration of the models being used.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `test` | function | `` | Runs tests for the LLM |

## Internal Logic
The test function executes in the following flow: it logs the configuration of the expensive and cheap models, then attempts to generate responses using each model. The response from each generation attempt is logged to the console with a success or failure indicator.

Key functions:

- `LLM.generate`: generates a response based on the input prompts and model type
- `test`: runs the test function

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/Config` | Yes | Provides configuration settings for models |
| `../lib/LLM` | Yes | Defines the LLM's generate method |

## Side Effects
- console_output: The test function logs output to the console, displaying the model configurations and generation results.

## Dependents
No known dependents.

## Cross-References
- [Config.js](../lib/Config.js.md)
- [LLM.js](../lib/LLM.js.md)
