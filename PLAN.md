# 🌉 Setu: The "Unhinged Agency" Master Plan (Definitive Edition)

**Goal:** Build an autonomous, self-learning software consultancy that modernizes legacy code with "Unhinged" standards.
**Philosophy:** Capitalism (Budgets) + Evolution (Learning) + Paranoia (Safety) + Intelligence (LLM).

---

## 1. The Nervous System (Kernel) ⚡

**Objective:** A reactive, crash-proof event bus.

*   **Narad (The Kernel):**
    *   **Role:** Project Manager & System Process.
    *   **Mechanism:** Watches SQLite `messages` table (The Bus).
    *   **Resurrection:** Polls `agents` table. If `last_heartbeat > 30s`, it kills the PID and respawns the Agent.
    *   **The Dispatcher:** Routes messages to Leads. Spawns "Interns" on demand.

*   **The Bus (SQLite):**
    *   **Tables:** `messages` (Chat), `tasks` (Kanban), `agents` (Registry).
    *   **Protocol:** Agents "listen" via polling/hooks.
    *   **Heartbeat:** Every agent runs `beat()` every 5s.

---

## 2. The Fractal Cortex (Memory) 🧠

**Objective:** Context that scales without race conditions.

*   **Structure:**
    ```text
    /project
      ├── CONTEXT.md       (Narad's High-Level Spec)
      ├── /backend
      │    ├── CONTEXT.md  (Backend Lead's Domain - LOCKED)
      │    ├── JOURNAL.md  (Intern's Daily Log - APPEND ONLY)
    ```

*   **The "Owner-Writer" Rule:**
    *   **Rule:** Only the **Folder Owner** (e.g., Backend Lead) can write to `CONTEXT.md`.
    *   **Interns:** Must write to `JOURNAL.md`.
    *   **Synthesis (Automated):** A cron job triggers Leads every hour to read `JOURNAL.md`, summarize updates into `CONTEXT.md`, and clear the journal.

---

## 3. The "Unhinged" Squad (Personas) 🎭

**Objective:** Enforce extreme quality standards via distinct personalities backed by LLM Intelligence.

### 🎩 Backend Lead ("The Purist")
*   **Trait:** Rejects code with `console.log`, `any`, or lint errors.
*   **Brain:** Uses `lib/LLM.js` with "Strict Performance Engineer" system prompt.
*   **Behavior:**
    *   If `console.log` is found -> **Roast the Intern**.
*   **Skills:** `[NodeScanner, DockerSandbox, LintEnforcer]`.

### 🎨 Frontend Lead ("The Artist")
*   **Trait:** Obsessed with Pixel Perfection.
*   **Brain:** Uses `lib/LLM.js` with "Visual Designer" system prompt.
*   **Behavior:**
    *   Takes a **Screenshot** (Playwright) of the build.
    *   Compares with Figma/Baseline.
    *   If diff > 5px -> **Reject PR**.
*   **Skills:** `[ReactScanner, PlaywrightVisualDiff]`.

### 💾 Database Lead ("The Hoarder")
*   **Trait:** Terrified of data loss.
*   **Brain:** Uses `lib/LLM.js` with "Paranoid DBA" system prompt.
*   **Behavior:**
    *   Takes a **Snapshot** before *every* migration.
    *   If a migration takes >5s -> **Kill Process & Rollback**.
*   **Skills:** `[SQLScanner, SnapshotManager]`.

---

## 4. The Learning Engine (Drona) 🏹

**Objective:** The system gets smarter over time.

*   **The Guru Agent (Drona):**
    *   **Trigger:** When a Task is marked `DONE` and was rated "Hard" (High Token Cost).
    *   **Action:**
        1.  Reads the Task Journal.
        2.  Extracts the **Pattern** (Problem -> Solution).
        3.  Generates a new Skill File: `skills/learned/pattern-name.md`.
    *   **Result:** Next time, Leads use this Skill instead of reasoning from scratch.

---

## 5. The Internal Economy (Capitalism) 💰

**Objective:** Incentivize efficiency and prevent runaway costs.

*   **The Budget Protocol:**
    *   **Narad:** Assigns a Budget (e.g., $5.00) to a Feature.
    *   **Leads:** "Pay" Interns from their budget.
    *   **Bankruptcy:** If a Lead runs out of money, the Task is **PAUSED**.
    *   **Bailout (Bribe):** User can inject funds (`setu pay backend-lead 5.00`) to unblock tasks.

---

## 6. Execution Roadmap 🚀

1.  **Phase 1:** Implement `index.js` (Narad) & `lib/Agent.js` (Heartbeats). ✅ *In Progress*
2.  **Phase 2:** Implement `lib/Context.js` (Fractal Memory) & `lib/LLM.js` (The Brain).
3.  **Phase 3:** Build the first "Unhinged" Agent (Backend Lead).
4.  **Phase 4:** Activate Drona (The Learning Loop).
5.  **Phase 5 (Polish):**
    *   **God Mode Dashboard:** TUI for monitoring Chat/Kanban/Budget.
    *   **Big Bang Init:** `setu init --scan` to auto-populate `CONTEXT.md` for existing repos.
    *   **Containerization:** Move all Intern execution to `DockerSandbox` (`network: none`).
