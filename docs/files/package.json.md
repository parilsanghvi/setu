---
source_hash: d8fcd4cf97d6e6d1
facts_hash: 1d715ad0a64dc13d
generated_at: 2026-02-25T12:13:21.943Z
generator_version: 1.0.0
model: cheap
quality_score: 85
---
# File: package.json

## Purpose
The package.json file serves as the main configuration file for a Node.js project, specifying dependencies, scripts, and metadata for the application. It is used to manage the backend of the Sutradhar Application, which handles data storage and retrieval. The scripts listed in this file can be executed from the command line to start or watch the server.

## Exports / API Surface
| Export | Description |
| --- | --- |
| none detected |

## Internal Logic
The main execution flow begins with the `node` command, which starts the Node.js runtime environment. The `index.js` file is executed as the entry point of the application, where the Express server is initialized and connected to the database using the `better-sqlite3` library.

| Function | Description |
| --- | --- |
| `initExpressServer()` | Initializes a new instance of the Express server with configured middleware. |
| `connectToDatabase()` | Establishes a connection to the SQLite database using the `better-sqlite3` library. |

## Dependencies
| Dependency | Why |
| --- | --- |
| better-sqlite3 | Enables database interactions for storing and retrieving data. |
| blessed | Provides a simple way to create text-based user interfaces in Node.js. |
| blessed-contrib | Offers additional features for creating complex UI elements with Blessed. |
| cors | Configures Cross-Origin Resource Sharing (CORS) for secure API requests. |
| dotenv | Loads environment variables from a `.env` file into the application's scope. |
| enquirer | Facilitates user input and validation using a command-line interface. |
| express | Provides an efficient way to build web applications with Node.js. |
| gray-matter | Offers functionality for parsing Markdown metadata in files. |
| helmet | Configures security-related middleware for Express, including SSL/TLS encryption and Content Security Policy (CSP). |
| playwright-core | Enables the use of Playwright for browser automation and testing. |
| socket.io | Enables real-time communication between clients and servers using WebSockets. |
| zod | Validates data against a set of predefined schema rules using a type-safe schema language. |

## Side Effects
None detected.

## Dependents
No known dependents.

## Cross-References
No cross-references.
