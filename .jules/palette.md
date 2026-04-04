## 2024-03-08 - Added Loading and Disabled states to Async Modal Buttons
**Learning:** During destructive async operations like deleting a task or reverting its status, users were able to double-click the button because there was no visual feedback or disabled state.
**Action:** When implementing async actions attached to buttons, always integrate a `<Spinner />` and disable the button using a `disabled={isLoading}` attribute while the Promise resolves or rejects. Update the corresponding `.scss` file to add `&:disabled` cursor/opacity states, and ensure `&:hover` is modified to `&:hover:not(:disabled)` so hover styles don't conflict.

## 2026-04-04 - Wrapping Decorative Emojis for Accessibility
**Learning:** Decorative emojis in UI components (like `👤` in TaskCard, or `🗑️` and `↩️` in TaskDetailModal) are announced by screen readers, creating a noisy and confusing experience for users relying on assistive technologies.
**Action:** Always wrap decorative emojis in `<span role="img" aria-hidden="true">` to prevent screen readers from announcing them unnecessarily, while maintaining visual polish for sighted users.
