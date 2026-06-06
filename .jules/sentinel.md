## 2026-06-06 - XSS vulnerability in ChatBox.jsx
**Vulnerability:** Markdown content converted to HTML and directly injected via `dangerouslySetInnerHTML` without sanitization.
**Learning:** Baseline react applications often forget `DOMPurify` when using `marked`.
**Prevention:** Always use `DOMPurify.sanitize()` when injecting HTML derived from user or LLM input.
