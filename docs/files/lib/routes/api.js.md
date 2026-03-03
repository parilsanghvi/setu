## Purpose
The `api.js` file handles the routing logic for the dashboard backend APIs. It separates the API logic from the main `server.js` file to improve maintainability and readability by abstracting away the complex, voluminous route configurations and business logic into a dedicated module.

## Exports
This module exports a single function `setupApiRoutes(app, logger)` which is responsible for registering all the necessary dashboard API routes with the provided express `app` instance.

## Dependencies
- `express`: Used to create instances of router or handle specific body parsing requirements such as JSON payloads.
- `path`: Used to resolve system paths, primarily useful when accessing files or directories.
- `fs`: Provides filesystem access, such as reading configuration files, screenshots or checking access rights.
- `db`: The core SQLite database interface from the application, responsible for saving and retrieving tasks and agents.
- `utils`: Provides helper methods like `readLastLines`.
- `onboarding/paths`: Helper logic for resolving files within the codebase.

## Side Effects
Registers numerous GET and POST endpoints onto the provided `express` instance, effectively mutating its routing table. Additionally, the route handlers themselves have side effects related to database read/write operations or interacting with the filesystem when their respective endpoints are invoked.
