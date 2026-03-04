---
source_hash: 53a384fd0f4ff9b6
facts_hash: 54fcedd715a32037
generated_at: 2026-03-04T05:47:06.681Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: package.json

## Purpose
The `package.json` file serves as the configuration file for a Node.js project, containing metadata about the project, its dependencies, and scripts that can be executed.

## Exports / API Surface
| Name | Description |
| --- | --- |
| scripts.start | Starts the application by executing the index.js script. |
| scripts.dev | Starts the development server with watch mode enabled for the index.js script. |
| scripts.ignite | Executes the ignite.js script using Node.js. |
| scripts.onboarding.status | Runs the onboarding-status.js script to check the onboarding status of the application. |

## Internal Logic
The main execution flow starts when the `package.json` file is required, which leads to the initialization of the project's dependencies and scripts.

## Dependencies
| Name | Why |
| --- | --- |
| better-sqlite3 | Enables SQLite support for the project. |
| blessed | Provides a terminal-like interface for the application. |
| blessed-contrib | Offers various components for building the terminal interface. |
| cors | Enables cross-origin resource sharing for the application. |
| dotenv | Loads environment variables from the .env file. |
| enquirer | Facilitates user input and interaction with the application. |
| express | Sets up an HTTP server for the application. |
| gray-matter | Handles Markdown parsing and generation for the application. |
| helmet | Security headers are applied to protect the application. |
| playwright-core | Enables browser automation and testing capabilities. |
| socket.io | Establishes real-time communication channels between clients and servers. |
| zod | Validates user input data using a schema-based approach. |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
No cross-references.
