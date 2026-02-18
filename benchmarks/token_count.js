
const assert = require('assert');

// Current implementation
function estimateTokenCount_Original(context) {
    let totalChars = 0;
    for (const msg of context) {
        if (msg.role && typeof msg.role === 'string') totalChars += msg.role.length;
        if (msg.content) {
            totalChars += typeof msg.content === 'string' ? msg.content.length : JSON.stringify(msg.content).length;
        }
        if (msg.toolCalls) {
            for (const call of msg.toolCalls) {
                if (call.name && typeof call.name === 'string') totalChars += call.name.length;
                if (call.args) {
                    totalChars += typeof call.args === 'string' ? call.args.length : JSON.stringify(call.args).length;
                }
            }
        }
        if (msg.toolResult) {
            if (msg.toolResult.name && typeof msg.toolResult.name === 'string') totalChars += msg.toolResult.name.length;
            if (msg.toolResult.content) {
                totalChars += typeof msg.toolResult.content === 'string' ? msg.toolResult.content.length : JSON.stringify(msg.toolResult.content).length;
            }
        }
    }
    return totalChars / 4;
}

// Optimized implementation (draft)
function estimateTokenCount_Optimized(context) {
    let totalChars = 0;
    for (const msg of context) {
        if (msg.role && typeof msg.role === 'string') totalChars += msg.role.length;
        if (msg.content) {
            totalChars += typeof msg.content === 'string' ? msg.content.length : estimateJsonLength(msg.content);
        }
        if (msg.toolCalls) {
            for (const call of msg.toolCalls) {
                if (call.name && typeof call.name === 'string') totalChars += call.name.length;
                if (call.args) {
                    totalChars += typeof call.args === 'string' ? call.args.length : estimateJsonLength(call.args);
                }
            }
        }
        if (msg.toolResult) {
            if (msg.toolResult.name && typeof msg.toolResult.name === 'string') totalChars += msg.toolResult.name.length;
            if (msg.toolResult.content) {
                totalChars += typeof msg.toolResult.content === 'string' ? msg.toolResult.content.length : estimateJsonLength(msg.toolResult.content);
            }
        }
    }
    return totalChars / 4;
}

function estimateJsonLength(obj) {
    if (obj === null) return 4; // "null"
    if (obj === undefined) return 0; // undefined is skipped in JSON
    if (typeof obj === 'string') return obj.length + 2; // "string"
    if (typeof obj === 'number') return String(obj).length;
    if (typeof obj === 'boolean') return obj ? 4 : 5; // "true" or "false"

    if (Array.isArray(obj)) {
        let len = 2; // []
        if (obj.length > 0) len += obj.length - 1; // commas
        for (const item of obj) {
            len += estimateJsonLength(item);
        }
        return len;
    }

    if (typeof obj === 'object') {
        let len = 2; // {}
        const keys = Object.keys(obj);
        if (keys.length > 0) len += keys.length - 1; // commas
        for (const key of keys) {
            len += key.length + 3; // "key":
            len += estimateJsonLength(obj[key]);
        }
        return len;
    }

    return 0;
}


// Generate mock data
const context = [];
for (let i = 0; i < 1000; i++) {
    context.push({ role: 'user', content: `Message ${i}` });
    context.push({
        role: 'assistant',
        content: null,
        toolCalls: [
            {
                name: 'some_tool',
                args: {
                    param1: 'value1',
                    param2: 12345,
                    param3: { nested: true, list: [1, 2, 3] },
                    longText: 'A'.repeat(100)
                }
            }
        ]
    });
    context.push({
        role: 'user',
        toolResult: {
            name: 'some_tool',
            content: { result: 'success', data: 'B'.repeat(500) }
        }
    });
}

console.log(`Context size: ${context.length} messages`);

// Verify correctness
const original = estimateTokenCount_Original(context);
const optimized = estimateTokenCount_Optimized(context);
console.log(`Original count: ${original}`);
console.log(`Optimized count: ${optimized}`);
const diff = Math.abs(original - optimized);
const percentDiff = (diff / original) * 100;

console.log(`Difference: ${diff} (${percentDiff.toFixed(2)}%)`);

if (percentDiff > 1) { // Allow slight difference due to JSON spacing/formatting assumptions
    console.error('Optimized implementation is too different from original!');
    // process.exit(1);
    // JSON.stringify adds quotes to keys, estimateJsonLength handles that ("key":).
    // JSON.stringify handles escaping in strings. estimateJsonLength counts raw length + 2 quotes.
    // If strings contain special chars like \n, \", etc., JSON.stringify will be longer.
    // We should account for escaping if we want high precision, or accept approximation.
}

// Benchmark
const iterations = 100;

console.time('Original');
for (let i = 0; i < iterations; i++) {
    estimateTokenCount_Original(context);
}
console.timeEnd('Original');

console.time('Optimized');
for (let i = 0; i < iterations; i++) {
    estimateTokenCount_Optimized(context);
}
console.timeEnd('Optimized');
