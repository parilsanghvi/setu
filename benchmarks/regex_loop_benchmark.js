const { performance } = require('perf_hooks');

const NAME = "TestAgent";
const LINES_PER_CHUNK = 100;
const CHUNK_COUNT = 10000; // Increased to get more significant numbers

const lines = [];
for (let i = 0; i < LINES_PER_CHUNK; i++) {
  if (i % 2 === 0) {
    lines.push(`[${NAME}] Log message ${i}`);
  } else {
    lines.push(`Other log message ${i}`);
  }
}

function runInsideLoop() {
  const start = performance.now();
  for (let i = 0; i < CHUNK_COUNT; i++) {
    lines.forEach(l => {
      const cleanLine = l.replace(new RegExp(`^\\[${NAME}\\]\\s*`), '');
    });
  }
  const end = performance.now();
  return end - start;
}

function runOutsideLoop() {
  const start = performance.now();
  const regex = new RegExp(`^\\[${NAME}\\]\\s*`);
  for (let i = 0; i < CHUNK_COUNT; i++) {
    lines.forEach(l => {
      const cleanLine = l.replace(regex, '');
    });
  }
  const end = performance.now();
  return end - start;
}

console.log(`Running benchmark with ${CHUNK_COUNT} chunks of ${LINES_PER_CHUNK} lines each.`);

// Warmup
runInsideLoop();
runOutsideLoop();

const timeInside = runInsideLoop();
console.log(`Inside Loop: ${timeInside.toFixed(3)}ms`);

const timeOutside = runOutsideLoop();
console.log(`Outside Loop: ${timeOutside.toFixed(3)}ms`);

const improvement = ((timeInside - timeOutside) / timeInside) * 100;
console.log(`Improvement: ${improvement.toFixed(2)}%`);
