const Config = require('../../lib/Config');

describe('Config', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    test('should load default values', () => {
        // Mock Config load by re-requiring
        process.env.LLM_PROVIDER = '';
        process.env.OPENAI_API_KEY = '';

        // We need to reload the module to trigger the constructor logic if we were testing the singleton directly
        // But since it exports 'new Config()', it's already instantiated.
        // So we will call validate() manually to refresh values from env
        Config.validate();

        expect(Config.expensiveModelProvider).toBe('openai');
        expect(Config.cheapModelProvider).toBe('openai');
        expect(Config.logLevel).toBe('info');
    });

    test('should read from environment variables', () => {
        process.env.LLM_PROVIDER = 'anthropic';
        process.env.ANTHROPIC_API_KEY = 'sk-ant-123';
        process.env.DOCKER_PATH = '/usr/bin/docker';

        Config.validate();

        expect(Config.provider).toBe('anthropic');
        expect(Config.anthropicApiKey).toBe('sk-ant-123');
        expect(Config.dockerPath).toBe('/usr/bin/docker');
    });

    // Mock console.warn to check for validation warnings
    test('should warn if API key is missing', () => {
        process.env.LLM_PROVIDER = 'openai';
        delete process.env.OPENAI_API_KEY;

        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
        Config.validate();

        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('LLM_PROVIDER is openai but OPENAI_API_KEY is missing'));
        warnSpy.mockRestore();
    });
});
