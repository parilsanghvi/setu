---
source_hash: b0fc970f7b65a430
facts_hash: b0fc970f7b65a430
generated_at: 2026-03-04T06:16:58.163Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: lib/auth

## Purpose
This `lib/auth` folder contains essential modules for managing user authentication and profile data, ensuring a secure and centralized way to handle credentials and API keys across the application.

## Key Files
| File | Role |
|------|------|
| auth-store.js | Manages user profiles and credentials utilizing file system operations. |
| basic.js | Verifies user credentials through password hashing verification. |
| google.js | Handles Google authentication, including OAuth flow and token management. |
| profile-mgr.js | Resolves API keys, retrieves profiles, and lists available profiles. |

## Ownership
Not yet assigned.

## Invariants / Rules
| Rule | Description |
|------|-------------|
| Likely: Unique Store Path | The `auth-store.js` module ensures a unique store path for each instance. |
| Likely: Password Hashing Verification | The `basic.js` file uses password hashing verification to protect user credentials.

## Cross-References
- [auth-store.js](../../../files/lib/auth/auth-store.js.md)
- [basic.js](../../../files/lib/auth/basic.js.md)
- [google.js](../../../files/lib/auth/google.js.md)
- [profile-mgr.js](../../../files/lib/auth/profile-mgr.js.md)

