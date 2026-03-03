---
source_hash: 5b04e75ff152b740
facts_hash: df2a48a4397f1d27
generated_at: 2026-03-03T07:27:08.375Z
generator_version: 1.0.0
model: cheap
quality_score: 80
---
# File: lib/utils/pkce.js

## Purpose
This file exports the `generatePkce` function, which generates a Proof Key for Code Exchange (PKCE) challenge and verifier pair used in OAuth 2.0 authorization flows. The generated PKCE values can be used to securely redirect users to an authorization server. The file provides a simple way to generate these values.

| Export | Type | Description |
|--------|------|-------------|
| `generatePkce` | cjs_named | Generates a Proof Key for Code Exchange (PKCE) challenge and verifier pair |

## Exports / API Surface

| Export | Type | Description |
|--------|------|-------------|
| `generatePkce` | function | Generates a Proof Key for Code Exchange (PKCE) challenge and verifier pair |

## Internal Logic
The main execution flow involves generating a random 32-byte verifier using the `crypto.randomBytes()` function. This verifier is then hashed with SHA-256 and encoded in base64 URL format, producing the challenge. The generated verifier and challenge are returned as an object.

| Key Function | Description |
|---------------|-------------|
| `crypto.randomBytes()` | Generates a random 32-byte byte array for the verifier |
| `crypto.createHash("sha256")` | Hashes the verifier with SHA-256 to produce the challenge |
| `update()` and `digest("base64url")` | Updates the hash object and encodes it in base64 URL format |

## Dependencies

| Module | Local | Why |
|--------|-------|-----|
| `crypto` | No | Provides cryptographic functions for generating random bytes and hashing values |

## Dependents
No known dependents.

## Cross-References
No cross-references.
