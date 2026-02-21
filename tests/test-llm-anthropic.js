const assert = require('assert');
const Module = require('module');

console.log('🧪 Testing lib/llm/Anthropic.js...');

// Mock dependencies
const originalRequire = Module.prototype.require;
let mockHttpsResponse = {
    statusCode: 200,
    body: JSON.stringify({ content: [{ text: "Mock Response" }] }),
    headers: {}
};
let mockRequestError = null;
let lastRequestOptions = null;
let lastRequestBody = null;

Module.prototype.require = function(id) {
    if (id === 'https') {
        return {
            request: (url, options, callback) => {
                lastRequestOptions = options;
                let requestBody = '';

                const req = {
                    on: (event, handler) => {
                        if (event === 'error' && mockRequestError) {
                            // Simulate async error
                            setTimeout(() => handler(mockRequestError), 10);
                        }
                    },
                    write: (chunk) => {
                        requestBody += chunk;
                    },
                    end: () => {
                        lastRequestBody = requestBody;
                        if (!mockRequestError) {
                            const res = {
                                statusCode: mockHttpsResponse.statusCode,
                                headers: mockHttpsResponse.headers,
                                on: (event, handler) => {
                                    if (event === 'data') {
                                        handler(mockHttpsResponse.body);
                                    }
                                    if (event === 'end') {
                                        handler();
                                    }
                                }
                            };
                            if (callback) callback(res);
                        }
                    }
                };
                return req;
            }
        };
    }
    return originalRequire.apply(this, arguments);
};

const Anthropic = require('../lib/llm/Anthropic');

// Reset mock state before each test
function resetMocks() {
    mockHttpsResponse = {
        statusCode: 200,
        body: JSON.stringify({ content: [{ text: "Mock Response" }] }),
        headers: {}
    };
    mockRequestError = null;
    lastRequestOptions = null;
    lastRequestBody = null;
}

(async () => {
    try {
        // Test 1: Happy Path
        resetMocks();
        const provider = new Anthropic({ anthropicApiKey: 'test-key' });
        const result = await provider.generate('System Prompt', 'User Prompt');

        assert.strictEqual(result, 'Mock Response', 'Should return correct response text');
        assert.strictEqual(lastRequestOptions.headers['x-api-key'], 'test-key', 'Should include API key in headers');
        assert.strictEqual(lastRequestOptions.method, 'POST', 'Should use POST method');

        const parsedBody = JSON.parse(lastRequestBody);
        assert.strictEqual(parsedBody.model, 'claude-3-opus-20240229', 'Should use correct model');
        assert.strictEqual(parsedBody.system, 'System Prompt', 'Should include system prompt');
        assert.strictEqual(parsedBody.messages[0].content, 'User Prompt', 'Should include user prompt');

        console.log('✅ Happy Path Passed');

        // Test 2: API Error
        resetMocks();
        mockHttpsResponse = {
            statusCode: 400,
            body: 'Bad Request'
        };

        try {
            await provider.generate('Sys', 'User');
            assert.fail('Should throw error on 400 response');
        } catch (e) {
            assert(e.message.includes('Anthropic API Error: 400'), 'Error message should include status code');
        }
        console.log('✅ API Error Handling Passed');

        // Test 3: Network Error
        resetMocks();
        mockRequestError = new Error('Connection Reset');

        try {
            await provider.generate('Sys', 'User');
            assert.fail('Should throw error on network failure');
        } catch (e) {
            assert.strictEqual(e.message, 'Connection Reset', 'Should propagate network error');
        }
        console.log('✅ Network Error Handling Passed');

        // Test 4: Missing API Key (Mock Response)
        resetMocks();
        const noKeyProvider = new Anthropic({});
        // Suppress console.warn for this test
        const originalWarn = console.warn;
        console.warn = () => {};

        const mockResult = await noKeyProvider.generate('Sys', 'User');
        console.warn = originalWarn; // Restore warn

        // Depending on BaseProvider.getMockResponse implementation
        assert(typeof mockResult === 'string', 'Should return a string');
        try {
            const parsed = JSON.parse(mockResult);
            assert.strictEqual(parsed.slug, 'mock-skill-generated');
        } catch (e) {
             assert.fail('Mock response should be valid JSON for standard prompt');
        }
        console.log('✅ Missing API Key Handling Passed');

        // Test 5: Verify VETO/RISKY logic from BaseProvider via Anthropic
        resetMocks();
        const vetoResult = await noKeyProvider.generate('Sys', 'Evaluate this architectural spec');
        assert(vetoResult.startsWith('VETO:'), 'Should return VETO response');
        console.log('✅ VETO Logic Passed');

        console.log('🎉 All Anthropic Tests Passed!');

    } catch (e) {
        console.error('❌ Anthropic Test Failed:', e);
        process.exit(1);
    } finally {
        Module.prototype.require = originalRequire;
    }
})();
