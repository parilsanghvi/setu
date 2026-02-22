# System Index

Welcome to the Setu codebase. This system coordinates multi-agent AI execution across isolated runtime environments.

## Core Modules
- **`lib/onboarding`**: Generates and validates the governance baseline of the repository. See `ONBOARDING.json`. 
- **`bin/setu`**: The primary command-line interface logic bridging developer triggers to backend modules.
- **`frontend/dashboard`**: A React-based Mission Control UI that tracks worker agent lifecycles via WebSocket telemetry signals.

## Architecture Guidelines
All new commands added to `bin/setu` must:
1. Support `--json` flags for pipeline ingestion.
2. Delegate complex computing functions to pure modules under `lib/`.
3. Never throw unhandled Promise rejections; log them securely using the custom `Logger.js` tracer.
