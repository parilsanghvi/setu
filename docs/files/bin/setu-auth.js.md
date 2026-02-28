---
source_hash: 6ab7090541c5c87d
facts_hash: 8394490dec38349f
generated_at: 2026-02-25T11:57:04.868Z
generator_version: 1.0.0
model: cheap
quality_score: 86
---
# File: bin/setu-auth.js

## Purpose
This file implements the Setu Auth Manager, a command-line tool that handles login, logout, and profile management for different authentication providers such as Google, OpenAI, Anthropic, and Ollama. It utilizes an authorization store to persist user credentials and profiles.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `handleLogin` | function | `providerArg` | Handles login requests for the specified provider by authenticating and saving user credentials to the authentication store. |
| `handleLogout` | function | `profileArg` | Removes a profile from the authentication store, prompting the user to confirm removal if necessary. |
|  | method | `!command` | Checks if no command is provided, in which case it displays a menu and waits for user input. |

## Internal Logic
The main execution flow begins with the `main` function, which checks the command-line arguments and dispatches to specific functions based on the selected action. The key functions involved are `handleLogin`, `handleLogout`, `showMenu`, and `listProfiles`. These functions handle the respective actions by interacting with the authentication store, displaying menus or profiles, or logging users out.

| Function | Description |
|----------|-------------|
| `main`   | Dispatches to specific functions based on the command-line arguments. |
| `handleLogin` | Authenticates the user and saves credentials to the authentication store for the specified provider. |
| `handleLogout` | Removes a profile from the authentication store, prompting the user to confirm removal if necessary. |
| `showMenu` | Displays a menu with options to login, list profiles, logout, or exit. |
| `listProfiles` | Lists all active profiles in the authentication store and displays their information. |

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/auth/auth-store` | Yes | Manages user credentials and profiles persistently across sessions. |
| `../lib/auth/google` | Yes | Provides OAuth2 authentication for Google. |
| `enquirer` | No | Facilitates interactive command-line input with menus and prompts. |

## Side Effects
- console_output: The tool logs success or failure messages to the console during login, logout, and other operations.
- database: None; the tool uses an in-memory authentication store instead of a persistent database.

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
- [google.js](../lib/auth/google.js.md)
