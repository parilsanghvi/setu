## 2026-03-08 - Use fast cache in hot paths
**Learning:** Calling `getOnboardingStatus()` without `{ fast: true }` in hot paths like API endpoints blocks the event loop with heavy synchronous filesystem scans.
**Action:** Use `getOnboardingStatus({ fast: true })` in Express routes and dashboard CLI tools to utilize `ONBOARDING.json` caching.

## 2024-05-24 - [Avoid Array.prototype.filter inside Array.prototype.reduce]
**Learning:** In rapid state-updating components like LogViewers or ChatBoxes, using `.filter()` inside a `.reduce()` loop causes O(N²) array reallocations which can block the main thread and cause severe UI jank when dealing with frequent updates (like real-time socket logs).
**Action:** Use a single-pass `for` loop with a `Set` to track active transient states (like typing indicators) and append them at the end. This brings complexity from O(N²) down to O(N).

## 2024-05-24 - Avoid Sync Filesystem Scans in Hot Paths
**Learning:** The `getOnboardingStatus()` function in `lib/onboarding/status.js` does heavy synchronous filesystem scans when called without arguments. Calling this function in API endpoints like `/api/onboarding` blocks the main Node.js event loop and significantly degrades performance.
**Action:** Always call `getOnboardingStatus({ fast: true })` in hot paths, such as Express API routes, to use the cached `ONBOARDING.json` file instead of triggering a full synchronous filesystem scan. The fast path correctly returns stale cache data natively if necessary.

## 2026-04-20 - Parallelize I/O bounds in API Handlers
**Learning:** In the `/api/sessions` express handler, synchronous filesystem operations like `readdirSync` and nested `statSync` calls iterate sequentially over large directories, heavily blocking the Event Loop and impacting application scalability.
**Action:** Use `fs.promises` equivalent methods to move file I/O out of the main thread, and run mapping calls concurrently using `Promise.all` over asynchronous functions, greatly reducing the time to yield.

## 2025-02-12 - Buffer Views and Data Corruption in File Chunking
**Learning:** When optimizing file reading by using a single reusable `Buffer` with `fs.promises.read()` in a loop, pushing the result of `buffer.subarray()` into an array is unsafe. `subarray()` returns a memory *view*, not a copy. As the loop iterates, subsequent reads overwrite the shared memory, corrupting all previously stored chunks.
**Action:** When accumulating buffer chunks from a reusable memory pool, always explicitly copy the data (e.g., using `Buffer.from(validBuffer)`) before storing it, ensuring data integrity while maintaining high performance.

## 2026-05-13 - Avoid File System TOCTOU in API Routes
**Learning:** Using synchronous `fs.existsSync()` followed by `fs.readdirSync()` in API routes causes race conditions (TOCTOU) and blocks the Node.js event loop, severely degrading performance under load.
**Action:** Use asynchronous equivalents (`fs.promises.readdir`) directly within a `try...catch` block. By handling the `ENOENT` error natively, we eliminate the need for an explicit check, preventing both blocking I/O and race conditions while maximizing throughput.
