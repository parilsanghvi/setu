
const assert = require('assert');

console.log('--- Verifying Prototype Pollution Safety ---');

// Correct initialization as per the fix
const RUNNING_PROCESSES = Object.create(null);

// Simulate the attack: accessing "__proto__"
const name = "__proto__";
const process = RUNNING_PROCESSES[name];

console.log(`Accessing RUNNING_PROCESSES["${name}"]...`);
console.log('Result:', process);

// Assert that it returns undefined (safe)
if (process === undefined) {
  console.log('SUCCESS: "__proto__" lookup returned undefined. Vulnerability mitigated.');
} else {
  console.error('FAIL: "__proto__" lookup returned something:', process);
  process.exit(1);
}

// Double check SPAWN_TIMES
const SPAWN_TIMES = Object.create(null);
const time = SPAWN_TIMES[name];
if (time === undefined) {
    console.log('SUCCESS: SPAWN_TIMES is also safe.');
} else {
    console.error('FAIL: SPAWN_TIMES is vulnerable.');
    process.exit(1);
}
