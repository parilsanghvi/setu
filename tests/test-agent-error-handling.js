const test = require('node:test');
const assert = require('node:assert');
const Module = require('module');

// 1. Mock dependencies
const originalRequire = Module.prototype.require;
const mockBus = {
  getUnread: () => [],
  markRead: () => { },
  heartbeat: () => { },
  send: () => { }
};

Module.prototype.require = function (id) {
  if (id.endsWith('db')) {
    return mockBus;
  }
  return originalRequire.apply(this, arguments);
};

// Load Agent (it will use the mock bus)
const Agent = require('../lib/Agent');

test('Agent: handles processMessage errors gracefully', async (t) => {
  // Mock console.error to verify logging
  const originalConsoleError = console.error;
  let errors = [];
  console.error = (...args) => {
    errors.push(args.join(' '));
  };

  // Mock setInterval to control the loop
  const originalSetInterval = global.setInterval;
  let listenCallback = null;
  global.setInterval = (cb, ms) => {
    listenCallback = cb;
    return { unref: () => { } }; // dummy timer object
  };

  try {
    const agent = new Agent('TestAgent', 'Tester', '/tmp');

    // Setup message
    const testMsg = { id: 1, sender: 'User', type: 'chat', content: 'crash me' };

    // Mock bus behavior
    mockBus.getUnread = (name) => {
      if (name === 'TestAgent') return [testMsg];
      return [];
    };
    mockBus.markRead = (ids) => { };

    // Setup agent to throw
    agent.processMessage = async (msg) => {
      throw new Error('Simulated Processing Error');
    };

    // Start listening
    agent.listen();

    assert.ok(listenCallback, 'listen() should start an interval');

    // Trigger one tick
    await listenCallback();

    // Verify error was logged
    const expectedMessage = `Simulated Processing Error`;
    const found = errors.some(e => e.includes(expectedMessage) || e.includes('Error processing message'));

    assert.ok(found, `Should have logged the processing error. Logged: ${JSON.stringify(errors)}`);

  } finally {
    // Cleanup
    console.error = originalConsoleError;
    global.setInterval = originalSetInterval;
    Module.prototype.require = originalRequire;
  }
});
