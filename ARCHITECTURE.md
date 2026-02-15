# 🌉 Setu (सेतु): The Fractal Agent Swarm

**Setu** is an autonomous software consultancy in a box. It uses a swarm of specialized agents (Leads) and sub-agents (Interns) to maintain, upgrade, and refactor codebases. It mimics a high-performance engineering team with strict roles, state management, and communication protocols.

---

## 1. The Hierarchy (The Org Chart)

### 👑 Sutradhar (The Kernel)
*   **Role:** Project Manager & System Kernel.
*   **Responsibilities:**
    *   Interface with the User (You).
    *   Maintain the Global State (`Kanban`).
    *   Resolve disputes between Leads.
    *   **Does not code.**

### 🛠️ The Cohort (The Leads)
Autonmous agents with domain-specific authority.
1.  **Tark (Backend Lead):** Logic, API, Performance.
2.  **Shilpi (Frontend Lead):** UI/UX, State, Accessibility.
3.  **Koshpal (Database Lead):** Schema, Migrations, Integrity.
4.  **Rakshak (Security Lead):** Audits, Secrets, OWASP Compliance.

### 🎓 The Shishyas (Interns)
*   **Ephemeral:** Spawned by Leads for specific tasks.
*   **Role:** "Refactor these 50 files", "Write unit tests for this module".
*   **Scope:** Limited to a specific folder or file context.
*   **Life Cycle:** Spawn -> Work -> Report -> Die.

---

## 2. The Communication Protocol (The Nervous System)

### 🗣️ The Chat Room (`setu.db / messages`)
*   **Mechanism:** A persistent SQLite table acting as an asynchronous message bus.
*   **Flow:** Agents "listen" for messages addressed to them or `ALL`.
*   **Format:**
    ```json
    {
      "from": "Backend-Lead",
      "to": "Frontend-Lead",
      "type": "alert",
      "content": "API endpoint /login changed. Update your types."
    }
    ```

### 📋 The State Board (`setu.db / tasks`)
*   **Mechanism:** A Kanban board in SQLite.
*   **Purpose:** The Single Source of Truth for project status.
*   **Rule:** Agents check this *before* asking "What do I do?".
*   **States:** `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`.

---

## 3. The Fractal Context (The Memory) 🌳

Information is stored where it belongs (Locality of Reference).

### 📂 File Structure
```text
/project-root
  ├── CONTEXT.md          <-- Narad's Brain (Product Spec)
  ├── kanban.json         <-- (Legacy/Backup)
  │
  ├── /backend
  │    ├── CONTEXT.md     <-- Backend Lead's Domain (API Contracts)
  │    ├── JOURNAL.md     <-- The "Append-Only" Log for Interns
  │    ├── /auth-service
  │    │    ├── CONTEXT.md  <-- Intern's Context (Implementation Details)
  │
  └── /frontend
       ├── CONTEXT.md     <-- Frontend Lead's Domain
```

### 📝 The "Owner-Writer" Protocol
*   **Rule:** Only the **Owner** of a folder can write to its `CONTEXT.md`.
*   **Interns:** Write to `JOURNAL.md`. The Lead reads the journal and synthesizes updates into `CONTEXT.md`.
*   **Why:** Prevents race conditions and keeps documentation high-quality.

---

## 4. The Skill System (The DNA) 🧬

Skills are modular functions injected into agents upon spawn.

### The 5 Base Skills
Every Lead has a specialized version of these:
1.  **Drishti (Scanner) 👁️:** Analyzes code/dependencies.
2.  **Ranabhoomi (Sandbox) ⚔️:** Runs code in Docker (Isolation).
3.  **Sudhar (Fixer) 🔧:** LLM loop to patch errors.
4.  **Pariksha (Verifier) ✅:** Runs tests to prove correctness.
5.  **Suraksha (Security) 🛡️:** Audits for vulnerabilities.

### Injection Mechanism
*   When Sutradhar spawns **Tark (Backend Lead)**, it injects: `[NodeScanner, DockerSandbox, SecurityAudit]`.
*   When Tark spawns **Shishya (Intern)**, it injects: `[FileRead, FileWrite]`. (Least Privilege).

---

## 5. The Workflow (The Loop) 🔄

1.  **Trigger:** User tells Sutradhar: "Migrate to Node 24."
2.  **Plan:** Sutradhar creates `TASK-1` (Backend) and `TASK-2` (Frontend) in Kanban.
3.  **Dispatch:** Sutradhar sends a message to Tark.
4.  **Action:**
    *   Tark wakes up.
    *   Reads `backend/CONTEXT.md`.
    *   Spawns `Shishya-1` with `Drishti` skill to scan for breaking changes.
5.  **Execution:**
    *   Shishya finds issues, writes to `backend/JOURNAL.md`.
    *   Tark reads Journal, plans refactor.
    *   Tark spawns `Shishya-2` to fix code (using `Sudhar`).
6.  **Verification:**
    *   Tark runs `Pariksha` (Tests).
    *   If Green -> Updates Kanban to `DONE`.
7.  **Closure:** Sutradhar sees `DONE` and notifies User.

---

## 6. Safety Valves ⛑️

1.  **The Three-Strike Rule:** If an agent fails a task 3 times, it pauses and asks for Human Help.
2.  **Git Branching:** All work happens on feature branches. Leads merge PRs.
3.  **Sandboxing:** Destructive commands run only in Docker (`Ranabhoomi`).
