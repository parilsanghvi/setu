---
source_hash: b0fc970f7b65a430
facts_hash: b0fc970f7b65a430
generated_at: 2026-03-03T07:58:35.432Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: lib/auth

## Purpose
This `lib/auth` folder contains a set of classes and functions for managing user authentication, profile management, and OAuth flows with Google APIs. It provides essential tools for handling user authentication and session management, while also encapsulating the complexity of authenticating users across multiple APIs. The key responsibilities include handling user authentication and session management.

## Key Files
| File | Role |
|------|------|
| auth-store.js | Manages authentication data in a JSON file at user's home directory |
| basic.js | Validates user credentials using dashboard authentication configuration |
| google.js | Handles OAuth flows and fetches user information from Google APIs |
| profile-mgr.js | Resolves API keys based on environment variables and Auth Store profiles |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: The `AuthStore` class loads and saves authentication profiles in a JSON file at the user's home directory.
Likely: The `ProfileManager` class resolves API keys based on environment variables and Auth Store profiles to handle complex authentications.

## Cross-References
- [auth-store.js](../../../files/lib/auth/auth-store.js.md)
- [basic.js](../../../files/lib/auth/basic.js.md)
- [google.js](../../../files/lib/auth/google.js.md)
- [profile-mgr.js](../../../files/lib/auth/profile-mgr.js.md)

