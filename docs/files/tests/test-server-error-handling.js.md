---
description: Tests for error handling inside the DashboardServer
---

# test-server-error-handling.js

Verifies that the server does not crash or leak information when API requests error. It mocks \`express\` and \`socket.io\` to verify that API endpoints return generic error messages instead of leaking internal exception details during server failures.

This ensures secure error handling by catching exceptions in API endpoints and returning a generic "Internal Server Error" to the client while logging detailed error messages server-side via \`this.logger.error\`, preventing stack trace leakage.
