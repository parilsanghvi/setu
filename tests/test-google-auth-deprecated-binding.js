const assert = require('assert');
const Module = require('module');
const originalRequire = Module.prototype.require;

let listenArgs = null;

// Mock http and child_process
Module.prototype.require = function(id) {
    if (id === 'http') {
        return {
            createServer: (handler) => {
                return {
                    listen: (...args) => {
                        listenArgs = args;
                        // Execute callback if present (usually last arg)
                        const cb = args[args.length - 1];
                        if (typeof cb === 'function') cb();
                    },
                    close: () => {},
                    on: () => {}
                };
            }
        };
    }
    if (id === 'child_process') {
        return {
            spawn: () => ({ unref: () => {} })
        };
    }
    return originalRequire.apply(this, arguments);
};

console.log('🧪 Verifying Google Auth Binding...');

try {
    // Force reload to ensure mock applies
    delete require.cache[require.resolve('../lib/extensions/google-auth.deprecated.js')];
    const googleAuth = require('../lib/extensions/google-auth.deprecated.js');

    // Start login flow
    // The promise will pending because we don't complete the oauth flow,
    // but we only care about server.listen being called.
    googleAuth.login().catch(() => {});

    // Check listen arguments
    console.log('Listen called with:', listenArgs);

    if (!listenArgs) {
        console.error('❌ server.listen was never called!');
        process.exit(1);
    }

    // If secure, args should include '127.0.0.1' or 'localhost' as the second argument (host)
    const port = listenArgs[0];
    const host = listenArgs[1];

    if (typeof host === 'string' && (host === '127.0.0.1' || host === 'localhost')) {
        console.log('✅ Secure binding detected.');
        process.exit(0);
    } else {
        console.error('❌ Insecure binding detected! Host argument missing or invalid.');
        // args might be [port, callback]
        console.error(`   Expected: [${port}, '127.0.0.1', callback]`);
        console.error(`   Actual:   [${listenArgs.map(a => typeof a === 'function' ? 'Function' : a).join(', ')}]`);
        process.exit(1);
    }

} catch (e) {
    console.error('Test failed with error:', e);
    process.exit(1);
} finally {
    Module.prototype.require = originalRequire;
}
