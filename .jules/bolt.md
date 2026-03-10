## 2024-05-24 - Avoid Sync Filesystem Scans in Hot Paths
**Learning:** The `getOnboardingStatus()` function in `lib/onboarding/status.js` does heavy synchronous filesystem scans when called without arguments. Calling this function in API endpoints like `/api/onboarding` blocks the main Node.js event loop and significantly degrades performance.
**Action:** Always call `getOnboardingStatus({ fast: true })` in hot paths, such as Express API routes, to use the cached `ONBOARDING.json` file instead of triggering a full synchronous filesystem scan. The fast path correctly returns stale cache data natively if necessary.

## 2024-05-25 - Avoid O(N^2) Array Reallocation in React State Updates
**Learning:** In rapid state-updating React components (like real-time chat boxes tracking typing indicators), nesting array reallocation methods like `.filter()` inside loops or `.reduce()` causes severe UI jank due to O(N^2) complexity on every re-render.
**Action:** Track active transient states (e.g., typing indicators) with a `Set` and append them to the final array in a single O(N) pass, instead of repeatedly filtering arrays during the loop.
