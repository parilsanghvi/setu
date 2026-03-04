---
source_hash: 91b213589b04cae1
facts_hash: 0ee86bb11b3455c4
generated_at: 2026-03-04T06:41:22.084Z
generator_version: 1.0.0
model: cheap
quality_score: 80
---
# File: ONBOARDING.json

## Purpose
This file, named `ONBOARDING.json`, contains configuration data for an onboarding process in a software development system, specifically the repository and default branch settings, as well as various checks to ensure the integrity of the project.

## Exports / API Surface
| Export | Description |
| --- | --- |
| repo | Exposes the name of the repository being onboarded. |
| default_branch | Reveals the default branch used for the onboarding process. |
| head_commit | Provides the hash of the last committed code change in the repository. |
| generated_at | Supplies the timestamp when the onboarding data was generated. |
| completeness_percent | Displays the percentage completion of various checks and tests. |
| owners_modules | Lists modules owned by the onboarding team or maintainers. |
| checks | Enumerates the status of core artifacts, file documentation coverage, folder summary coverage, and stale commit checks. |

## Internal Logic
The `ONBOARDING.json` file is parsed into an internal data structure upon loading. The configuration data is then used to initialize various onboarding processes, including artifact checks and team ownership verification.

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
No cross-references.


## Symbol Dependencies

*No internal function calls detected.*

*No downstream callers detected.*
