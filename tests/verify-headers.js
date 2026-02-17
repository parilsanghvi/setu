const { spawn } = require('child_process');
const http = require('http');

console.log('🧪 Verifying Security Headers on index.js...');

const server = spawn('node', ['index.js'], {
  stdio: 'ignore',
  detached: false
});

let failed = false;

// Give server time to start
setTimeout(() => {
  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/stats',
    method: 'HEAD'
  }, (res) => {
    console.log(`STATUS: ${res.statusCode}`);

    if (res.headers['content-security-policy']) {
      console.log('✅ Content-Security-Policy header present.');
    } else {
      console.error('❌ Content-Security-Policy header MISSING.');
      failed = true;
    }

    if (res.headers['x-frame-options']) {
      console.log('✅ X-Frame-Options header present.');
    } else {
      console.error('❌ X-Frame-Options header MISSING.');
      failed = true;
    }

    server.kill();
    process.exit(failed ? 1 : 0);
  });

  req.on('error', (e) => {
    console.error(`❌ Request failed: ${e.message}`);
    server.kill();
    process.exit(1);
  });

  req.end();
}, 5000); // Wait 5s for slow environments
