---
source_hash: a028b9d29fcba3a7
facts_hash: bbb2f7cc8c9a38bd
generated_at: 2026-03-09T08:52:16.486Z
generator_version: 1.0.0
model: cheap
quality_score: 95
---
# File: lib/onboarding/dependency-engine.js

## Purpose
This file manages tracking file dependency graphs for generating metrics for documentation enrichment targets.

| Export | Type | Description |
|--------|------|-------------|
| `DependencyEngine` | class | Tracks dependencies and edges |

## Internal Logic
Provides `buildGraph()` and `calculateImportance()` to map connections.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| fs | No | File system access |

## Side Effects
None.
