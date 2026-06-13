require('dotenv').config();
const { boot, terminate } = require('./lib/system/boot');
const bus = require('./lib/db');
const readline = require('readline');

// 1.5 The Human Gate (Prompt)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

bus.on('message', (msg) => {
  // The message poller broadcasts it, and the Sutradhar process picks it up.
  if (msg.recipient === 'Sutradhar' && msg.type === 'tool_call' && msg.meta && msg.meta.tool === 'request_human_approval') {
    console.log(`🚨 HUMAN GATE TRIGGERED: ${msg.content}`);
    rl.question('[SUTRADHAR] ❓ Approve this high-impact change? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log('✅ Human approval received. Notifying Shishya...');
        bus.send('Sutradhar', msg.meta.originalSender, '✅ Human approval granted. Proceed.', 'approval', { taskId: msg.meta.taskId });
      } else {
        console.log('🛑 Human rejection. Notifying Shishya...');
        bus.send('Sutradhar', msg.meta.originalSender, '❌ Human rejected this plan. Revise strictly.', 'rejection', { taskId: msg.meta.taskId });
      }
    });
  }
});

// Boot the system
boot();

process.on('SIGINT', terminate);
process.on('SIGTERM', terminate);
