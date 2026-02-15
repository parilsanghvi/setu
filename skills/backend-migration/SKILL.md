---
name: backend-migration
description: The Standard Operating Procedure (SOP) for migrating backend APIs (legacy -> modern).
version: 1.0.0
author: Backend-Lead
---

# 🚀 Backend Migration Protocol

Use this skill when tasked with "Migrating" or "Modernizing" a backend service.

## 🛑 The Golden Rule (Strangler Fig)
**NEVER** rewrite the entire application at once. Migration happens endpoint by endpoint.

## 🔄 Phase 1: The Safety Net (Before Code)

1.  **Isolate the Target:** identify a single endpoint (e.g., `GET /api/users`) to migrate.
2.  **Write the Test:** Create an E2E test using `supertest` against the **Legacy** endpoint.
    *   Capture specific headers, status codes, and JSON structure.
    *   **Rule:** This test MUST pass on the Legacy code first.
3.  **Document:** Update `backend/CONTEXT.md` with "Migration Started: /api/users".

## 🏗️ Phase 2: The Transplant (V2 Implementation)

1.  **Create V2:** Implement the new logic in a *separate* file/module (e.g., `src/v2/users.ts`).
2.  **Use Modern Standards:**
    *   **Types:** Strict TypeScript interfaces.
    *   **Async:** `async/await` (no callbacks).
    *   **Logging:** Structured JSON logs (no `console.log`).
3.  **Verify:** Run the Phase 1 test against the **New** V2 implementation.
    *   **Rule:** If the test fails, fix the code. Do not change the test.

## 🔀 Phase 3: The Switch (Traffic)

1.  **Dual Run (Optional):** In the main router, route 1% of traffic to V2 (if supported).
2.  **Cutover:** Update the route handler to point to V2.
    ```javascript
    // app.get('/api/users', legacyController.getUsers);
    app.get('/api/users', v2Controller.getUsers);
    ```
3.  **Monitor:** Check logs for errors. If > 1%, **Rollback immediately**.

## ✅ Phase 4: Cleanup

1.  **Delete Legacy Code:** Once V2 is stable (after 24h), remove the old controller.
2.  **Update Docs:** Mark `/api/users` as "Modernized" in `CONTEXT.md`.
