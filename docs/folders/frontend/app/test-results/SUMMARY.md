# Test Results Directory

## Purpose
This directory stores artifacts generated during test executions, such as screenshots, diffs, and specific error contexts. When a visual regression test or functional test fails in Playwright, the relevant outputs are saved here to assist developers in identifying what specifically broke in the `frontend/app` environment during testing.

## Key Files
- `*-diff.png`: Visual differences generated during `toHaveScreenshot` failures.
- `error-context.md`: Markdown exports of specific failure states for easier review.
