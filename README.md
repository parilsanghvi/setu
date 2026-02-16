# 🌉 Setu (सेतु)

**Setu** (Sanskrit: *Bridge*) is an Agentic Engineering Platform designed to manage and modernize complex codebases. It automates the process of development and modernization by running iterative, LLM-powered fix loops across a swarm of specialized agents.

## 🚀 Installation & Adoption

### 1. Installation
```bash
npm install
npm run dev # Launches Dashboard + Kernel
```

### 2. Adopting a Project
Navigate to any project and initialize the Swarm:
```bash
setu adopt
```

## 🧠 Key Features

| Feature | Description |
|---|---|
| **Swarm Orchestration** | Structured delegation via `TASK_ASSIGN` protocol. |
| **Skills as Code** | Dynamically extend agent capabilities with executable `.js` skills. |
| **Time Travel Debugging** | Replay and inspect past agent sessions turn-by-turn. |
| **Context Compaction** | Automatic long-term memory management using LLM summarization. |
| **Mission Control** | Real-time React dashboard for visual monitoring. |

## 🏗️ Architecture

Setu operates on core pillars:
1. **Sutradhar (The Manager)**: Orchestrates tasks and manages the high-level roadmap.
2. **Tark (The Backend Lead)**: Expert in logic, architecture, and server-side code.
3. **Shilpi (The Frontend Lead)**: Crafts modern UI/UX and handles layout migrations.
4. **Guru (The Wise)**: Manages knowledge, documentation, and agent skills.

## 🛠️ Global Commands

- `setu ignite`: Launch Mission Control (Setup + Dashboard + Kernel).
- `setu status`: Check the state of your agents and tasks.
- `setu chat "msg"`: Send a direct message to the Swarm.

## 🤝 Philosophy & Principles

### Modern Agentic Engineering
*   **Structured Autonomy:** Agents work independently but report via a strict protocol (`TASK_ASSIGN` -> `TASK_COMPLETE`).
*   **Skill-Based Evolution:** Agents learn new tools dynamically by scanning the `skills/` directory for executable logic.
*   **Full Observability:** "Time Travel" debugging ensures every thought and tool execution is logged and visualizable.

### Ancient Foundation
*   **Ancient Strategy:** Utilizing timeless patterns (Sanskrit personas) to solve modern technical debt.
*   **Isolation First:** Never run potentially destructive migrations on the host machine; prioritize containerized execution.
*   **Iterative Healing:** Modernization is a journey—fix one error, verify, and repeat until the bridge is built.

---
*Built with ❤️ by Paril and Bhondu.*
