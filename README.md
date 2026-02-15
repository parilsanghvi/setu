# 🌉 Setu (सेतु)

**Setu** (Sanskrit: *Bridge*) is a modernizing agent that resurrects dead codebases. It automates the painful process of upgrading legacy stacks (e.g., Node 16 → 24, .NET 5 → 10, VB6 → .NET 9) by running iterative, LLM-powered fix loops inside isolated Docker environments.

> "Don't rewrite. Evolve."

## 🏗️ Architecture

Setu operates on four core pillars:

1.  **Drishti (The Scanner) 👁️** - *Already Sanskrit*
    *   Analyzes the codebase.
    *   Detects frameworks, versions, and deprecated patterns.
    *   Generates a `MigrationPlan.json`.

2.  **Ranabhoomi (The Sandbox) ⚔️**
    *   Spins up a Docker container representing the *target* environment (e.g., Node 24).
    *   Mounts the codebase.
    *   Attempts to build/run tests.
    *   Captures `stdout` and `stderr` (the "pain").

3.  **Sudhar (The Fixer) 🔧**
    *   Feeds build errors + source code into an LLM.
    *   Generates precise patches (code edits).
    *   Applies patches to the codebase.
    *   **Loop:** Retries until the build passes.

4.  **Pariksha (The Verifier) ✅**
    *   Runs the full test suite.
    *   Validates functional correctness.
    *   Commits changes and generates a Pull Request.

## 🚀 Usage

```bash
# Clone the repo
git clone https://github.com/parilsanghvi/Setu.git
cd Setu
npm install

# Run the bridge
node setu.js migrate ./path/to/legacy-project --target node24
```

## 🛠️ Roadmap

- [ ] **Phase 1 (MVP):** Node.js Upgrades (package.json dependency resolution).
- [ ] **Phase 2:** Syntax Updates (CommonJS -> ESM, async/await).
- [ ] **Phase 3:** Framework Shifts (Express -> Fastify, React Class -> Hooks).
- [ ] **Phase 4:** Cross-Language (VB6 -> .NET, Python 2 -> 3).

## 🧠 Philosophy

*   **Isolation First:** Never run potentially destructive migrations on the host machine. Always use Docker.
*   **Iterative Healing:** Fix one error at a time. Re-run. Verify. Repeat.
*   **Human in the Loop:** Always ask for confirmation before major destructive actions (unless `--force` is used).

---
*Built with ❤️ by Paril & Bhondu.*
