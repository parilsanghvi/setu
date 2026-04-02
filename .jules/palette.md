## 2024-03-08 - Added Loading and Disabled states to Async Modal Buttons
**Learning:** During destructive async operations like deleting a task or reverting its status, users were able to double-click the button because there was no visual feedback or disabled state.
**Action:** When implementing async actions attached to buttons, always integrate a `<Spinner />` and disable the button using a `disabled={isLoading}` attribute while the Promise resolves or rejects. Update the corresponding `.scss` file to add `&:disabled` cursor/opacity states, and ensure `&:hover` is modified to `&:hover:not(:disabled)` so hover styles don't conflict.

## 2025-01-22 - Visual Polish to Empty Kanban Columns
**Learning:** Empty states in kanban columns were just plain text, making the board look stark when empty. Adding decorative emojis improves the visual hierarchy and makes the empty states feel intentional rather than like missing data.
**Action:** When designing empty states for list/grid components, always include a decorative visual element (like an icon or emoji) to anchor the text, ensuring it is hidden from screen readers using `aria-hidden="true"` and `role="img"` to maintain accessibility without cluttering the screen reader output.
