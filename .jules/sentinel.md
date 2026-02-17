## 2024-05-24 - Path Traversal in File Download
**Vulnerability:** Path Traversal vulnerability in `/api/tasks/:id/screenshots` allowing arbitrary file read if directory permissions allow.
**Learning:** `req.params.id` was used directly in `path.join` without validation. Express does not automatically sanitize path parameters against `..` if they are URL-encoded or if the router allows them.
**Prevention:** Always validate user input against a strict allowlist (e.g. alphanumeric) before using it in filesystem operations.
