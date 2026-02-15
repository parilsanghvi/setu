---
name: drishti-vision
description: Captures screenshots of the application and analyzes them using LLM Vision. Use when asked to "see", "look", "review UI", or "check aesthetics".
version: 1.0.0
author: Setu
---

# Drishti-Vision (The Eyes) 👁️🖼️

Drishti-Vision uses Playwright to render the application and capture high-fidelity screenshots for visual analysis.

## Capabilities

### 1. `take_screenshot`
Captures a screenshot of a given URL.
```bash
node skills/drishti-vision/scripts/capture.js --url "http://localhost:3000" --output "ui_review.png"
```

### 2. `analyze_visuals`
Sends a captured image to the LLM for aesthetic or functional analysis.
- **Trigger:** "Does this look broken?" / "Roast this UI."

## Protocol
1. **Always** ensure the dev server is running before attempting a capture.
2. **Never** share visual snapshots with external domains.
3. **Trust** the Artist Lead's interpretation of the visual data.
