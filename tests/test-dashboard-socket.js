const io = require('socket.io-client');
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const PORT = 3001; // Avoid strict conflict with 3000

// 1. Start the Dashboard Server
const serverScript = path.join(__dirname, '../lib/server.js');
const env = { ...process.env, DASHBOARD_PASS: 'testpass', PORT: PORT };
const dashboard = spawn('node', [serverScript], { stdio: 'inherit', env });


console.log('🚀 Starting Dashboard Server...');

// Give it time to boot
setTimeout(() => {
    // 2. Connect Client
    const socket = io(`http://localhost:${PORT}`, {
        extraHeaders: {
            Authorization: 'Basic ' + Buffer.from('admin:testpass').toString('base64')
        }
    });

    let chatReceived = false;
    let agentsReceived = false;

    socket.on('connect', () => {
        console.log('✅ Socket Connected');

        // 3. Trigger Chat via API
        const postData = JSON.stringify({
            agent: 'TestAgent',
            message: 'Hello World'
        });

        const req = http.request({
            hostname: 'localhost',
            port: PORT,
            path: '/api/chat',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length,
                'Authorization': 'Basic ' + Buffer.from('admin:testpass').toString('base64'),
                'Connection': 'close'
            }
        }, (res) => {
            console.log(`✅ API Response: ${res.statusCode}`);
        });

        req.write(postData);
        req.end();
    });

    socket.on('chat_message', (msg) => {
        if (msg.content === 'Hello World' && msg.recipient === 'TestAgent') {
            console.log('✅ Chat Message Received via Socket!');
            chatReceived = true;
            checkDone();
        }
    });

    socket.on('agents_update', (data) => {
        console.log(`✅ Agents Update Received: ${data.length} agents`);
        agentsReceived = true;
        checkDone();
    });

    function checkDone() {
        if (chatReceived && agentsReceived) {
            console.log('🎉 Verification Successful!');
            socket.disconnect();
            dashboard.kill();
            process.exit(0);
        }
    }

    // Timeout safety
    setTimeout(() => {
        console.error('❌ Timeout waiting for events');
        dashboard.kill();
        process.exit(1);
    }, 5000);

}, 2000);
