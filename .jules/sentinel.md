## 2024-06-01 - Missing Defense-in-Depth on High-Risk Endpoints
**Vulnerability:** Unauthenticated or insufficiently protected endpoints executing system commands (e.g., `execFile`).
**Learning:** Even if a global authentication middleware exists or the endpoint is seemingly obscured, high-risk endpoints must explicitly declare and apply their required authentication/authorization middleware at the route level to ensure defense-in-depth and prevent accidental exposure if global middleware is bypassed or refactored.
**Prevention:** Always explicitly apply `authMiddleware` (or equivalent) to the route definition of any endpoint executing `exec`, `execFile`, or performing sensitive system operations, e.g., `app.post('/api/route', authMiddleware, ...)`
