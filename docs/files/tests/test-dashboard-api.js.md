---
title: Test Dashboard API
description: "Integration tests for the Dashboard API endpoints."
---

# \`tests/test-dashboard-api.js\`

## Purpose
This file contains integration tests for the \`/api/agents\` and \`/api/chat\` endpoints served by the \`DashboardServer\`.

## Tests
- Agent count and details retrieval.
- Chat message broadcasting to specified channels/agents.

## Important Notes
- Requires a mocked environment for \`lib/db.js\` to simulate agent state and history.
