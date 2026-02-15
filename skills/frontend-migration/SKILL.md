---
name: frontend-migration
description: The Standard Operating Procedure (SOP) for frontend UI components (e.g., React Class -> Hooks).
version: 1.0.0
author: Frontend-Lead
tags: frontend
---

# 🎨 Frontend Migration Protocol

Use this skill when tasked with "Modernizing" UI components or upgrading React.

## 🛑 The Golden Rule (Pixel Perfection)
The goal is to modernize the **code**, not the **UI** (unless explicitly redesigned).

## 🔄 Phase 1: The Safety Net (Visual)

1.  **Isolate the Component:** Identify the React component (e.g., `src/components/Navbar.jsx`).
2.  **Snapshot:**
    *   Create a Playwright test (`tests/e2e/navbar.spec.ts`).
    *   Render the Legacy component in isolation (Storybook or dedicated page).
    *   **Capture Screenshot:** `await expect(page).toHaveScreenshot('navbar-legacy.png')`.
3.  **Document:** Mark component as "Under Migration" in `frontend/CONTEXT.md`.

## 🏗️ Phase 2: The Transplant (V2 Implementation)

1.  **Create V2:** Implement the new component in a *separate* file (e.g., `src/components/Navbar.v2.tsx`).
2.  **Use Modern Standards:**
    *   **Hooks:** Convert Class `this.state` to `useState` / `useEffect`.
    *   **Tailwind:** Replace raw CSS/SCSS with utility classes (if applicable).
    *   **Accessibility:** Use `aria-label`, `<nav>`, `<button>` (no `div` soup).
3.  **Verify:** Run the Phase 1 test against the **New** V2 component.
    *   **Rule:** The screenshots must match exactly (tolerance: 0.1%).

## 🔀 Phase 3: The Switch (Deployment)

1.  **Feature Flag:** Wrap usage in a flag:
    ```javascript
    {FLAGS.useModernNavbar ? <NavbarV2 /> : <Navbar />}
    ```
2.  **Enable:** Set flag to `true` locally.
3.  **Manual QA:** Check responsiveness (Mobile/Desktop).

## ✅ Phase 4: Cleanup

1.  **Delete Legacy Code:** Remove the old `Navbar.jsx` and CSS files.
2.  **Update Docs:** Mark `Navbar` as "Modernized" in `CONTEXT.md`.
