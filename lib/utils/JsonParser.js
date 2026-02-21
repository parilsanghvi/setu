/**
 * Utility for parsing JSON from potentially messy LLM outputs.
 */
class JsonParser {
    /**
     * Attempts to parse a string as JSON, handling common LLM formatting issues.
     * Strategies:
     * 1. Direct JSON.parse
     * 2. Markdown code block extraction (```json ... ```)
     * 3. Substring extraction (first { to last })
     *
     * @param {string} text - The text to parse
     * @returns {Object|null} The parsed object or null if failed
     */
    static parse(text) {
        if (!text || typeof text !== 'string') return null;

        const cleanText = text.trim();

        // 1. Try raw JSON
        try {
            return JSON.parse(cleanText);
        } catch (e) {
            // Ignore error, try next method
        }

        // 2. Try Markdown block regex
        // Matches ```json, ```JSON, or just ```
        const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/gi;
        const matches = cleanText.matchAll(jsonBlockRegex);
        for (const match of matches) {
            try {
                return JSON.parse(match[1].trim());
            } catch (e) {
                // Ignore error, try next match
            }
        }

        // 3. Fallback: search for first { and last }
        const firstBrace = cleanText.indexOf('{');
        const lastBrace = cleanText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            try {
                const potentialJson = cleanText.substring(firstBrace, lastBrace + 1);
                return JSON.parse(potentialJson.trim());
            } catch (e) {
                // Ignore error, final attempt failed
            }
        }

        // Return null if all attempts fail
        return null;
    }
}

module.exports = JsonParser;
