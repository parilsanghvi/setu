---
source_hash: 447e00b8f571743a
facts_hash: fa3f9c69a245ab94
generated_at: 2026-03-03T07:17:36.236Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: lib/auth/basic.js

## Purpose
This file exports two functions, `checkConfig` and `validate`, which are used to check the configuration of the dashboard authentication system and validate user credentials, respectively.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `checkConfig` | cjs_named | Checks if the DASHBOARD_PASS environment variable is set. |
| `validate` | cjs_named | Validates a user's password against a hashed version of the valid password. |

## Internal Logic
The main execution flow of this file checks if the DASHBOARD_PASS environment variable is set and if so, validates the user's credentials using constant-time comparison to prevent timing attacks.

- The `checkConfig` function first checks if the DASHBOARD_PASS environment variable is set. If not, it logs an error message and returns false.
- The `validate` function takes a user's username and password as input and compares them against hashed versions of the valid credentials.
- If either comparison fails, the function returns false.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `crypto` | No | Provides cryptographic functions for hashing and comparing passwords. |

## Side Effects
- console_output: The file logs an error message to the console if the DASHBOARD_PASS environment variable is not set.
- env_access: The file accesses environment variables DASHBOARD_USER, DASHBOARD_PASS, and DASHBOARD_PASS to retrieve credentials.

## Dependents
No known dependents.

## Cross-References
No cross-references.
