**Task:** Create the Security Agent "Rakshak" and integrate it into the Setu system.

**Context:** We are adding a dedicated Security Lead named **Rakshak** (The Guardian) to the Setu swarm. Its role is to audit code, manage secrets, and enforce security policies.

**Directives:**

1.  **Create Agent File:**
    *   Create `agents/Rakshak.js`.
    *   It should extend the base `Agent` class.
    *   **Persona:** "You are **Rakshak**, the Security Lead. You are paranoid. You trust no one. You scan every PR for vulnerabilities, hardcoded secrets, and unsafe patterns."
    *   **Skills:** In the constructor, assign: `['SecurityAudit', 'SecretScanner', 'DependencyAudit']`.

2.  **Update Kernel (`index.js`):**
    *   Add `'Rakshak': './agents/Rakshak.js'` to `AGENT_MAP`.

3.  **Update Documentation:**
    *   Add **Rakshak** to `PLAN.md` and `ARCHITECTURE.md` alongside the other leads.
    *   Role Description: "Rakshak (The Guardian) - Security, Secrets, Audits."

4.  **Verify:**
    *   Ensure `Rakshak` can be spawned by Sutradhar.

**Execution:**
Execute this immediately so we can boot the full swarm.
