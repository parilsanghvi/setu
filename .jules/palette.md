## 2024-03-08 - Added Loading and Disabled states to Async Modal Buttons
**Learning:** During destructive async operations like deleting a task or reverting its status, users were able to double-click the button because there was no visual feedback or disabled state.
**Action:** When implementing async actions attached to buttons, always integrate a `<Spinner />` and disable the button using a `disabled={isLoading}` attribute while the Promise resolves or rejects. Update the corresponding `.scss` file to add `&:disabled` cursor/opacity states, and ensure `&:hover` is modified to `&:hover:not(:disabled)` so hover styles don't conflict.
## 2026-04-20 - Redundant Screen Reader Announcements in Modals
**Learning:** Visual-only close characters (like `✕` or `&times;`) inside buttons with `aria-label`s are still announced by screen readers, creating confusing and redundant audio cues (e.g., "Close modal, multiplication sign").
**Action:** When using raw text characters or emojis as visual icons inside semantic, labeled buttons, always wrap them in `<span aria-hidden="true">` to preserve visual structure while enforcing a clean accessibility tree.
