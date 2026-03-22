## 2024-03-08 - Added Loading and Disabled states to Async Modal Buttons
**Learning:** During destructive async operations like deleting a task or reverting its status, users were able to double-click the button because there was no visual feedback or disabled state.
**Action:** When implementing async actions attached to buttons, always integrate a `<Spinner />` and disable the button using a `disabled={isLoading}` attribute while the Promise resolves or rejects. Update the corresponding `.scss` file to add `&:disabled` cursor/opacity states, and ensure `&:hover` is modified to `&:hover:not(:disabled)` so hover styles don't conflict.

## 2024-05-24 - Focus Visible Focus Ring
**Learning:** Adding `:focus-visible` states via CSS is an effective way to improve keyboard navigation without affecting mouse users' experience (avoiding permanent `outline`).
**Action:** When implementing interactive elements, prefer `:focus-visible` over plain `:focus` to provide accessibility visual cues only when the user is navigating via keyboard.
