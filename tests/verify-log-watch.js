const DashboardServer = require('../lib/server');
const fs = require('fs');
const path = require('path');
const { io } = require('socket.io-client');
const http = require('http');

const PORT = 3002;
const logFile = path.join(__dirname, '../setu.log');

// Ensure log file exists
if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '');
}

// Start server
console.log('Starting DashboardServer...');
const dashboard = new DashboardServer(PORT);
dashboard.start();

// Connect client
console.log(`Connecting to http://localhost:${PORT}...`);
const socket = io(`http://localhost:${PORT}`);

const testMessage = `TEST_LOG_${Date.now()}`;

socket.on('connect', () => {
    console.log('Socket connected. Appending log...');
    // Append to log file
    fs.appendFileSync(logFile, testMessage + '\n');
});

socket.on('log', (msg) => {
    // console.log('Received log:', msg); // Verbose
    if (msg.includes(testMessage)) {
        console.log('✅ Log received correctly.');
        socket.disconnect();
        dashboard.server.close();
        process.exit(0);
    }
});

// Timeout
setTimeout(() => {
    console.error('❌ Timeout waiting for log event.');
    socket.disconnect();
    dashboard.server.close();
    process.exit(1);
}, 5000);
