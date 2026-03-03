const test = require('node:test');
const assert = require('node:assert');
const EventEmitter = require('events');
const Module = require('module');
const path = require('path');
const fs = require('fs');

const originalRequire = Module.prototype.require;

// --- Mocking ---
let lastEmitted = [];
let mockLogs = ['log1', 'log2'];
let ioMock = {
    on: (evt, handler) => {
        if (evt === 'connection') ioMock.connectionHandler = handler;
    },
    emit: (evt, data) => lastEmitted.push({ evt, data }),
    connectionHandler: null
};

class MockWatcher extends EventEmitter {
    close() { }
}
let currentWatcher = null;
let fakeStatSize = 0;

const mocks = {
    'fs': {
        ...fs,
        existsSync: () => true,
        statSync: () => ({ size: fakeStatSize }),
        stat: (file, cb) => cb(null, { size: fakeStatSize }),
        watch: (file, handler) => {
            currentWatcher = new MockWatcher();
            currentWatcher.handler = handler;
            return currentWatcher;
        },
        createReadStream: () => {
            const stream = new EventEmitter();
            setTimeout(() => stream.emit('data', 'new log chunk'), 10);
            return stream;
        }
    },
    './db': Object.assign(new EventEmitter(), {
        db: { prepare: (sql) => ({ all: () => [{ id: '1' }] }) }
    }),
    './utils': { readLastLines: async () => mockLogs }
};

Module.prototype.require = function (id) {
    if (mocks[id]) return mocks[id];
    return originalRequire.apply(this, arguments);
};

const setupSocket = require('../lib/socket');
const logger = { info: () => { }, error: () => { } };

test('Core Socket: Connection & Log Streaming', async (t) => {
    lastEmitted = [];

    // Simulate setup
    const teardown = setupSocket(ioMock, logger);

    const socketUser = {
        id: 'conn1',
        emitted: [],
        emit: (evt, data) => socketUser.emitted.push({ evt, data }),
        on: () => { }
    };

    // 1. Connection Event
    if (ioMock.connectionHandler) {
        await ioMock.connectionHandler(socketUser);

        // Should immediately get log history
        assert.strictEqual(socketUser.emitted.length, 1);
        assert.strictEqual(socketUser.emitted[0].evt, 'log_history');
        assert.deepStrictEqual(socketUser.emitted[0].data, ['log1', 'log2']);
    }

    // 2. Database events to Socket mapping
    mocks['./db'].emit('message', { type: 'chat_message', content: 'test msg' });
    const chatMsg = lastEmitted.find(e => e.evt === 'chat_message');
    assert.ok(chatMsg, 'Should forward chat_message to socket');
    assert.strictEqual(chatMsg.data.content, 'test msg');

    // 3. Log file changes via fs.watch
    if (currentWatcher) {
        fakeStatSize = 100; // simulated file grew
        currentWatcher.handler('change', 'setu.log');

        // wait for setImmediate/timeout due to streams
        await new Promise(r => setTimeout(r, 20));

        const logEvt = lastEmitted.find(e => e.evt === 'log');
        assert.ok(logEvt, 'Should emit live log chunk');
        assert.strictEqual(logEvt.data, 'new log chunk');
    }

    // Cleanup
    teardown();
});
