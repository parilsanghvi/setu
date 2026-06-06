## 2024-03-08 - Added Loading and Disabled states to Async Modal Buttons
**Learning:** During destructive async operations like deleting a task or reverting its status, users were able to double-click the button because there was no visual feedback or disabled state.
**Action:** When implementing async actions attached to buttons, always integrate a `<Spinner />` and disable the button using a `disabled={isLoading}` attribute while the Promise resolves or rejects. Update the corresponding `.scss` file to add `&:disabled` cursor/opacity states, and ensure `&:hover` is modified to `&:hover:not(:disabled)` so hover styles don't conflict.

## 2024-04-07 - Screen Readers and Decorative Icons
**Learning:** Screen readers announce text-based icons (like emojis or special characters like `✕` and `&times;`) redundantly if they are placed inside elements like buttons that already have descriptive `aria-label` attributes.
**Action:** When using visual-only icon characters (like `&times;`, `✕`, or emojis) inside buttons that already have descriptive `aria-label` attributes or visible text, wrap the character in `<span aria-hidden="true">` (and `role="img"` for emojis) to prevent redundant screen reader announcements.

## 2024-06-04 - Avoid aria-label on complex interactive containers
**Learning:** Adding a top-level `aria-label` to complex interactive container widgets (like a `TaskCard` div with `role="button"` that contains multiple internal text elements and badges) hides the internal semantic content from screen readers. Screen readers will read the `aria-label` and stop, missing details like "assignee", "time since", and "task ID".
**Action:** Use a `title` attribute instead to provide a visual tooltip on hover, while allowing screen readers to naturally traverse and announce the inner content of the complex widget.
