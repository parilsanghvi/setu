## 2024-03-08 - Added Loading and Disabled states to Async Modal Buttons
**Learning:** During destructive async operations like deleting a task or reverting its status, users were able to double-click the button because there was no visual feedback or disabled state.
**Action:** When implementing async actions attached to buttons, always integrate a `<Spinner />` and disable the button using a `disabled={isLoading}` attribute while the Promise resolves or rejects. Update the corresponding `.scss` file to add `&:disabled` cursor/opacity states, and ensure `&:hover` is modified to `&:hover:not(:disabled)` so hover styles don't conflict.

## 2024-04-07 - Screen Readers and Decorative Icons
**Learning:** Screen readers announce text-based icons (like emojis or special characters like `✕` and `&times;`) redundantly if they are placed inside elements like buttons that already have descriptive `aria-label` attributes.
**Action:** When using visual-only icon characters (like `&times;`, `✕`, or emojis) inside buttons that already have descriptive `aria-label` attributes or visible text, wrap the character in `<span aria-hidden="true">` (and `role="img"` for emojis) to prevent redundant screen reader announcements.

## 2024-06-03 - Complex Interactive Container Accessibility
**Learning:** Applying a top-level `aria-label` to a complex interactive container (like a task card with `role="button"`) hides its internal semantic content (like nested headings or distinct data points) from screen readers, causing it to be read as a single generic, flat string.
**Action:** Avoid adding top-level `aria-label` attributes to complex interactive container widgets. Instead, use a `title` attribute to provide a visual tooltip for sighted users while allowing screen readers to naturally traverse the inner semantic structure of the content.
