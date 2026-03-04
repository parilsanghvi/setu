---
source_hash: b264458b15b9032e
facts_hash: b264458b15b9032e
generated_at: 2026-03-04T07:16:07.935Z
generator_version: 1.0.0
model: cheap
quality_score: 0
---
# Coding Conventions

## Naming Conventions

### File Naming Patterns

* Files in the `benchmarks` folder follow the convention of containing a test suite name followed by `_test.js`, e.g., `fs_test.js`.
* The `frontend/app/src` folder follows a consistent naming convention where folders are capitalized and variables are underscore-separated, e.g., `Components_Headers`.
* The `.env.example` file is formatted as key-value pairs with underscores instead of camelCase, e.g., `DATABASE_URL=sqlite:///dev.db`.

### Class Naming

* Agents in the `agents` folder follow the convention of being nouns (e.g., `Agent`, `Socket`, `Dashboard`) or verbs (e.g., `updateDashboard`).
* The `frontend/app/src/components/` folder contains reusable UI components, which are capitalized and underscore-separated, e.g., `UserAuthComponent`.
* Utility functions in the `frontend/app/src/utils/` folder follow a consistent naming convention of being nouns (e.g., `LogUtils`) or verbs (e.g., `logCleanup`).

### Variable Naming

* Variables within agent classes use camelCase with underscores for clarity, e.g., `socketId`.
* The `frontend/app/src/hooks/` folder contains the `useSocket.js` hook, which returns a single object property named `socket`.

## Architectural Patterns

The project follows the Event-Driven Architecture (EDA) pattern. Agents in the `agents` folder act as the main entry points for handling events and interactions within the system.

### Event Bus Pattern

Although not explicitly implemented in the provided context, the project is designed to utilize an event bus or pub/sub messaging system for communication between agents. The `useSocket.js` hook in the `frontend/app/src/hooks/` folder could be seen as a part of this pattern, but it does not follow traditional event bus principles.

### Agent Base Class Pattern

The `agents` folder contains multiple agent classes (e.g., `Agent`, `Socket`) that inherit from or implement base classes (e.g., `AbstractAgent`). These agents handle specific tasks and interactions within the system.

## Database Patterns

The project uses a direct database connection for data access. There is no explicit mention of an ORM (Object-Relational Mapping) library being used in the provided context.

## Error Handling

Error handling is not explicitly documented, but it appears to follow best practices such as:

* Raising exceptions with informative messages
* Using try-catch blocks for error handling
* Utilizing logging mechanisms for debugging purposes

However, without explicit documentation or code examples, the exact implementation of error handling cannot be accurately described.

## Anti-Patterns to Avoid

* Overly complex or tightly coupled code: Agents in the `agents` folder should strive to be loosely coupled and easily maintainable.
* Ignoring security best practices: The project should prioritize secure coding practices, especially when handling sensitive data or user authentication.
* Neglecting testing and validation: Thorough testing and validation of agents and their interactions are crucial for ensuring the system's reliability.

## File Organization Rules

The project follows a consistent file organization structure:

* The `frontend/app/src` folder contains main application code.
* The `agents` folder contains agent classes and related functionality.
* The `database/` folder contains database-related code.
* The `.github/workflows/` folder contains GitHub Actions workflows for governance, onboarding, and other tasks.

This structure enables easy navigation and reusability of code within the project.
