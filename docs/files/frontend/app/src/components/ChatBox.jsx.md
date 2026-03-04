---
source_hash: 7247ebee6defe7a9
facts_hash: 58a02b25f73d7774
generated_at: 2026-03-04T05:29:48.132Z
generator_version: 1.0.0
model: cheap
quality_score: 97
---
# File: frontend/app/src/components/ChatBox.jsx

## Purpose
The ChatBox component is a UI element that displays a conversation interface, allowing users to send and receive messages with agents. It fetches message history from the server and updates it in real-time as new messages are sent. The component also handles user input and sends messages to the server.

## Exports / API Surface
| Export | Type | Description |
|--------|------|-------------|
| `ChatBox` | function | Renders a conversation interface |
| `React.memo` | function | Memoizes the ChatBox component |

## Internal Logic
The main execution flow of the ChatBox component is as follows:

- The component initializes its state with an empty message and target agent.
- When the prefillTaskText prop changes, the component updates its message and target agent accordingly.
- The component fetches its chat history from the server using the useEffect hook and stores it in the useMemo hook.
- When the chat history changes, the component scrolls to the bottom of the conversation list using the messagesEndRef.
- The component handles keyboard input with the handleKeyDown function, which sends a message when the Enter key is pressed without Shift.
- The send function is called when the form is submitted, sending the current message and target agent to the server.
- The renderMessageContent function parses HTML content from the marked library.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `React` | Yes | Provides the foundation for building user interfaces |
| `./ChatBox.module.scss` | Yes | Styles the UI components of the ChatBox |
| `./Spinner` | Yes | Displays a loading spinner when sending messages |
| `marked` | No | Parses HTML content from markdown format |

## Side Effects
- Network: The send function sends a request to the server to send a message, which may result in network requests and responses.

## Dependents
- [TaskCreationModal.jsx](./TaskCreationModal.jsx.md)

## Cross-References
- [ChatBox.module.scss](./ChatBox.module.scss.md)
- [Spinner.jsx](./Spinner.jsx.md)
- [TaskCreationModal.jsx](./TaskCreationModal.jsx.md)
