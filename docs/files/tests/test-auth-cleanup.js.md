---
type: test
status: stable
owner: Sentinel
---

# Test: Auth Cleanup

## Purpose
This test verifies the rate limit cleanup mechanism in `lib/middleware/auth.js`.
To ensure that the `FAILED_ATTEMPTS` map does not grow indefinitely (memory leak prevention) and that expired blocks are correctly removed.

## Logic
1. Populates the rate limit map with mock entries.
2. Asserts the initial map size.
3. Advances time (via `_runCleanup` helper).
4. Asserts that expired entries are removed.

## Dependencies
- `node:test`
- `node:assert`
- `../lib/middleware/auth.js`

## Side Effects
- Uses `node:test` runner.
- Invokes middleware which modifies the internal rate limiting map.
- Mocks HTTP requests and responses for `authMiddleware`.
