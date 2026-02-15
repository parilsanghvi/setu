---
name: suraksha
description: Audits code and dependencies for security vulnerabilities. Use when asked to "audit", "secure", or "check security".
tags: general
---
# Suraksha (The Security Guard) 🛡️

Suraksha protects the system from vulnerabilities.

## Capabilities

### 1. `audit_dependencies`
Checks for known vulnerabilities in `node_modules`.
```bash
npm audit
```

### 2. `scan_secrets`
Checks for hardcoded secrets.
```bash
grep -r "API_KEY" .
grep -r "PASSWORD" .
```
