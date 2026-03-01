---
description: Tests for the DashboardServer API and ETag generation logic
---

# test-dashboard-api.js

Verifies the endpoints exposed by the backend API and ensures that ETag generation works correctly. The tests utilize \`Module.prototype.require\` interception to mock \`lib/db\` and \`lib/utils\`, while explicitly allowing \`express\` and its internal dependencies to load normally to prevent \`TypeError\` failures (e.g., \`compileETag\`).

This ensures that the \`DashboardServer\` responds with the expected API payloads and handles basic request routing and caching scenarios appropriately. It also validates that API endpoints return proper HTTP status codes.
