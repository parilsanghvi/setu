# System Runbook

## 1. Local Setup
Ensure your environment meets the engine requirements `Node >= 20.0.0`.

```bash
npm install
npm run build
```

## 2. CLI Execution
Validating the onboarding baseline is the required entrypoint for active development:
```bash
setu onboarding status
setu onboarding doctor --trend
```

## 3. Dashboard Web Server
To launch the mission control React UI:

**Happy Path:**
```bash
setu start
# Outputs: Dashboard active on http://localhost:3000
```

**Failure Path: Port Conflict (EADDRINUSE):**
If `EADDRINUSE` occurs because Port 3000 is occupied, supply an explicit port variable:
```bash
PORT=8080 setu start
```
