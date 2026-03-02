---
title: BaseProvider
description: "Base class for LLM providers"
---

# `lib/models/providers/base.js`

## Purpose
This file contains the `BaseProvider` class, which serves as the base class for all LLM provider integrations (e.g., OpenAI, Anthropic, Google, Ollama). It standardizes the configuration initialization.

## Exports
- `BaseProvider`: The base class containing common properties (`config`, `auth`, `model`, `baseUrl`) and a stub `generate` method.

## Dependencies
- None.

## Important Notes
- Subclasses must implement the `generate(systemPrompt, userPrompt, tools, options)` method, otherwise an error will be thrown.
- It streamlines the constructor logic for provider subclasses.
