const BaseProvider = require('./base');

class OllamaProvider extends BaseProvider {
    constructor(config) {
        super(config);
        this.baseUrl = this.baseUrl || 'http://localhost:11434';
    }

    async generate(systemPrompt, userPrompt, tools = null, options = {}) {
        // Ollama native API: /api/generate or /api/chat
        // Let's use /api/chat which is more standard
        const url = `${this.baseUrl}/api/chat`;

        let messages;
        if (Array.isArray(userPrompt)) {
            messages = [
                { role: 'system', content: systemPrompt },
                ...userPrompt
            ];
        } else {
            messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ];
        }

        const body = {
            model: this.model,
            messages,
            stream: true,
            options: typeof options === 'object' ? options : {}
        };

        // Add Tools (Ollama supports OpenAI-compatible 'tools')
        if (tools && tools.length > 0) {
            body.tools = tools.map(t => ({
                type: 'function',
                function: {
                    name: t.name,
                    description: t.description,
                    parameters: t.parameters
                }
            }));
        }

        // Thinking? Ollama supports some reasoning models via DeepSeek R1, but param is likely model-specific
        // or just part of the output content (<think>...</think>).
        // No explicit API param for "thinking budget" yet in standard Ollama.

        // 1. Create an AbortController for timeouts (e.g. 60 minutes for slow thinking models)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3600000); // 3600s timeout

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: controller.signal // 2. Attach the signal
            });

            if (!res.ok) {
                clearTimeout(timeoutId);
                const txt = await res.text();
                throw new Error(`Ollama API Error: ${res.status} ${txt}`);
            }

            let thinkingContent = "";
            let messageContent = "";
            let toolCalls = [];
            let buffer = "";
            const decoder = new TextDecoder();

            // Node fetch stream reading
            for await (const chunk of res.body) {
                // reset idle timeout each time we receive a chunk
                clearTimeout(timeoutId);

                const chunkStr = decoder.decode(chunk, { stream: true });

                buffer += chunkStr;
                const lines = buffer.split('\n');
                // The last element is either an empty string (if line ended with \n)
                // or a partial line. Save it for the next chunk.
                buffer = lines.pop();

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const data = JSON.parse(line);

                        // Capture text content
                        if (data.message) {
                            if (data.message.thinking) {
                                thinkingContent += data.message.thinking;
                            }
                            if (data.message.content) {
                                messageContent += data.message.content;
                            }

                            // Capture tool calls if defined
                            if (data.message.tool_calls) {
                                toolCalls = data.message.tool_calls;
                            }
                        }

                    } catch (e) {
                        // ignore malformed lines
                    }
                }
            }

            // Process any remaining content in buffer
            if (buffer.trim()) {
                try {
                    const data = JSON.parse(buffer);
                    if (data.message) {
                        if (data.message.thinking) thinkingContent += data.message.thinking;
                        if (data.message.content) messageContent += data.message.content;
                        if (data.message.tool_calls) toolCalls = data.message.tool_calls;
                    }
                } catch (e) { }
            }

            clearTimeout(timeoutId); // 3. Clear timeout on success

            // Clean up thinking outputs
            // We combine thinking and message content to apply cleaning regexes
            let textOutput = (thinkingContent ? `<think>${thinkingContent}</think>\n` : "") + messageContent;
            textOutput = textOutput.replace(/<think>[\s\S]*?<\/think>/gi, '');
            textOutput = textOutput.replace(/Thinking Process:[\s\S]*?\.\.\.done thinking\./gi, '');
            textOutput = textOutput.trim();

            // Handle Tool Calls
            if (toolCalls && toolCalls.length > 0) {
                return {
                    content: textOutput,
                    toolCalls: toolCalls.map(tc => ({
                        id: 'call_' + Math.random().toString(36).substr(2, 9),
                        name: tc.function.name,
                        args: tc.function.arguments
                    }))
                };
            }

            return textOutput;
        } catch (e) {
            clearTimeout(timeoutId); // Ensure timeout is cleared on failure
            console.error(`[OllamaProvider] Request failed: ${e.message}`);

            // Handle timeout specifically
            if (e.name === 'AbortError') {
                throw new Error('Ollama generation timed out after 60 minutes.');
            }
            // Check if Ollama is running
            if (e.message.includes('ECONNREFUSED')) {
                throw new Error('Ollama is not running on localhost:11434');
            }
            throw e;
        }
    }

    // Discovery capability (used by CLI list)
    static async listModels(baseUrl = 'http://localhost:11434') {
        try {
            const res = await fetch(`${baseUrl}/api/tags`);
            if (!res.ok) return [];
            const json = await res.json();
            return json.models.map(m => m.name);
        } catch {
            return [];
        }
    }
}

module.exports = OllamaProvider;
