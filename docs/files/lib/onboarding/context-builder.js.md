---
source_hash: e17bdc0af30b59eb
facts_hash: bbd6d81232822da8
generated_at: 2026-03-09T08:52:16.486Z
generator_version: 1.0.0
model: cheap
quality_score: 95
---
# File: lib/onboarding/context-builder.js

## Purpose
This file provides a class responsible for constructing dynamic code context to enrich agent prompt generation.

| Export | Type | Description |
|--------|------|-------------|
| `ContextBuilder` | class | Class handling code context aggregation |

## Internal Logic
Provides `build()` to concatenate raw project knowledge bases and agent-specific files.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| fs | No | Reading files |
| path | No | Path resolution |

## Side Effects
None.
