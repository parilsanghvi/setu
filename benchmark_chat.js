const logs = [];
for (let i = 0; i < 500; i++) {
    if (i % 3 === 0) {
        logs.push({ id: i, content: `[CHAT] Agent${i%5} -> User: Message ${i} is quite long and has a lot of text here.` });
    } else if (i % 3 === 1) {
        logs.push({ id: i, content: `[THOUGHT_START] Agent${i%5} -> User: Thinking about task ${i}...` });
    } else {
        logs.push({ id: i, content: `[THOUGHT_END] Agent${i%5} -> User: Done thinking about task ${i}.` });
    }
}

function oldWay(logs) {
    return logs
        .filter(l => typeof l.content === 'string' && (l.content.startsWith('[CHAT]') || l.content.startsWith('[THOUGHT_START]') || l.content.startsWith('[THOUGHT_END]')))
        .reduce((acc, l) => {
            if (l.content.startsWith('[CHAT]')) {
                const match = l.content.match(/^\[CHAT\]\s*(.+?)\s*->\s*(.+?):\s*(.*)$/us);
                if (match) {
                    acc.push({ id: l.id, sender: match[1], recipient: match[2], content: match[3], isAgent: match[1] !== 'User' });
                }
            } else if (l.content.startsWith('[THOUGHT_START]')) {
                const match = l.content.match(/^\[THOUGHT_START\]\s*(.+?)\s*->\s*(.+?):\s*(.*)$/us);
                if (match) {
                    const agent = match[1];
                    if (agent !== 'ALL' && agent !== 'User' && agent !== 'System') {
                        acc.push({ id: `typing-${agent}`, isAgent: true, sender: agent, isTyping: true });
                    }
                }
            } else if (l.content.startsWith('[THOUGHT_END]')) {
                const match = l.content.match(/^\[THOUGHT_END\]\s*(.+?)\s*->\s*(.+?):\s*(.*)$/us);
                if (match) {
                    const agent = match[1];
                    // Remove typing indicator when they end thought
                    acc = acc.filter(m => !(m.isTyping && m.sender === agent));
                }
            }
            return acc;
        }, []);
}

function newWay(logs) {
    const messages = [];
    const typingAgents = new Set();

    for (let i = 0; i < logs.length; i++) {
        const l = logs[i];
        if (typeof l.content !== 'string') continue;

        if (l.content.startsWith('[CHAT]')) {
            const match = l.content.match(/^\[CHAT\]\s*(.+?)\s*->\s*(.+?):\s*(.*)$/us);
            if (match) {
                messages.push({
                    id: l.id,
                    sender: match[1],
                    recipient: match[2],
                    content: match[3],
                    isAgent: match[1] !== 'User'
                });
            }
        } else if (l.content.startsWith('[THOUGHT_START]')) {
            const match = l.content.match(/^\[THOUGHT_START\]\s*(.+?)\s*->/us);
            if (match) {
                const agent = match[1];
                if (agent !== 'ALL' && agent !== 'User' && agent !== 'System') {
                    typingAgents.add(agent);
                }
            }
        } else if (l.content.startsWith('[THOUGHT_END]')) {
            const match = l.content.match(/^\[THOUGHT_END\]\s*(.+?)\s*->/us);
            if (match) {
                typingAgents.delete(match[1]);
            }
        }
    }

    for (const agent of typingAgents) {
        messages.push({ id: `typing-${agent}`, isAgent: true, sender: agent, isTyping: true });
    }

    return messages;
}

const startOld = process.hrtime.bigint();
for(let i=0; i<1000; i++) oldWay(logs);
const endOld = process.hrtime.bigint();

const startNew = process.hrtime.bigint();
for(let i=0; i<1000; i++) newWay(logs);
const endNew = process.hrtime.bigint();

console.log(`Old way: ${(endOld - startOld) / 1000000n} ms`);
console.log(`New way: ${(endNew - startNew) / 1000000n} ms`);
