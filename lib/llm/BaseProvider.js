class BaseProvider {
    constructor(config) {
        this.config = config;
    }

    /**
     * Generates a completion
     * @param {string} systemPrompt 
     * @param {string} userPrompt 
     * @returns {Promise<string>}
     */
    async generate(systemPrompt, userPrompt) {
        throw new Error("Method 'generate' must be implemented.");
    }

    getMockResponse(userPrompt) {
        if (userPrompt.includes('Evaluate this architectural spec') || userPrompt.includes('Evaluate this UI/Frontend spec') || userPrompt.includes('Evaluate this Database/Schema spec')) {
            return "VETO: This is a mock veto for testing purposes. API Key missing.";
        }
        if (userPrompt.includes("Review this junior engineer's plan")) {
            return "RISKY: This plan involves dropping tables. Escalating to human.";
        }
        return JSON.stringify({
            slug: "mock-skill-generated",
            description: "Mock skill response.",
            content: "# Mock Skill\n\nThis is a generated skill."
        });
    }
}

module.exports = BaseProvider;
