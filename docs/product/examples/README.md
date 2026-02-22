# Onboarding Example Library

This directory serves as a calibration reference for engineering teams and agent workers to distinguish between **compliant** and **non-compliant** onboarding artifacts.

It aligns directly with the `onboarding-contract.md` rubric.

## Evaluation Rubric Overview

When evaluating a new domain for onboarding completeness, reviewers grade the artifacts based on the following criteria:

- **1. Clarity:** The documentation is concrete. Vague descriptions like "handles stuff" or "utility functions" are flagged as non-compliant.
- **2. Accuracy:** Commands, paths, filenames, and dependency statements must be copy-paste runnable and align identically with the actual codebase.
- **3. Coverage:** All top-level active folders must contain a `SUMMARY.md`. Every modified file must maintain its corresponding file-level `docs/` mirror.
- **4. Operability:** `runbook.md` structures must detail the happy path (e.g., standard execution) and failure paths (e.g., what to do when port conflicts happen).
- **5. Maintenance:** Key artifacts like `ONBOARDING.json` list designated owners and last-updated timestamps confirming they are not stale.

## Repository Contents
- **`/good-packet`:** Simulates a perfect (100% complete) onboarding state. Use this as a template for ideal artifact generation.
- **`/bad-packet`:** Simulates a failing packet containing common anti-patterns like stale statuses, vague descriptions, and missing validation layers.
