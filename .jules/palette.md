## 2024-03-08 - Added Loading and Disabled states to Async Modal Buttons
**Learning:** During destructive async operations like deleting a task or reverting its status, users were able to double-click the button because there was no visual feedback or disabled state.
**Action:** When implementing async actions attached to buttons, always integrate a `<Spinner />` and disable the button using a `disabled={isLoading}` attribute while the Promise resolves or rejects. Update the corresponding `.scss` file to add `&:disabled` cursor/opacity states, and ensure `&:hover` is modified to `&:hover:not(:disabled)` so hover styles don't conflict.
## 2026-04-05 - Screen reader redundancy for modal close buttons
**Learning:** When using characters like &times; or ✕ for close buttons, if the button has an aria-label, the character must be wrapped in <span aria-hidden="true"> to prevent screen readers from redundantly announcing both the label and the character.
**Action:** Always wrap visual-only icon characters in <span aria-hidden="true"> inside buttons that already have descriptive aria-labels.
