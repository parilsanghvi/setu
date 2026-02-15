#!/usr/bin/env node
const blessed = require('blessed');
const contrib = require('blessed-contrib');
const db = require('../lib/db');
const fs = require('fs');
const path = require('path');
const os = require('os'); // For CPU/Mem stats

// 1. Setup Screen
const screen = blessed.screen({
    smartCSR: true,
    title: 'Setu: God Mode'
});

// Quit on Escape, q, or C-c
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});

// 2. Setup Grid
const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

// 3. Components

// A. System Gauge (Top Left)
const statusGauge = grid.set(0, 0, 4, 4, contrib.gauge, {
    label: 'System Load',
    stroke: 'green',
    fill: 'white'
});

// B. Active Agents Table (Top Right)
const agentTable = grid.set(0, 4, 4, 8, contrib.table, {
    keys: true,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'blue',
    interactive: true,
    label: 'Active Agents',
    width: '30%',
    height: '30%',
    border: { type: "line", fg: "cyan" },
    columnSpacing: 10,
    columnWidth: [16, 12, 10, 8] /* Name, Role, Status, PID */
});

// C. Log Tail (Bottom Left)
const logBox = grid.set(4, 0, 8, 5, contrib.log, {
    fg: "green",
    selectedFg: "green",
    label: 'Kernel Logs (setu.log)',
    border: { type: "line", fg: "green" }
});

// D. Kanban Tasks (Bottom Right)
const taskList = grid.set(4, 5, 8, 7, contrib.table, {
    keys: true,
    fg: 'magenta',
    selectedFg: 'white',
    selectedBg: 'magenta',
    interactive: true,
    label: 'Task Kanban',
    border: { type: "line", fg: "magenta" },
    columnSpacing: 4,
    columnWidth: [20, 12, 12, 25] /* ID, Status, Owner, Title */
});


// 4. Data Refresh Loop

// Helper: Get CPU Usage
function getCpuUsage() {
    const cpus = os.cpus();
    let user = 0, nice = 0, sys = 0, idle = 0, irq = 0;

    for (let cpu of cpus) {
        user += cpu.times.user;
        nice += cpu.times.nice;
        sys += cpu.times.sys;
        irq += cpu.times.irq;
        idle += cpu.times.idle;
    }
    const total = user + nice + sys + idle + irq;
    return 100 - Math.round(100 * idle / total);
}

// Refresh Function
function refreshData() {
    // A. System
    const cpu = getCpuUsage();
    statusGauge.setPercent(cpu);

    // B. Agents
    try {
        const agents = db.db.prepare('SELECT name, role, status, pid FROM agents').all();
        const agentData = agents.map(a => [a.name, a.role, a.status, a.pid || '-']);
        agentTable.setData({
            headers: ['Name', 'Role', 'Status', 'PID'],
            data: agentData
        });
    } catch (e) { }

    // D. Tasks
    try {
        const tasks = db.db.prepare('SELECT id, status, owner, title FROM tasks ORDER BY updated_at DESC LIMIT 20').all();
        const taskData = tasks.map(t => [t.id, t.status, t.owner, t.title.substring(0, 25)]);
        taskList.setData({
            headers: ['ID', 'Status', 'Owner', 'Title'],
            data: taskData
        });
    } catch (e) { }

    screen.render();
}

// 5. Log Streaming
const logFile = path.join(__dirname, '../setu.log');
// Initial read of last 10 lines
if (fs.existsSync(logFile)) {
    const content = fs.readFileSync(logFile, 'utf8').split('\n');
    content.slice(-10).forEach(line => logBox.log(line));
}

// Watch for changes
fs.watchFile(logFile, (curr, prev) => {
    if (curr.mtime > prev.mtime) {
        // Read new content (simplified: just read tail)
        // A real robust tail implementation would track bytes.
        // For TUI demo, we just read last line if file is small, or last N bytes.
        const content = fs.readFileSync(logFile, 'utf8').trim().split('\n');
        const lastLine = content[content.length - 1];
        if (lastLine) logBox.log(lastLine);
        screen.render();
    }
});


// Start
setInterval(refreshData, 1000);
refreshData();
screen.render();
