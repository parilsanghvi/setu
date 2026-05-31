## 2024-03-08 - Added Loading and Disabled states to Async Modal Buttons
**Learning:** During destructive async operations like deleting a task or reverting its status, users were able to double-click the button because there was no visual feedback or disabled state.
**Action:** When implementing async actions attached to buttons, always integrate a `<Spinner />` and disable the button using a `disabled={isLoading}` attribute while the Promise resolves or rejects. Update the corresponding `.scss` file to add `&:disabled` cursor/opacity states, and ensure `&:hover` is modified to `&:hover:not(:disabled)` so hover styles don't conflict.

## 2024-04-07 - Screen Readers and Decorative Icons
**Learning:** Screen readers announce text-based icons (like emojis or special characters like `✕` and `&times;`) redundantly if they are placed inside elements like buttons that already have descriptive `aria-label` attributes.
**Action:** When using visual-only icon characters (like `&times;`, `✕`, or emojis) inside buttons that already have descriptive `aria-label` attributes or visible text, wrap the character in `<span aria-hidden="true">` (and `role="img"` for emojis) to prevent redundant screen reader announcements.
## 2024-06-01 - Avoid aria-label on Complex Interactive Widgets
**Learning:** Adding a top-level `aria-label` to a complex widget (like a TaskCard `role="button"`) overrides and hides all of its rich internal semantic content (e.g. ID, status, assignee, time) from screen readers. Screen reader users only heard the `aria-label` instead of the useful metadata inside the card.
**Action:** Use a `title` attribute for visual hover tooltips on complex container widgets, allowing screen readers to naturally traverse and read the internal content tree.
