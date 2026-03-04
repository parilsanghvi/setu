---
source_hash: 203ac9ae0ae0ade2
facts_hash: 203ac9ae0ae0ade2
generated_at: 2026-03-04T10:14:07.445Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: frontend/app/src/components

## Purpose
This folder contains a collection of reusable UI components and functionality for the frontend application, including agent information displays, chat interfaces, log viewers, modals, onboarding status indicators, screenshot galleries, spinners, task boards, card displays, column lists, and modal detail windows. These components are designed to be reusable across the application to improve user experience and reduce code duplication.

## Key Files
| File | Role |
|------|------|
| `AgentCard.jsx` | Renders a card displaying agent information |
| `ChatBox.jsx` | Displays a conversation interface with agents |
| `LogViewer.jsx` | Scrolls to the bottom of kernel logs when new ones are added |
| `Modal.jsx` | Provides an on_close callback for modal closing behavior |
| `OnboardingStatus.jsx` | Renders the onboarding status component with provided data |
| `ScreenshotGallery.jsx` | Displays screenshots for a given task ID in a gallery format |
| `Spinner.jsx` | Displays a spinning animation to indicate loading or progress |
| `TaskBoard.jsx` | Displays a Kanban board for task management |
| `TaskCard.jsx` | Displays task details and handles keyboard input |
| `TaskColumn.jsx` | Displays a list of tasks organized by status |
| `TaskCreationModal.jsx` | Allows users to create new tasks in a chat-based interface |
| `TaskDetailModal.jsx` | Displays detailed information about a specific task |

## Ownership
Not yet assigned.

## Invariants / Rules
Likely: All components must use React memoization for performance optimization.
Likely: All state changes must be handled through controlled components or the `useEffect` hook.

## Cross-References
- [AgentCard.jsx](../../../../../files/frontend/app/src/components/AgentCard.jsx.md)
- [ChatBox.jsx](../../../../../files/frontend/app/src/components/ChatBox.jsx.md)
- [LogViewer.jsx](../../../../../files/frontend/app/src/components/LogViewer.jsx.md)
- [Modal.jsx](../../../../../files/frontend/app/src/components/Modal.jsx.md)
- [OnboardingStatus.jsx](../../../../../files/frontend/app/src/components/OnboardingStatus.jsx.md)
- [ScreenshotGallery.jsx](../../../../../files/frontend/app/src/components/ScreenshotGallery.jsx.md)
- [Spinner.jsx](../../../../../files/frontend/app/src/components/Spinner.jsx.md)
- [TaskBoard.jsx](../../../../../files/frontend/app/src/components/TaskBoard.jsx.md)
- [TaskCard.jsx](../../../../../files/frontend/app/src/components/TaskCard.jsx.md)
- [TaskColumn.jsx](../../../../../files/frontend/app/src/components/TaskColumn.jsx.md)
- [TaskCreationModal.jsx](../../../../../files/frontend/app/src/components/TaskCreationModal.jsx.md)
- [TaskDetailModal.jsx](../../../../../files/frontend/app/src/components/TaskDetailModal.jsx.md)

