---
name: database-migration
description: The Standard Operating Procedure (SOP) for database schema changes (SQL/NoSQL).
version: 1.0.0
author: Database-Lead
---

# 💾 Database Migration Protocol

Use this skill when tasked with "Schema Evolution" (e.g., adding tables, renaming columns).

## 🛑 The Golden Rule (Hands Off Prod)
**NEVER** execute migrations directly on production.
**NEVER** connect to the real database.
**ALWAYS** output a `.sql` artifact for Human Review.

## 🔄 Phase 1: The Simulation (Local Only)

1.  **Isolate the Schema:** Identify the current schema (`schema.sql` or TypeORM entities).
2.  **Sandbox:** Spin up a **Local Docker Container** (Postgres/MySQL/Mongo).
    *   Load the *current* production schema into the container.
    *   **Verify:** Ensure the sandbox matches production structure.
3.  **Document:** Update `database/CONTEXT.md` with "Migration Planned: Add Users Table".

## 🏗️ Phase 2: The Script (Artifact Generation)

1.  **Draft Migration:** Create a new migration file (e.g., `migrations/20260215_add_users.sql`).
    *   **Rule:** Include `DOWN` migration (rollback logic).
    *   **Rule:** Use `IF NOT EXISTS` (Idempotency).
2.  **Test Migration:** Run the script *inside the Docker Sandbox*.
    *   **Verify:** Check if tables/columns exist.
    *   **Verify:** Check for data loss (if modifying existing tables).
3.  **Rollback Test:** Run the `DOWN` migration inside the sandbox.
    *   **Verify:** Ensure schema returns to original state.

## 🔀 Phase 3: The Handoff (Human Review)

1.  **Output Artifact:** Save the verified SQL script to `artifacts/MIGRATION_READY.sql`.
2.  **Notify User:**
    *   **Message:** "✅ Migration tested in Sandbox. Ready for review."
    *   **Action:** Ask the user to apply it manually.
    *   **DO NOT EXECUTE.**

## ✅ Phase 4: Sync

1.  **Wait for User:** Do not proceed until user confirms "Applied to Prod".
2.  **Update Docs:** Mark schema as "Updated" in `database/CONTEXT.md`.
