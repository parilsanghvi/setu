const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { io } = require('socket.io-client');
const Database = require('better-sqlite3');
const http = require('http');

// Setup temp env
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'setu-test-'));
fs.mkdirSync(path.join(tempDir, '.setu'), { recursive: true });
const dbPath = path.join(tempDir, '.setu', 'setu.db');
const PORT = 3101;
const SERVER_URL = `http://127.0.0.1:${PORT}`;
const DASHBOARD_PASS = 'testpass123';

console.log(`Setup: using temp HOME=${tempDir}`);

// Spawn index.js with modified HOME
const child = spawn('node', ['index.js'], {
    env: { ...process.env, PORT: PORT, HOME: tempDir, USERPROFILE: tempDir, LOG_LEVEL: 'verbose', DASHBOARD_PASS: DASHBOARD_PASS },
    cwd: process.cwd(),
    stdio: 'pipe'
});

child.stdout.on('data', d => console.log(`[SERVER] ${d}`));
child.stderr.on('data', d => console.error(`[SERVER ERR] ${d}`));

let socket;
let db;

function cleanup() {
    if (socket) socket.close();
    if (child) child.kill();
    try {
        fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {}
}

process.on('exit', cleanup);
process.on('SIGINT', cleanup);

function checkServerReady() {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const req = http.get(SERVER_URL, (res) => {
                clearInterval(interval);
                resolve();
            });
            req.on('error', () => { });
            req.end();
        }, 500);
    });
}

async function startTest() {
    console.log('Waiting for server...');
    await checkServerReady();
    console.log('Server ready. Connecting socket...');

    // Connect to DB (it should exist now)
    await new Promise(r => setTimeout(r, 1000));

    try {
        db = new Database(dbPath);
    } catch (e) {
        console.error('Failed to connect to DB:', e);
        process.exit(1);
    }

    const auth = Buffer.from(`admin:${DASHBOARD_PASS}`).toString('base64');
    socket = io(SERVER_URL, {
        transports: ['websocket'],
        forceNew: true,
        extraHeaders: {
            Authorization: `Basic ${auth}`
        }
    });

    let updatesReceived = 0;
    let lastAgents = [];

    socket.on('connect', () => {
        console.log('Socket connected.');

        // Inject a test agent
        try {
            db.prepare(`
                INSERT INTO agents (name, role, status, last_heartbeat)
                VALUES ('TestAgent', 'TestAgent', 'IDLE', ?)
            `).run(Math.floor(Date.now() / 1000));
            console.log('Injected TestAgent.');
        } catch (e) {
             console.error("DB Error:", e);
        }
    });

    socket.on('connect_error', (err) => {
        console.error(`Socket connect error: ${err.message}`);
    });

    socket.on('agents_update', (agents) => {
        updatesReceived++;
        lastAgents = agents;
        console.log(`Update received. Count: ${updatesReceived}. Agent Count: ${agents.length}`);
        if (agents.length > 0) {
            // Find TestAgent
            const ta = agents.find(a => a.name === 'TestAgent');
            if (ta) {
                console.log(`TestAgent status: ${ta.status}, heartbeat: ${ta.last_heartbeat}`);
            }
        }
    });

    // TEST SCENARIO
    setTimeout(async () => {
        console.log('Waiting for TestAgent to appear in updates...');
        let retries = 0;
        while (!lastAgents.find(a => a.name === 'TestAgent') && retries < 10) {
            await new Promise(r => setTimeout(r, 1000));
            retries++;
        }

        if (!lastAgents.find(a => a.name === 'TestAgent')) {
            console.error("TestAgent never appeared!");
            process.exit(1);
        }
        console.log('TestAgent confirmed visible.');

        // Wait a bit more to ensure stability
        await new Promise(r => setTimeout(r, 2000));

        console.log('--- STARTING HEARTBEAT TEST ---');

        const initialUpdates = updatesReceived;
        console.log(`Initial updates: ${initialUpdates}`);

        // 1. Update Heartbeat ONLY
        console.log('Updating heartbeat...');
        db.prepare('UPDATE agents SET last_heartbeat = ? WHERE name = ?')
          .run(Math.floor(Date.now() / 1000) + 100, 'TestAgent');

        // Wait for broadcast
        await new Promise(r => setTimeout(r, 4000));

        const updatesAfterHeartbeat = updatesReceived;
        const diffHeartbeat = updatesAfterHeartbeat - initialUpdates;
        console.log(`Updates after heartbeat change: ${diffHeartbeat}`);

        if (diffHeartbeat > 0) {
            console.log('❌ FAIL: Update received on heartbeat change (Optimization broken).');
        } else {
            console.log('✅ PASS: No update on heartbeat change (Optimization working).');
        }

        // 2. Update Status
        console.log('Updating status...');
        db.prepare('UPDATE agents SET status = ? WHERE name = ?')
          .run('BUSY', 'TestAgent');

        await new Promise(r => setTimeout(r, 4000));

        const updatesAfterStatus = updatesReceived;
        const diffStatus = updatesAfterStatus - updatesAfterHeartbeat;
        console.log(`Updates after status change: ${diffStatus}`);

        if (diffStatus > 0) {
            console.log('✅ PASS: Received update on status change.');
        } else {
            console.log('❌ FAIL: No update on status change!');
            process.exit(1);
        }

        if (diffHeartbeat === 0 && diffStatus > 0) {
            console.log('🎉 OPTIMIZATION VERIFIED');
            process.exit(0);
        } else {
            console.log('❌ OPTIMIZATION VERIFICATION FAILED');
            process.exit(1);
        }

    }, 2000);
}

startTest();
