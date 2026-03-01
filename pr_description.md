🎯 **What:** The code health issue addressed
Created a `BaseProvider` class and refactored `OpenAIProvider`, `AnthropicProvider`, `GoogleProvider`, and `OllamaProvider` to extend it, removing structural duplication across LLM providers.

💡 **Why:** How this improves maintainability
This reduces duplication by centralizing the `config`, `auth`, `model`, and `baseUrl` assignment into a single `BaseProvider` class. It makes adding new providers easier and ensures a consistent initialization interface across the codebase.

✅ **Verification:** How you confirmed the change is safe
Ran the full test suite (`node tests/runner.js`) and ensured no new test regressions were introduced. Added onboarding documentation (`docs/files/lib/models/providers/base.js.md`) to comply with CI 100% test coverage metric.

✨ **Result:** The improvement achieved
Cleaner, more maintainable code with a centralized provider initialization logic, avoiding repetitive assignments in each subclass and reducing potential for errors when developing future provider integrations.
