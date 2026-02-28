---
source_hash: 22e958dbd277f815
facts_hash: 22e958dbd277f815
generated_at: 2026-02-25T12:35:37.182Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: frontend/app/src/components

## Purpose
This folder contains various reusable React components used across the frontend application to facilitate user interaction, data visualization, and task management. The key responsibilities of these components include displaying agent information, sending and receiving messages in real-time, displaying kernel logs, managing modals for content display, showcasing screenshot galleries, indicating loading states, and rendering a task board.

## Key Files
| File | Role |
|------|------|
| `AgentCard.jsx` | Renders an agent's name, role, and status on a card interface. |
| `ChatBox.jsx` | Facilitates real-time communication between agents through message sending and receiving. |
| `LogViewer.jsx` | Displays a list of kernel logs with scrolling to the bottom upon new log addition. |
| `Modal.jsx` | Manages modal windows for content display, allowing closing via keydown or onClose callback. |
| `ScreenshotGallery.jsx` | Fetches and displays a gallery of screenshots for specific task IDs. |
| `Spinner.jsx` | Displays a loading indicator with customizable attributes and CSS classes. |
| `TaskBoard.jsx` | Renders the task board component with tasks organized by status and visual history navigation. |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: All components follow React's state management principles, ensuring clean and predictable state changes.
Likely: Components use semantic HTML structure and ARIA attributes for accessibility.
| Component | Rule |
|-----------|------|
| `AgentCard.jsx` | Uses CSS classes for responsive styling. |
| `ChatBox.jsx` | Utilizes WebSockets or similar technology for real-time communication. |
| `LogViewer.jsx` | Applies CSS module styling to maintain a consistent visual design. |
| `Modal.jsx` | Handles keydown events to provide user-friendly modal closing functionality. |
| `ScreenshotGallery.jsx` | Leverages image loading libraries for efficient and responsive gallery rendering. |
| `Spinner.jsx` | Employs CSS animations or transitions for smooth loading state transitions. |
| `TaskBoard.jsx` | Organizes tasks by status using a hierarchical component structure.

## Cross-References
- [AgentCard.jsx](../../../../../files/frontend/app/src/components/AgentCard.jsx.md)
- [ChatBox.jsx](../../../../../files/frontend/app/src/components/ChatBox.jsx.md)
- [LogViewer.jsx](../../../../../files/frontend/app/src/components/LogViewer.jsx.md)
- [Modal.jsx](../../../../../files/frontend/app/src/components/Modal.jsx.md)
- [ScreenshotGallery.jsx](../../../../../files/frontend/app/src/components/ScreenshotGallery.jsx.md)
- [Spinner.jsx](../../../../../files/frontend/app/src/components/Spinner.jsx.md)
- [TaskBoard.jsx](../../../../../files/frontend/app/src/components/TaskBoard.jsx.md)

