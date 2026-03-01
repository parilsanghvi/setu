---
source_hash: fffe1f4ffad341d3
facts_hash: 93a343d652f2c670
generated_at: 2026-03-01T11:21:09.892Z
generator_version: 1.0.0
model: fallback_no_llm
quality_score: 94
---
# File: lib/auth/google.js

## Purpose
Source file with 8 symbols and 341 lines. (LLM enrichment unavailable — fact-only mode.)

## Exports / API Surface
| Export | Type |
|--------|------|
| `new` | cjs_default |

## Internal Logic
Detected symbols:
- `for(const endpoint of endpoints)` (method)
- `getValidToken(profileId)` (method)
- `GoogleAuth` (class)
- `if(process.platform === 'darwin')` (method)
- `login()` (method)
- `openUrl(url)` (function)
- `refreshToken(refreshToken)` (method)
- `server(http.createServer(async (req, res)` (arrow)

## Dependencies
| Module | Local |
|--------|-------|
| `../Config` | Yes |
| `../Logger` | Yes |
| `../utils/pkce` | Yes |
| `./auth-store` | Yes |
| `child_process` | No |
| `crypto` | No |
| `http` | No |

## Side Effects
- network
- subprocess

## Dependents
No known dependents.

## Cross-References
- [Config.js](../Config.js.md)
- [Logger.js](../Logger.js.md)
- [pkce.js](../utils/pkce.js.md)
- [auth-store.js](./auth-store.js.md)
