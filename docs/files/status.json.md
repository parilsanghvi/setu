---
source_hash: a0f869c9ba801530
facts_hash: 7729e54edd822b52
generated_at: 2026-03-03T07:30:58.995Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# File: status.json

## Purpose
This file, `status.json`, serves as a status report for documentation updates in the project, tracking completeness, errors, and generated data.

## Exports / API Surface
| Export | Description |
| --- | --- |
| ok | Returns whether the documentation update process was successful or not. |
| completeness | Indicates the percentage of completed documentation updates. |
| stale | Flags if the last commit is stale (not up-to-date). |
| missing | Lists files and folders with missing documentation updates. |
| errors | Stores error messages related to documentation updates. |
| data | Holds project metadata, including repository information and generated data. |

## Internal Logic
The file's main execution flow involves parsing JSON data from multiple sources, calculating completeness, detecting stale commits, and updating the `data` object with relevant information.

## Dependencies
| Why | Description |
| --- | --- |
|  |  |

## Side Effects
None detected.

## Dependents
- [doc-enricher.js](./lib/onboarding/doc-enricher.js.md)
- [doc-facts.js](./lib/onboarding/doc-facts.js.md)
- [drift.js](./lib/onboarding/drift.js.md)
- [generator.js](./lib/onboarding/generator.js.md)

## Cross-References
- [doc-enricher.js](./lib/onboarding/doc-enricher.js.md)
- [doc-facts.js](./lib/onboarding/doc-facts.js.md)
- [drift.js](./lib/onboarding/drift.js.md)
- [generator.js](./lib/onboarding/generator.js.md)
