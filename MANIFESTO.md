## 3. The "Cohort" Protocol (Communication)

### The Chat Room (`chat.jsonl`) 💬
*   A persistent, append-only log of the conversation.
*   **Format:** JSON Lines.
    ```json
    {"id": 1, "from": "Narad", "to": "ALL", "type": "spec", "content": "Build login.", "ts": 17000}
    {"id": 2, "from": "DB-Lead", "to": "Narad", "type": "ack", "content": "On it.", "ts": 17005}
    ```
*   **Mechanism:** Agents use `fs.watch` to sleep until a new line appears.

### The State Board (`kanban.json`) 📋
*   The **Source of Truth** for task status.
*   Agents read this before starting work to check blockers.
*   **Schema:**
    ```json
    {
      "tasks": [
        {"id": "T-1", "owner": "DB-Lead", "status": "DONE"},
        {"id": "T-2", "owner": "BE-Lead", "status": "BLOCKED", "dependsOn": ["T-1"]}
      ]
    }
    ```
