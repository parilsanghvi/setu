## 2024-03-08 - Added Loading and Disabled states to Async Modal Buttons
**Learning:** During destructive async operations like deleting a task or reverting its status, users were able to double-click the button because there was no visual feedback or disabled state.
**Action:** When implementing async actions attached to buttons, always integrate a `<Spinner />` and disable the button using a `disabled={isLoading}` attribute while the Promise resolves or rejects. Update the corresponding `.scss` file to add `&:disabled` cursor/opacity states, and ensure `&:hover` is modified to `&:hover:not(:disabled)` so hover styles don't conflict.
## 2025-03-09 - Accessible Chat Messages
**Learning:** Screen readers do not automatically announce new dynamic content added to a live chat interface, rendering incoming messages completely inaccessible to visually impaired users unless they manually navigate to read them.
**Action:** Always add `aria-live="polite"` and `aria-atomic="false"` to chat message list containers so that screen readers announce new incoming messages dynamically as they arrive without interrupting the user.
