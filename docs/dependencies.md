---
source_hash: b264458b15b9032e
facts_hash: b264458b15b9032e
generated_at: 2026-03-04T07:17:11.237Z
generator_version: 1.0.0
model: cheap
quality_score: 0
---
# Dependency Map

## Runtime Dependencies

### Server
- express: A Node.js web framework used for creating web applications and APIs.
- http: The built-in HTTP module for handling HTTP requests and responses.

### Security
- @eslint/js: An ESLint plugin that provides rules and configurations for JavaScript projects.
- globals: An ESLint configuration file that sets up global variables and imports for the project.

### Database
- db: A custom database module responsible for interacting with the database.

### AI/LLM
- ../lib/LLM/OpenAICompatible: A library that provides compatibility with OpenAI's LLM APIs.
- @playwright/test: A testing framework used to test the application's frontend functionality in different browsers and environments.

### Utilities
- bus: A communication bus module that facilitates real-time data updates between components.
- child_process: The built-in Node.js module for working with child processes.
- perf_hooks: The built-in Node.js module for measuring performance metrics.
- stylelint: A static code analysis tool used to enforce CSS best practices and linting.

### Internal Modules
- ../lib/CoreAgent: A core agent module responsible for handling core tasks and interactions within the system.
- ../lib/Contractor: A contractor module that provides functionality for task management and logging.
- ../lib/SkillLoader: A skill loader module responsible for loading skills and knowledge graphs.
- ../lib/Context: A context module that provides a centralized data store for the application.

### Critical Dependency Chains
- index.js → db.js → better-sqlite3: This dependency chain is critical to the application's database interactions and SQL queries.
- ChatBox.module.scss → useSocket.js → globals: This dependency chain is essential for setting up real-time communication between components.

## External Services

- OpenAI APIs (via ../lib/LLM/OpenAICompatible): The project connects to OpenAI's LLM APIs for natural language processing and text analysis tasks.
- Google APIs (via ../lib/auth/google): The project connects to Google APIs for authentication and authorization purposes.
