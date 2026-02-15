# Setu CLI Commands

The `setu` command is the main entry point for the Setu Modernization Engine.

## Installation

```bash
npm install -g setu
# OR inside a project
npm install setu
npx setu <command>
```

## Commands

### `setu start`
Starts the Setu Kernel (Sutradhar) in the background.
- **Logs:** `setu.log`
- **PID:** `setu.pid`

### `setu stop`
Stops the running Setu Kernel.

### `setu status`
Shows the current status of the Kernel and all active Agents.

### `setu init`
Initializes a new project by creating a `CONTEXT.md` file if one doesn't exist.

### `setu doctor`
**Run this first!**
Diagnoses the system health, checks for `.env`, verifies Docker connectivity, and ensures the database is reachable.
- **Exit Code 0:** System Healthy.
- **Exit Code 1:** Critical Issue found.

### `setu setup`
Runs the interactive setup wizard to configure:
- LLM Providers (OpenAI, Anthropic, Ollama)
- API Keys
- Docker Path

### `setu dashboard`
Launches the Mission Control interface.
- **--tui** (Default): Terminal User Interface.
- **--gui**: Web Interface (React) at `http://localhost:5173`.

### `setu chat "<message>"`
Sends a direct message to Sutradhar (The Orchestrator).
- Example: `setu chat "Migrate this folder to Python"`

### `setu task <id> <status> [owner]`
Manually updates a task's status in the Kanban board.
- Example: `setu task TASK-101 DONE Tark`
