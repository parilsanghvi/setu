## 2026-02-16 - [UX: Chat Interaction Feedback]
**Learning:** The ChatBox component lacked immediate feedback on message submission (loading state) and failed to auto-scroll, which are critical for chat UX. Also, form elements were missing accessibility labels.
**Action:** Ensure all async interactions have visible loading states and message lists auto-scroll. Always include aria-labels on icon-only buttons and inputs without visible labels.

## 2026-02-17 - [UX: Modal Keyboard Navigation]
**Learning:** Modals without keyboard support (Escape key) and proper ARIA roles create significant barriers for keyboard and screen reader users. The 'Escape' key is a universal expectation for closing dialogs.
**Action:** Always implement 'Escape' key listener and focus management (focus trap or initial focus) for any modal or dialog component. Ensure role="dialog" and aria-modal="true" are present.
