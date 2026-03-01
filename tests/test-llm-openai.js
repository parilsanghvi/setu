const assert = require('assert');

// Keep original fetch
const originalFetch = global.fetch;

// Variables to capture fetch calls
let lastFetchUrl = null;
let lastFetchOptions = null;
let mockResponse = null;

// Mock global fetch
global.fetch = async (url, options) => {
    lastFetchUrl = url;
    lastFetchOptions = options;

    if (mockResponse instanceof Error) {
        throw mockResponse;
    }

    return {
        ok: mockResponse.ok,
        status: mockResponse.status,
        text: async () => mockResponse.text,
        json: async () => mockResponse.json,
    };
};

const OpenAIProvider = require('../lib/models/providers/openai');

function resetMocks() {
    lastFetchUrl = null;
    lastFetchOptions = null;
    mockResponse = null;
}

console.log('🧪 Testing lib/models/providers/openai.js...');

(async () => {
    try {
        // Test 1: Standard Generation (No Tool Calls)
        console.log('Test 1: Standard Generation');
        resetMocks();
        mockResponse = {
            ok: true,
            status: 200,
            json: {
                choices: [{
                    finish_reason: 'stop',
                    message: {
                        role: 'assistant',
                        content: 'Standard mock response'
                    }
                }]
            }
        };

        const provider1 = new OpenAIProvider({
            model: 'gpt-4o',
            auth: { key: 'test-key-123' },
            baseUrl: 'https://custom-openai.com/v1'
        });

        const result1 = await provider1.generate('You are an AI', 'Hello');

        assert.strictEqual(lastFetchUrl, 'https://custom-openai.com/v1/chat/completions');
        assert.strictEqual(lastFetchOptions.method, 'POST');
        assert.strictEqual(lastFetchOptions.headers['Authorization'], 'Bearer test-key-123');

        const body1 = JSON.parse(lastFetchOptions.body);
        assert.strictEqual(body1.model, 'gpt-4o');
        assert.strictEqual(body1.messages[0].role, 'system');
        assert.strictEqual(body1.messages[0].content, 'You are an AI');
        assert.strictEqual(body1.messages[1].role, 'user');
        assert.strictEqual(body1.messages[1].content, 'Hello');
        assert.strictEqual(result1, 'Standard mock response');
        console.log('✅ Standard Generation Passed');

        // Test 2: Tool Call Handling
        console.log('Test 2: Tool Call Handling');
        resetMocks();
        mockResponse = {
            ok: true,
            status: 200,
            json: {
                choices: [{
                    finish_reason: 'tool_calls',
                    message: {
                        role: 'assistant',
                        content: '',
                        tool_calls: [
                            {
                                id: 'call_abc123',
                                type: 'function',
                                function: {
                                    name: 'get_weather',
                                    arguments: '{"location":"San Francisco"}'
                                }
                            }
                        ]
                    }
                }]
            }
        };

        const provider2 = new OpenAIProvider({
            model: 'gpt-4',
            auth: { key: 'test-key' }
        });

        const tools = [{
            name: 'get_weather',
            description: 'Get current weather',
            parameters: { type: 'object', properties: { location: { type: 'string' } } }
        }];

        const result2 = await provider2.generate('Sys', 'What is the weather?', tools, { reasoning_effort: 'high' });

        const body2 = JSON.parse(lastFetchOptions.body);
        assert(body2.tools.length === 1);
        assert.strictEqual(body2.tools[0].function.name, 'get_weather');
        assert.strictEqual(body2.reasoning_effort, 'high');

        // Assert returned object structure matches expected
        assert.strictEqual(typeof result2, 'object');
        assert.strictEqual(result2.content, '');
        assert(Array.isArray(result2.toolCalls));
        assert.strictEqual(result2.toolCalls.length, 1);
        assert.strictEqual(result2.toolCalls[0].id, 'call_abc123');
        assert.strictEqual(result2.toolCalls[0].name, 'get_weather');
        assert.deepStrictEqual(result2.toolCalls[0].args, { location: 'San Francisco' });
        console.log('✅ Tool Call Handling Passed');

        // Test 3: API Error Handling
        console.log('Test 3: API Error Handling');
        resetMocks();
        mockResponse = {
            ok: false,
            status: 400,
            text: 'Bad Request: Invalid model'
        };

        try {
            await provider2.generate('Sys', 'User');
            assert.fail('Should have thrown an error on 400 response');
        } catch (e) {
            assert(e.message.includes('OpenAI API Error: 400 Bad Request: Invalid model'), 'Error message should include status code and text');
        }
        console.log('✅ API Error Handling Passed');

        // Test 4: Network Error Handling
        console.log('Test 4: Network Error Handling');
        resetMocks();
        mockResponse = new Error('fetch failed');

        try {
            await provider2.generate('Sys', 'User');
            assert.fail('Should have thrown network error');
        } catch (e) {
            assert.strictEqual(e.message, 'fetch failed');
        }
        console.log('✅ Network Error Handling Passed');

        console.log('🎉 All OpenAIProvider Tests Passed!');
    } catch (e) {
        console.error('❌ Test Failed:', e);
        throw e;
    } finally {
        // Restore global fetch
        global.fetch = originalFetch;
    }
})();
