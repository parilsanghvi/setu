const fs = require('fs');
const path = require('path');

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// High-performance write stream for logging (Initialized early to avoid TDZ)
const logStream = fs.createWriteStream(path.join(__dirname, '../../setu.log'), { flags: 'a' });
logStream.on('error', (err) => console.error('LOG STREAM ERROR:', err));

// Global io instance reference
let globalIo = null;

function setIo(ioInstance) {
    globalIo = ioInstance;
}

// Broadcast logs to connected clients & write to file
function log(msg, level = 'info') {
  if (LOG_LEVEL === 'silent') return;
  if (LOG_LEVEL === 'error' && level !== 'error') return;

  const logMsg = `[SUTRADHAR] ${msg}`;

  // Write to setu.log (primary log destination)
  logStream.write(logMsg + '\n');

  // Broadcast to dashboard via socket
  if (globalIo) {
      globalIo.emit('log', logMsg);
  }
}

function debug(msg) {
  if (LOG_LEVEL === 'debug' || LOG_LEVEL === 'verbose') {
    log(`[DEBUG] ${msg}`, 'debug');
  }
}

module.exports = {
    log,
    debug,
    logStream,
    setIo,
    LOG_LEVEL
};
