# File: frontend/app/src/components/Modal.jsx

## Purpose
The `Modal.jsx` component provides a reusable dialog/modal overlay for the frontend application. It handles keyboard accessibility requirements such as closing the modal with the 'Escape' key, managing focus within the modal (focus trap via 'Tab' and 'Shift+Tab'), and restoring focus to the original triggering element upon closure.

## Exports
- `Modal` (default export): A React functional component that renders its `children` inside a styled dialog overlay.

## Dependencies
- `react`: Uses `useEffect` and `useRef` hooks to manage lifecycle and DOM interactions.
- `./Modal.module.scss`: Imports modular CSS for styling the overlay and content containers.

## Side Effects
- Attaches and removes a `keydown` event listener to `document` to handle keyboard navigation (`Escape` and `Tab`).
- Reads from and writes to `document.activeElement` to manage focus state between the main application and the modal dialog.