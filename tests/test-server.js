const assert = require('assert');
const DashboardServer = require('../lib/server');
const http = require('http');

console.log('🧪 Testing lib/server.js...');

try {
    // 1. Instantiation
    const server = new DashboardServer(3999);
    assert(server.app, 'Express app should be initialized');
    assert(server.io, 'Socket.io should be initialized');
    assert.strictEqual(server.port, 3999);

    // 2. Simple Check
    // We assume setupRoutes() ran without error. 
    // Checking private _router is brittle.
    // If we want to check routes, we should use supertest in integration tests.
    // For unit verifying the class structure:
    assert(typeof server.setupRoutes === 'function');
    assert(typeof server.start === 'function');

    console.log('✅ lib/server.js Tests Passed!');
    // No need to listen() to verify structure.
    process.exit(0);
} catch (e) {
    console.error('❌ lib/server.js Failed:', e);
    process.exit(1);
}
