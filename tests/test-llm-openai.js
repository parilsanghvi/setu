const assert = require('assert');
const Module = require('module');

console.log('🧪 Testing lib/llm/OpenAI.js...');

// Mock dependencies
const originalRequire = Module.prototype.require;
let mockHttpsResponse = {
    statusCode: 200,
    body: JSON.stringify({ choices: [{ message: { content: "Mock Response" } }] }),
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

const OpenAI = require('../lib/llm/OpenAI');

// Reset mock state before each test
function resetMocks() {
    mockHttpsResponse = {
        statusCode: 200,
        body: JSON.stringify({ choices: [{ message: { content: "Mock Response" } }] }),
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
        const provider = new OpenAI({ openaiApiKey: 'test-key' });
        const result = await provider.generate('System Prompt', 'User Prompt');

        assert.strictEqual(result, 'Mock Response', 'Should return correct response text');
        assert.strictEqual(lastRequestOptions.headers['Authorization'], 'Bearer test-key', 'Should include API key in headers');
        assert.strictEqual(lastRequestOptions.method, 'POST', 'Should use POST method');

        const parsedBody = JSON.parse(lastRequestBody);
        assert.strictEqual(parsedBody.model, 'gpt-4o', 'Should use correct model');
        assert.strictEqual(parsedBody.messages[0].role, 'system', 'Should include system role');
        assert.strictEqual(parsedBody.messages[0].content, 'System Prompt', 'Should include system prompt');
        assert.strictEqual(parsedBody.messages[1].role, 'user', 'Should include user role');
        assert.strictEqual(parsedBody.messages[1].content, 'User Prompt', 'Should include user prompt');

        console.log('✅ Happy Path Passed');

        // Test 2: API Error
        resetMocks();
        mockHttpsResponse = {
            statusCode: 400,
            body: 'Bad Request'
        };

        await assert.rejects(
            provider.generate('Sys', 'User'),
            (err) => {
                assert(err.message.includes('OpenAI API Error: 400 Bad Request'), 'Error message should include status code and body');
                return true;
            },
            'Should throw error on 400 response'
        );
        console.log('✅ API Error Handling Passed');

        // Test 3: Network Error
        resetMocks();
        mockRequestError = new Error('Connection Reset');

        await assert.rejects(
            provider.generate('Sys', 'User'),
            (err) => {
                assert.strictEqual(err.message, 'Connection Reset', 'Should propagate network error');
                return true;
            },
            'Should throw error on network failure'
        );
        console.log('✅ Network Error Handling Passed');

        // Test 4: Invalid JSON Response
        resetMocks();
        mockHttpsResponse = {
            statusCode: 200,
            body: 'Invalid JSON'
        };

        await assert.rejects(
            provider.generate('Sys', 'User'),
            SyntaxError,
            'Should propagate JSON parse error'
        );
        console.log('✅ Invalid JSON Error Handling Passed');

        // Test 5: Missing API Key (Mock Response)
        resetMocks();
        const noKeyProvider = new OpenAI({});
        // Suppress console.warn for this test
        const originalWarn = console.warn;
        console.warn = () => {};

        const mockResult = await noKeyProvider.generate('Sys', 'User');
        console.warn = originalWarn; // Restore warn

        assert(typeof mockResult === 'string', 'Should return a string');
        try {
            const parsed = JSON.parse(mockResult);
            assert.strictEqual(parsed.slug, 'mock-skill-generated');
        } catch (e) {
             assert.fail('Mock response should be valid JSON for standard prompt');
        }
        console.log('✅ Missing API Key Handling Passed');

        // Test 6: Verify VETO logic from BaseProvider via OpenAI
        resetMocks();
        const vetoResult = await noKeyProvider.generate('Sys', 'Evaluate this architectural spec');
        assert(vetoResult.startsWith('VETO:'), 'Should return VETO response');
        console.log('✅ VETO Logic Passed');

        console.log('🎉 All OpenAI Tests Passed!');

    } catch (e) {
        console.error('❌ OpenAI Test Failed:', e);
        process.exit(1);
    } finally {
        Module.prototype.require = originalRequire;
    }
})();
