---
name: ranabhoomi
description: Executes code in a secure, isolated Docker sandbox. Use when asked to "run", "execute", or "test" unsafe code.
tags: general
---
# Ranabhoomi (The Sandbox) ⚔️

Ranabhoomi ensures that code execution does not harm the host system.

## Capabilities

### 1. `run_safe_command`
Executes a command inside a Node.js Docker container.

**Usage (JavaScript):**
```javascript
const docker = require('../../lib/Docker');
docker.run('node:18-alpine', ['node', '-e', 'console.log("Hello from Sandbox")'], {
    mounts: [{ host: process.cwd(), container: '/app', mode: 'ro' }]
});
```

### Protocol
1. **Always** mount the current working directory as read-only (`ro`) unless writing is explicitly required.
2. **Never** enable network access unless requested.
