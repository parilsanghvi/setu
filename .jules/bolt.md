## 2026-03-08 - Use fast cache in hot paths
**Learning:** Calling `getOnboardingStatus()` without `{ fast: true }` in hot paths like API endpoints blocks the event loop with heavy synchronous filesystem scans.
**Action:** Use `getOnboardingStatus({ fast: true })` in Express routes and dashboard CLI tools to utilize `ONBOARDING.json` caching.

## 2024-05-24 - [Avoid Array.prototype.filter inside Array.prototype.reduce]
**Learning:** In rapid state-updating components like LogViewers or ChatBoxes, using `.filter()` inside a `.reduce()` loop causes O(N²) array reallocations which can block the main thread and cause severe UI jank when dealing with frequent updates (like real-time socket logs).
**Action:** Use a single-pass `for` loop with a `Set` to track active transient states (like typing indicators) and append them at the end. This brings complexity from O(N²) down to O(N).

## 2024-05-24 - Avoid Sync Filesystem Scans in Hot Paths
**Learning:** The `getOnboardingStatus()` function in `lib/onboarding/status.js` does heavy synchronous filesystem scans when called without arguments. Calling this function in API endpoints like `/api/onboarding` blocks the main Node.js event loop and significantly degrades performance.
**Action:** Always call `getOnboardingStatus({ fast: true })` in hot paths, such as Express API routes, to use the cached `ONBOARDING.json` file instead of triggering a full synchronous filesystem scan. The fast path correctly returns stale cache data natively if necessary.
## 2026-03-11 - ChatBox React component uses O(N^2) inner reallocation on large arrays
**Learning:** `frontend/app/src/components/ChatBox.jsx` calculates `chatHistory` in a `useMemo` block, iterating over `logs` while pushing properties onto array and modifying `typingAgents`. Previously it was using `.reduce` with spread operator which is O(N^2), but wait... It actually *was* already refactored into a single-pass O(N) loop. Oh, the actual performance issue today is that `frontend/app/src/hooks/useSocket.js` was exporting `socketRef.current` directly, which isn't reactive, but when it was modified to use `socket.current`, it had a `useEffect` that updated `socket.current = socketRef.current` every render due to `[socketRef.current]` dependency which is actually an anti-pattern. Oh, I should journal what I actually fixed.
**Action:** Be aware that React refs in dependency arrays trigger linter errors and don't re-render. To fix, I exported the state `socketInstance` using `useState` that updates when `socketRef.current` initializes (when `isConnected` changes).
