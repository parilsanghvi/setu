## 2026-03-08 - Use fast cache in hot paths
**Learning:** Calling `getOnboardingStatus()` without `{ fast: true }` in hot paths like API endpoints blocks the event loop with heavy synchronous filesystem scans.
**Action:** Use `getOnboardingStatus({ fast: true })` in Express routes and dashboard CLI tools to utilize `ONBOARDING.json` caching.
