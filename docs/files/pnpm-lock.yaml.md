# pnpm-lock.yaml

## Purpose
This file is the lockfile for the root repository when using `pnpm`. It ensures deterministic dependency resolution for the backend and tooling scripts.

## Note
The `frontend/app` directory has its own `pnpm-lock.yaml` because it is managed as a separate package/workspace, but this root lockfile handles dependencies like `better-sqlite3`, `express`, and `socket.io` for the backend server.
