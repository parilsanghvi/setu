## 2024-03-08 - Added Loading and Disabled states to Async Modal Buttons
**Learning:** During destructive async operations like deleting a task or reverting its status, users were able to double-click the button because there was no visual feedback or disabled state.
**Action:** When implementing async actions attached to buttons, always integrate a `<Spinner />` and disable the button using a `disabled={isLoading}` attribute while the Promise resolves or rejects. Update the corresponding `.scss` file to add `&:disabled` cursor/opacity states, and ensure `&:hover` is modified to `&:hover:not(:disabled)` so hover styles don't conflict.
## 2024-03-25 - TaskCreationModal Accessibility and Focus Fix
**Learning:** `TaskCreationModal` previously trapped focus incorrectly if `onClose` was a dependency in `useEffect`, as it would re-focus the modal container abruptly. Also, using React hooks inside conditions or incorrectly setting state inside a render-cycle caused warning regressions.
**Action:** Used `useRef` for callbacks that should not trigger effects, and properly added `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` so screen readers recognize it.
