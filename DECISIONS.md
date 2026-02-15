# 📄 The Setu Consensus (Decision Log)

This document records the finalized architectural decisions and philosophies of Project Setu. These are the "Immutable Laws" the swarm must follow.

---

## ⚖️ 1. The Dictator Model (Gavel > Therapist)
- **Decision:** Replace n-way "Board Meetings" with a **Veto-based Spec Negotiation**.
- **The Mechanism:**
    - **Narad** issues an Initial Spec (Architecture as Code) based on the User's prompt.
    - **Leads** can issue a `VETO` with a technical reason (e.g., "Index limit exceeded").
    - **Narad** modifies the spec and re-issues.
- **Why:** Prevents "Infinite Apology Loops" and minimizes token cost.

## 🧠 2. Simple Hierarchical Memory (YAGNI Vectors)
- **Decision:** No Vector DB (Chroma/Pinecone) for now. Use **Hierarchical Grep**.
- **The Structure:** `skills/learned/[lead]/[category]/pattern.md`.
- **The Retrieval:** Agents only scan their specialized sub-folders.
- **Why:** Grep is free, instant, and sufficient for <1,000 skills.

## 👁️ 3. Specialist Trust (Vision Delegation)
- **Decision:** Narad does **not** need Multimodal Vision. He is a Manager, not an Artist.
- **The Protocol:**
    - **The Artist (Frontend Lead)** uses `drishti-vision` (Playwright) to see.
    - If the Artist rejects code based on aesthetics, **Narad accepts the failure** without seeing the image.
- **Why:** Narad trusts the expert. Delegates validation to the specialist.

## ⛑️ 4. The 3-Strike Rule (Escalation)
- **Decision:** Hard limit on failure loops.
- **The Mechanism:** If a task enters a `FAIL/RETRY` loop 3 times, Narad blocks execution and triggers a `SUDO_REQUIRED` alert.
- **Why:** Prevents agents from endlessly retrying a fundamentally broken approach.

## 🤝 5. The Intern Approval Protocol (Gated Autonomy)
- **Decision:** Interns **cannot** execute without a reviewed plan.
- **The Phases:**
    1. **Proposal:** Intern writes `PLAN.md` and notifies Lead.
    2. **Review:** Lead APPROVES or REJECTS via LLM Critique.
    3. **Human Gate:** High-impact changes (Schema, Core Refactor) require a final User "Thumbs Up" via Narad.
- **Why:** Minimizes "accidental destruction" and ensures Interns align with Lead standards.

---
*Last Updated: 2026-02-15*
