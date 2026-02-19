## 2026-02-16 - [UX: Chat Interaction Feedback]
**Learning:** The ChatBox component lacked immediate feedback on message submission (loading state) and failed to auto-scroll, which are critical for chat UX. Also, form elements were missing accessibility labels.
**Action:** Ensure all async interactions have visible loading states and message lists auto-scroll. Always include aria-labels on icon-only buttons and inputs without visible labels.

## 2026-02-19 - [A11y: Modal Accessibility Patterns]
**Learning:** The Modal component was missing critical accessibility features: it didn't close on Escape, didn't manage focus, and lacked ARIA roles. This traps keyboard users and confuses screen readers.
**Action:** Always implement `useEffect` for Escape key handling, trap or manage focus on mount, and add `role="dialog"` + `aria-modal="true"` to all modal implementations.
