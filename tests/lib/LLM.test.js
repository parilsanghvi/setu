const Config = require('../../lib/Config');
const OpenAICompatible = require('../../lib/llm/OpenAICompatible');

// Mock dependencies
jest.mock('../../lib/Config', () => ({
    expensiveModelProvider: 'openai',
    expensiveModelName: 'gpt-4o',
    cheapModelProvider: 'ollama',
    cheapModelName: 'llama3',
    get: jest.fn()
}));

const mockGenerate = jest.fn();
jest.mock('../../lib/llm/OpenAICompatible', () => {
    return jest.fn().mockImplementation(() => ({
        generate: mockGenerate
    }));
});

describe('LLM Dual Model Factory', () => {
    let LLM;

    beforeEach(() => {
        jest.resetModules();
        mockGenerate.mockReset();
        mockGenerate.mockResolvedValue('Response');
        require('../../lib/llm/OpenAICompatible').mockClear();
    });

    test('should initialize two OpenAICompatible providers', () => {
        const OpenAICompatible = require('../../lib/llm/OpenAICompatible');
        LLM = require('../../lib/LLM');
        // Called twice: once for expensive, once for cheap
        expect(OpenAICompatible).toHaveBeenCalledTimes(2);
        expect(LLM.expensiveProvider).toBeDefined();
        expect(LLM.cheapProvider).toBeDefined();
    });

    test('generate should delegate to correct provider based on type', async () => {
        const mockGenerate = jest.fn().mockResolvedValue('Response');
        OpenAICompatible.mockImplementation(() => ({
            generate: mockGenerate
        }));

        LLM = require('../../lib/LLM');

        // Test Default (Expensive)
        await LLM.generate('sys', 'user');
        expect(mockGenerate).toHaveBeenCalledTimes(1);

        // Test Explicit Expensive
        await LLM.generate('sys', 'user', 'expensive');
        expect(mockGenerate).toHaveBeenCalledTimes(2);

        // Test Cheap
        // But since we mocked the class return, both instance variables point to instances of the *same* mock class 
        // which shares the implementation? No, jest mocks the constructor.
        // The mock implementation returns an object. Each new call returns a new object? 
        // Only if we define it that way.

        test('generate should delegate to correct provider based on type', async () => {
            // Setup separate spies for each instance
            const expensiveGenerate = jest.fn().mockResolvedValue('Expensive');
            const cheapGenerate = jest.fn().mockResolvedValue('Cheap');

            // Update mock implementation to return different spies based on call order or arguments
            // But since constructor is called synchronously, first call is expensive, second is cheap.
            const OpenAICompatible = require('../../lib/llm/OpenAICompatible');
            OpenAICompatible.mockImplementationOnce(() => ({ generate: expensiveGenerate }))
                .mockImplementationOnce(() => ({ generate: cheapGenerate }));

            // Re-init LLM
            jest.resetModules();
            LLM = require('../../lib/LLM');

            // Test Expensive
            const resExp = await LLM.generate('sys', 'user', 'expensive');
            expect(expensiveGenerate).toHaveBeenCalledWith('sys', 'user');
            expect(resExp).toBe('Expensive');

            // Test Defaults
            await LLM.generate('sys', 'user');
            expect(expensiveGenerate).toHaveBeenCalledTimes(2);

            // Test Cheap
            const resCheap = await LLM.generate('sys', 'user', 'cheap');
            expect(cheapGenerate).toHaveBeenCalledWith('sys', 'user');
            expect(resCheap).toBe('Cheap');
        });
    });
