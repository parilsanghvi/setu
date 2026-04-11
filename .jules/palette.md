## 2024-03-08 - Added Loading and Disabled states to Async Modal Buttons
**Learning:** During destructive async operations like deleting a task or reverting its status, users were able to double-click the button because there was no visual feedback or disabled state.
**Action:** When implementing async actions attached to buttons, always integrate a `<Spinner />` and disable the button using a `disabled={isLoading}` attribute while the Promise resolves or rejects. Update the corresponding `.scss` file to add `&:disabled` cursor/opacity states, and ensure `&:hover` is modified to `&:hover:not(:disabled)` so hover styles don't conflict.

## 2026-04-11 - Added Screen Reader Attributes to Decorative Emojis
**Learning:** Emojis used purely for visual aesthetics (like the avatar in `TaskCard`) can be read redundantly by screen readers if they lack proper semantic tags.
**Action:** When adding decorative emojis to UI components for visual polish, always wrap them in `<span role="img" aria-hidden="true">`. This prevents screen readers from announcing them unnecessarily, thereby maintaining accessibility standards.
