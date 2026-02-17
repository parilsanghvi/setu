## 2026-02-16 - [UX: Chat Interaction Feedback]
**Learning:** The ChatBox component lacked immediate feedback on message submission (loading state) and failed to auto-scroll, which are critical for chat UX. Also, form elements were missing accessibility labels.
**Action:** Ensure all async interactions have visible loading states and message lists auto-scroll. Always include aria-labels on icon-only buttons and inputs without visible labels.
