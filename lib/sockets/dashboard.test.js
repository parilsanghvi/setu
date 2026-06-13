const { test, describe } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const EventEmitter = require('events');
const fs = require('fs');

// We don't want to mock global require as it seems to be hanging node:test
// Instead, let's just require the real class and mock the dependencies it uses
// The only hard dependency is db and readLastLines which are required at top level
const db = require('../db');
// Monkey-patch db temporarily for tests (since it's a singleton)
const originalGetAgents = db.getAgents;
const originalGetTasks = db.getTasks;
const originalOn = db.on;

const DashboardSocket = require('./dashboard');

test('DashboardSocket initializes correctly', (t) => {
    const io = {};
    const logger = {};
    const socket = new DashboardSocket(io, logger);

    assert.strictEqual(socket.io, io);
    assert.strictEqual(socket.logger, logger);
    assert.deepStrictEqual(socket.watchTimeouts, []);
    assert.strictEqual(socket.watcher, null);
    assert.strictEqual(socket.pollInterval, null);
});

test('DashboardSocket registers connection event and polls DB', (t) => {
    // Setup db mocks
    const busListeners = {};
    db.on = (event, cb) => { busListeners[event] = cb; };
    db.getAgents = () => [{ id: 'agent1' }];
    db.getTasks = () => [{ id: 'task1' }];

    const events = {};
    let emitted = [];

    const io = {
        on: (event, cb) => { events[event] = cb; },
        emit: (event, data) => { emitted.push({ event, data }); }
    };

    const logger = {
        info: () => {},
        error: () => {}
    };

    const socket = new DashboardSocket(io, logger);

    // Stub fs methods temporarily to avoid file system side effects
    const originalExistsSync = fs.existsSync;
    fs.existsSync = () => false; // force setTimeout path so it doesn't watch files

    socket.setup();

    assert.ok(events['connection'], 'Should register connection event on io');
    assert.notStrictEqual(socket.pollInterval, null, 'Should set up DB polling interval');
    assert.ok(socket.watchTimeouts.length > 0, 'Should queue a watch timeout when file is missing');

    // Test bus forwarding
    emitted = []; // Reset
    if (busListeners['message']) {
        busListeners['message']({ type: 'chat_message', content: 'hello' });
        assert.strictEqual(emitted.length, 1);
        assert.strictEqual(emitted[0].event, 'chat_message');
        assert.deepStrictEqual(emitted[0].data, { type: 'chat_message', content: 'hello' });
    }

    socket.stop();
    fs.existsSync = originalExistsSync;

    // Restore db mocks
    db.on = originalOn;
    db.getAgents = originalGetAgents;
    db.getTasks = originalGetTasks;
});

test('DashboardSocket stop cleans up resources', (t) => {
    const socket = new DashboardSocket({}, {});

    let watcherClosed = false;
    socket.watcher = { close: () => { watcherClosed = true; } };

    socket.pollInterval = setInterval(() => {}, 100);
    socket.watchTimeouts = [setTimeout(() => {}, 100)];

    socket.stop();

    assert.ok(watcherClosed, 'Watcher should be closed');
});
