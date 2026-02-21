const assert = require('assert');
const http = require('http');
const Ollama = require('../lib/llm/Ollama');

console.log('🧪 Testing lib/llm/Ollama.js...');

// Mock setup
const originalRequest = http.request;
let mockResponse = {};
let mockRequestError = null;

let capturedRequest = {
    url: null,
    options: null,
    body: ''
};

// Mock http.request
http.request = (url, options, callback) => {
    capturedRequest.url = url;
    capturedRequest.options = options;
    capturedRequest.body = '';

    // Return a mock request object (EventEmitter)
    const req = {
        on: (event, handler) => {
            if (event === 'error' && mockRequestError) {
                setTimeout(() => handler(mockRequestError), 10);
            }
        },
        write: (data) => {
            capturedRequest.body += data;
        },
        end: () => {
            if (mockRequestError) return; // Error simulated on request

            // Create mock response object (EventEmitter)
            const res = {
                statusCode: mockResponse.statusCode || 200,
                on: (event, handler) => {
                    if (event === 'data') {
                        if (mockResponse.body) {
                            handler(mockResponse.body);
                        }
                    }
                    if (event === 'end') {
                        handler();
                    }
                }
            };

            // Execute callback with response
            if (callback) callback(res);
        }
    };
    return req;
};

async function runTests() {
    const config = { ollamaBaseUrl: 'http://localhost:11434' };
    const ollama = new Ollama(config);

    try {
        // Test 1: Happy Path (Valid JSON Response + Request Verification)
        console.log('Test 1: Happy Path (Valid JSON Response + Request Verification)');
        mockResponse = {
            statusCode: 200,
            body: JSON.stringify({ response: 'Hello World' })
        };
        mockRequestError = null;

        const result1 = await ollama.generate('System', 'User Prompt');

        // Verify Request Payload
        assert.strictEqual(capturedRequest.url.toString(), 'http://localhost:11434/api/generate', 'URL should match');
        assert.strictEqual(capturedRequest.options.method, 'POST', 'Method should be POST');
        assert.strictEqual(capturedRequest.options.headers['Content-Type'], 'application/json', 'Content-Type should be json');

        const requestBody = JSON.parse(capturedRequest.body);
        assert.strictEqual(requestBody.model, 'llama3', 'Default model should be llama3');
        assert.strictEqual(requestBody.system, 'System', 'System prompt should match');
        assert.strictEqual(requestBody.prompt, 'User Prompt', 'User prompt should match');
        assert.strictEqual(requestBody.stream, false, 'Stream should be false');

        // Verify Response
        assert.strictEqual(result1, 'Hello World', 'Should return the response field from JSON');
        console.log('✅ Passed');

        // Test 2: API Error (500)
        console.log('Test 2: API Error (500)');
        mockResponse = {
            statusCode: 500,
            body: 'Internal Server Error'
        };
        mockRequestError = null;

        try {
            await ollama.generate('System', 'User Prompt');
            assert.fail('Should have rejected');
        } catch (e) {
            assert(e.message.includes('Ollama API Error: 500'), 'Error should mention status code');
            console.log('✅ Passed');
        }

        // Test 3: Connection Error (Fallback)
        console.log('Test 3: Connection Error (Fallback)');
        mockRequestError = new Error('Connection Refused');
        mockResponse = {};

        const result3 = await ollama.generate('System', 'User Prompt');
        // Expecting mock response JSON string because getMockResponse returns a string
        const parsedMock = JSON.parse(result3);
        assert.strictEqual(parsedMock.slug, 'mock-skill-generated', 'Should return fallback mock response');
        console.log('✅ Passed');

        // Test 4: Malformed JSON
        console.log('Test 4: Malformed JSON');
        mockResponse = {
            statusCode: 200,
            body: '{ invalid json '
        };
        mockRequestError = null;

        try {
            await ollama.generate('System', 'User Prompt');
            assert.fail('Should have rejected due to JSON parse error');
        } catch (e) {
            assert(e instanceof SyntaxError, 'Should be a SyntaxError');
            console.log('✅ Passed');
        }

    } catch (e) {
        console.error('❌ Tests Failed:', e);
        process.exit(1);
    } finally {
        // Restore http.request
        http.request = originalRequest;
    }
}

runTests();
