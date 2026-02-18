## 2024-05-24 - Path Traversal in File Download
**Vulnerability:** Path Traversal vulnerability in `/api/tasks/:id/screenshots` allowing arbitrary file read if directory permissions allow.
**Learning:** `req.params.id` was used directly in `path.join` without validation. Express does not automatically sanitize path parameters against `..` if they are URL-encoded or if the router allows them.
**Prevention:** Always validate user input against a strict allowlist (e.g. alphanumeric) before using it in filesystem operations.

## 2026-02-17 - Missing Content Security Policy
**Vulnerability:** API endpoints returned 200 OK without any Content-Security-Policy or security headers.
**Learning:** Security headers were completely absent for successful responses, leaving the application vulnerable to XSS and clickjacking. Helmet middleware was missing entirely.
**Prevention:** Always use helmet middleware or equivalent early in the middleware chain to enforce secure defaults for all responses.

## 2024-05-23 - [Critical] Unauthenticated WebSocket Access
**Vulnerability:** Socket.IO connections were completely unauthenticated, allowing anyone with network access to monitor real-time system logs, chat messages, and agent activities.
**Learning:** Middleware applied to Express apps (`app.use`) does not automatically protect Socket.IO namespaces when attached to the same HTTP server. Socket.IO requires its own middleware (`io.use`) to validate handshake data.
**Prevention:** Always explicitly attach authentication middleware to Socket.IO instances using `io.use()`, verifying headers or query parameters from the handshake.
