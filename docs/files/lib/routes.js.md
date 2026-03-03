# `lib/routes.js`

## Purpose
This module defines the HTTP routes for the Mission Control dashboard application. It isolates routing logic from the main `DashboardServer` class to reduce complexity, handle API endpoint definition, and manage static file serving.

## Exports
- `setupRoutes(app, logger)`: A function that mounts the required middleware, security headers (Helmet), static assets, and API routes on the provided Express `app` instance.

## Dependencies
- `express`: For routing and static file handling.
- `helmet`: For applying standard security headers.
- `./db`: For database interactions (querying tasks and agents, updating tasks).
- `./middleware/auth`: For protecting routes with authentication.
- `./utils`: Contains utilities like `readLastLines`.
- `./onboarding/paths`, `./onboarding/status`, `./onboarding/governance-profiles`: Utilities specific to reading onboarding states and logs.
- `fs` & `path`: For file and directory resolution.

## Side Effects
- Registers routes and middleware on the provided Express application object.
- Validates onboarding status and enforces hard gates when creating tasks.
- Triggers events on the event bus (`db.send()`) when a chat message is posted.
