## 2026-02-16 - [UX: Chat Interaction Feedback]
**Learning:** The ChatBox component lacked immediate feedback on message submission (loading state) and failed to auto-scroll, which are critical for chat UX. Also, form elements were missing accessibility labels.
**Action:** Ensure all async interactions have visible loading states and message lists auto-scroll. Always include aria-labels on icon-only buttons and inputs without visible labels.

## 2026-02-17 - [UX: Modal Keyboard Navigation]
**Learning:** Modals without keyboard support (Escape key) and proper ARIA roles create significant barriers for keyboard and screen reader users. The 'Escape' key is a universal expectation for closing dialogs.
**Action:** Always implement 'Escape' key listener and focus management (focus trap or initial focus) for any modal or dialog component. Ensure role="dialog" and aria-modal="true" are present.

## 2026-02-19 - [A11y: Modal Accessibility Patterns]
**Learning:** The Modal component was missing critical accessibility features: it didn't close on Escape, didn't manage focus, and lacked ARIA roles. This traps keyboard users and confuses screen readers.
**Action:** Always implement `useEffect` for Escape key handling, trap or manage focus on mount, and add `role="dialog"` + `aria-modal="true"` to all modal implementations.

## 2026-02-23 - [A11y: Status Indicators]
**Learning:** The Onboarding widget relied solely on color (red/green borders) to convey status, making it inaccessible to colorblind users and screen readers. Status messages should always combine color with text and icons, and use semantic roles like `role="status"`.
**Action:** Always include explicit text labels or aria-labels alongside color indicators, and use semantic HTML elements for status updates.
