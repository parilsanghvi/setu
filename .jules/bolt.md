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
## 2026-06-05 - Avoid Sync File System methods in Express Routes
**Learning:** Using synchronous file system methods like `fs.existsSync` and `fs.readdirSync` in Express API endpoints blocks the main Node.js event loop. This degrades the performance of the server and reduces its concurrent throughput capacity.
**Action:** Always replace synchronous `fs` calls with their asynchronous equivalents like `fs.promises.access` and `fs.promises.readdir` wrapped in `try/catch` blocks inside API route handlers to ensure non-blocking I/O operations.

## 2026-06-02 - Backend Polling Optimization
**Learning:** The database polling loop in socket.js and dashboard.js recompiled SQL statements continuously using db.prepare. Reusing cached prepared statements (db.getAgents, db.getTasks) significantly reduces event loop overhead during polling.
**Action:** When writing polling mechanisms that fetch from SQLite, always use cached prepared statements instead of calling db.prepare on every tick.
## 2026-06-07 - Avoid Recompiling Regex Objects in loops
**Learning:** Re-evaluating `new RegExp()` with the same constant values within a hot loop degrades application performance.
**Action:** Always precompile regular expressions before entering inner loops. When the regular expressions contain state, like with the `g` flag, make sure to manually clear the state (e.g. `re.lastIndex = 0`) before using `.exec()`.
