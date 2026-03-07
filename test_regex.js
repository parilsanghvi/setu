const regex = /^\[THOUGHT_START\]\s*(.+?)\s*->\s*(.+?):\s*(.*)$/us;
const match = '[THOUGHT_START] Agent1 -> User: Thinking...'.match(regex);
console.log(match);
