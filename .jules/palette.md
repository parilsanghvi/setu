## 2024-03-08 - Added Loading and Disabled states to Async Modal Buttons
**Learning:** During destructive async operations like deleting a task or reverting its status, users were able to double-click the button because there was no visual feedback or disabled state.
**Action:** When implementing async actions attached to buttons, always integrate a `<Spinner />` and disable the button using a `disabled={isLoading}` attribute while the Promise resolves or rejects. Update the corresponding `.scss` file to add `&:disabled` cursor/opacity states, and ensure `&:hover` is modified to `&:hover:not(:disabled)` so hover styles don't conflict.

## 2024-05-15 - TaskCard Accessibility and UX Enhancement
**Learning:** Decorative emojis like "👤" read out confusingly on screen readers (e.g. "bust in silhouette") and interrupt the flow when placed next to meaningful text. Also, relative timestamps (e.g. "5m ago") lack precision which users often need.
**Action:** Always add `aria-hidden="true"` to decorative emojis that don't add standalone meaning, and wrap relative timestamps in an element with a native `title` attribute to show exact absolute dates on hover.
