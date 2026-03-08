---
title: "Playwright Report Directory Summary"
description: "Documentation for the frontend/app/playwright-report folder."
---

## Purpose
This directory stores the generated Playwright end-to-end (e2e) test reports. Whenever the frontend test suite runs via Playwright, this folder holds the artifacts, such as the HTML report pages, screenshots of failed tests, and execution traces. This helps developers easily inspect test results locally or within a CI environment.

## Key Files
- `index.html`: The main entry point for the Playwright test report.
- `data/`: Folder containing test execution trace and network data.
