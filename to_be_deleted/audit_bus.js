const bus = require('./lib/db');
const EventEmitter = require('events');

console.log('--- BUS AUDIT ---');

// Test 1: Local Event Propagation
let eventTriggered = false;
bus.on('test_event', () => {
    eventTriggered = true;
    console.log('✅ Local bus event propagation OK');
});
bus.emit('test_event');

if (!eventTriggered) {
    console.error('❌ Local bus event propagation FAILED');
}

// Test 2: Message Event
let messageSeen = false;
bus.on('message', (msg) => {
    if (msg.content === 'ALIVE_CHECK') {
        messageSeen = true;
        console.log('✅ bus.send triggered "message" event');
    }
});

bus.send('Test', 'Tark', 'ALIVE_CHECK');

setTimeout(() => {
    if (!messageSeen) {
        console.error('❌ bus.send FAILED to trigger "message" event');
    }
    process.exit(messageSeen ? 0 : 1);
}, 1000);
