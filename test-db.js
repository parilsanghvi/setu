const bus = require('./lib/db');
const messages = bus.getUnread('Sutradhar');
console.log('Unread messages for Sutradhar:', JSON.stringify(messages, null, 2));
process.exit(0);
