const bus = require('./lib/db');
bus.send('User', 'Sutradhar', 'ping', 'chat');
console.log('Test message sent to Sutradhar.');
process.exit(0);
