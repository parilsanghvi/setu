---
source_hash: 6ab7090541c5c87d
facts_hash: b0674568d95cb148
generated_at: 2026-03-03T07:08:03.968Z
generator_version: 1.0.0
model: cheap
quality_score: 86
---
# File: bin/setu-auth.js

## Purpose
This file contains the main entry point for the Setu Auth Manager application, responsible for handling user authentication and profile management.

| Symbol | Type | Params | Description |
|--------|------|--------|-------------|
| `main` | function | `` | 
| `handleLogin` | function | `providerArg` | 
| `handleLogout` | function | `profileArg` | 

## Internal Logic
The main execution flow of this file is as follows:

1. The `main` function checks if a command was passed in the command line arguments, and if not, it calls the `showMenu` function to display a menu.
2. The `showMenu` function prompts the user to select an action using the Enquirer library, and based on their selection, it calls either the `handleLogin`, `listProfiles`, or `handleLogout` function.
3. The `handleLogin` function handles login functionality for different providers (Google, OpenAI, Anthropic, Ollama), and saves the user's credentials to the AuthStore.
4. The `handleLogout` function removes a selected profile from the AuthStore.

## Dependencies
| Module | Local | Why |
|--------|-------|-----|
| `../lib/auth/auth-store` | Yes | 
| `../lib/auth/google` | Yes | 
| `enquirer` | No | 

## Side Effects
- console_output: The application logs messages to the console, including success and error messages.
- database: The AuthStore is used to store user credentials and profiles in a local storage solution (not explicitly stated as a database).

## Dependents
No known dependents.

## Cross-References
- [auth-store.js](../lib/auth/auth-store.js.md)
- [google.js](../lib/auth/google.js.md)
