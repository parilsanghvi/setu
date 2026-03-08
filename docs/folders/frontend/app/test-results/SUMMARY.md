---
title: "Test Results Directory Summary"
description: "Documentation for the frontend/app/test-results folder."
---

## Purpose
This directory stores the generated execution results and artifacts (e.g., screenshots, video recordings, and state dumps) of the Playwright e2e tests. These artifacts are primarily used by Playwright for generating its final reports and allow developers to review test behaviors step-by-step or during failures. They are heavily utilized in the Continuous Integration (CI) environment to trace flaky tests and regressions.

## Key Files
- `test-results/`: Various folders created per test case execution. Each test has an individual directory named after its descriptor and context string to distinguish parallel runs.
