const assert = require('assert');
const http = require('http');
const https = require('https');
const OpenAICompatible = require('../lib/llm/OpenAICompatible');

console.log('🧪 Testing lib/llm/OpenAICompatible.js...');

let capturedRequest = {};
let mockResponse = {};
let mockRequestError = null;

function createMockRequest(url, options, callback) {
    capturedRequest = {
        url: url.toString(),
        options,
        body: ''
    };

    return {
        on: (event, handler) => {
            if (event === 'error' && mockRequestError) {
                setTimeout(() => handler(mockRequestError), 10);
            }
        },
        write: (data) => {
            capturedRequest.body += data;
        },
        end: () => {
            if (mockRequestError) return;
            const res = {
                statusCode: mockResponse.statusCode || 200,
                on: (event, handler) => {
                    if (event === 'data' && mockResponse.body) {
                        handler(mockResponse.body);
                    }
                    if (event === 'end') {
                        handler();
                    }
                }
            };
            if (callback) callback(res);
        }
    };
}

const originalHttpRequest = http.request;
const originalHttpsRequest = https.request;
http.request = createMockRequest;
https.request = createMockRequest;

async function runTests() {
    try {
        // Test 1: Expensive Config Init and Default Base URL
        const config1 = {
            expensiveModelProvider: 'openai',
            expensiveModelApiKey: 'test-api-key',
            expensiveModelName: 'gpt-4o'
        };
        const provider1 = new OpenAICompatible(config1, 'expensive');
        assert.strictEqual(provider1.baseUrl, 'https://api.openai.com/v1');
        assert.strictEqual(provider1.model, 'gpt-4o');
        assert.strictEqual(provider1.apiKey, 'test-api-key');
        console.log('✅ Expensive Config Init Passed');

        // Test 2: Cheap Config Init and Custom Base URL Normalization
        const config2 = {
            cheapModelProvider: 'vllm',
            cheapModelApiKey: 'vllm-key',
            cheapModelName: 'llama-vllm',
            cheapModelBaseUrl: 'http://localhost:8000/' // trailing slash
        };
        const provider2 = new OpenAICompatible(config2, 'cheap');
        assert.strictEqual(provider2.baseUrl, 'http://localhost:8000/v1', 'Should append /v1 for vllm if missing');
        console.log('✅ Cheap Config & URL Normalization Passed');

        // Test 3: Generate - Happy Path
        mockResponse = {
            statusCode: 200,
            body: JSON.stringify({
                choices: [{ message: { content: 'Mocked Content' } }]
            })
        };
        mockRequestError = null;

        const result3 = await provider1.generate('Sys', 'User');
        assert.strictEqual(result3, 'Mocked Content');
        assert.strictEqual(capturedRequest.url, 'https://api.openai.com/v1/chat/completions');
        assert.strictEqual(capturedRequest.options.method, 'POST');
        assert.strictEqual(capturedRequest.options.headers['Authorization'], 'Bearer test-api-key');

        const body = JSON.parse(capturedRequest.body);
        assert.strictEqual(body.model, 'gpt-4o');
        assert.strictEqual(body.messages[0].role, 'system');
        assert.strictEqual(body.messages[1].content, 'User');
        console.log('✅ Generate Happy Path Passed');

        // Test 4: Generate - API Error
        mockResponse = {
            statusCode: 400,
            body: 'Bad Request Data'
        };
        mockRequestError = null;
        try {
            await provider1.generate('Sys', 'User');
            assert.fail('Should have rejected');
        } catch (e) {
            assert(e.message.includes('API Request Failed: 400 Bad Request Data'));
            console.log('✅ Generate API Error Passed');
        }

        // Test 5: Generate - Network Error
        mockRequestError = new Error('ECONNREFUSED');
        mockResponse = {};
        try {
            await provider1.generate('Sys', 'User');
            assert.fail('Should have rejected');
        } catch (e) {
            assert.strictEqual(e.message, 'ECONNREFUSED');
            console.log('✅ Generate Network Error Passed');
        }

        // Test 6: Discovery (Static Method)
        mockResponse = {
            statusCode: 200,
            body: JSON.stringify({
                data: [{ id: 'model-1' }, { id: 'model-2' }]
            })
        };
        mockRequestError = null;
        const models = await OpenAICompatible.fetchModels('http://localhost:11434', 'test-key');
        assert.deepStrictEqual(models, ['model-1', 'model-2']);
        assert.strictEqual(capturedRequest.url, 'http://localhost:11434/v1/models', 'Discovery URL should be normalized');
        assert.strictEqual(capturedRequest.options.headers['Authorization'], 'Bearer test-key');
        console.log('✅ Discovery (fetchModels) Passed');

        // Test 7: Discovery - Fallback to Empty Array
        mockResponse = {
            statusCode: 200,
            body: JSON.stringify({
                error: 'No models found'
            })
        };
        mockRequestError = null;
        const models2 = await OpenAICompatible.fetchModels('http://localhost:11434', 'test-key');
        assert.deepStrictEqual(models2, []);
        console.log('✅ Discovery Fallback to Empty Array Passed');

        // Test 8: Discovery - Malformed JSON
        mockResponse = {
            statusCode: 200,
            body: 'invalid json'
        };
        mockRequestError = null;
        const models3 = await OpenAICompatible.fetchModels('http://localhost:11434', 'test-key');
        assert.deepStrictEqual(models3, []);
        console.log('✅ Discovery Handling Malformed JSON Passed');

        // Test 9: Discovery - Request Error
        mockRequestError = new Error('ECONNREFUSED');
        mockResponse = {};
        const models4 = await OpenAICompatible.fetchModels('http://localhost:11434', 'test-key');
        assert.deepStrictEqual(models4, []);
        console.log('✅ Discovery Handling Request Error Passed');

        // Test 10: Missing Base URL (Fallback to Mock Response)
        const config3 = {
            expensiveModelProvider: 'custom',
            expensiveModelName: 'custom-model'
        };
        const provider3 = new OpenAICompatible(config3, 'expensive');
        // Suppress warning
        const originalWarn = console.warn;
        console.warn = () => {};
        const result10 = await provider3.generate('Sys', 'User Prompt');
        console.warn = originalWarn; // Restore warn

        const parsedMock = JSON.parse(result10);
        assert.strictEqual(parsedMock.slug, 'mock-skill-generated', 'Should return fallback mock response');
        console.log('✅ Missing Base URL Fallback Passed');

        // Test 11: Deepseek Init and API Request
        const config4 = {
            expensiveModelProvider: 'deepseek',
            expensiveModelApiKey: 'deepseek-key',
            expensiveModelName: 'deepseek-chat'
        };
        const provider4 = new OpenAICompatible(config4, 'expensive');
        assert.strictEqual(provider4.baseUrl, 'https://api.deepseek.com/v1');
        assert.strictEqual(provider4.model, 'deepseek-chat');
        assert.strictEqual(provider4.apiKey, 'deepseek-key');

        mockResponse = {
            statusCode: 200,
            body: JSON.stringify({
                choices: [{ message: { content: 'Deepseek Answer' } }]
            })
        };
        mockRequestError = null;
        const result11 = await provider4.generate('Sys', 'User');
        assert.strictEqual(result11, 'Deepseek Answer');
        assert.strictEqual(capturedRequest.url, 'https://api.deepseek.com/v1/chat/completions');
        console.log('✅ Deepseek Init and Generate Passed');

        // Test 12: Discovery - null baseUrl
        const models5 = await OpenAICompatible.fetchModels(null, 'test-key');
        assert.deepStrictEqual(models5, []);
        console.log('✅ Discovery null baseUrl Passed');

        // Test 13: Discovery - normalize api.openai.com
        mockResponse = {
            statusCode: 200,
            body: JSON.stringify({
                data: [{ id: 'model-1' }]
            })
        };
        mockRequestError = null;
        await OpenAICompatible.fetchModels('https://api.openai.com', 'test-key');
        assert.strictEqual(capturedRequest.url, 'https://api.openai.com/models'); // it doesn't append /v1 if api.openai.com is in it
        console.log('✅ Discovery normalize api.openai.com Passed');

        // Test 14: URL without /v1 not vllm/ollama
        const config5 = {
            cheapModelProvider: 'other',
            cheapModelApiKey: 'key',
            cheapModelName: 'model',
            cheapModelBaseUrl: 'http://localhost:1234/'
        };
        const provider5 = new OpenAICompatible(config5, 'cheap');
        assert.strictEqual(provider5.baseUrl, 'http://localhost:1234');
        console.log('✅ Other URL trailing slash strip Passed');

        // Test 15: Generate - Malformed JSON Response
        mockResponse = {
            statusCode: 200,
            body: 'invalid json'
        };
        mockRequestError = null;
        try {
            await provider1.generate('Sys', 'User');
            assert.fail('Should have rejected');
        } catch (e) {
            assert(e instanceof SyntaxError);
            console.log('✅ Generate Malformed JSON Response Passed');
        }

        console.log('🎉 All OpenAICompatible Tests Passed!');
    } catch (e) {
        console.error('❌ Test Failed:', e);
        process.exit(1);
    } finally {
        http.request = originalHttpRequest;
        https.request = originalHttpsRequest;
    }
}

runTests();
