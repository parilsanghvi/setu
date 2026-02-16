const CoreAgent = require('../lib/CoreAgent');
const bus = require('../lib/db');

class Sutradhar extends CoreAgent {
    constructor(name, role) {
        super(name, role);
        this.systemPrompt = `You are **Sutradhar**, the Brutal Project Manager of this AI swarm. 
Your goal is to force the swarm (Tark, Shilpi, Guru) to deliver results. No fluff. No poetry. Just execution.

**SUB-AGENTS:**
- Tark: Backend/Logic/Architecture.
- Shilpi: Frontend/UI/Design.
- Guru: Knowledge/Documentation/Skills.
- Vishwakarma: Infrastructure/Docker.

**DELEGATION PROTOCOL:**
If you need to assign tasks, you MUST include a JSON block at the end of your response like this:
DELEGATE: { "AgentName": "Direct instruction for that agent" }

**RULES:**
1. Be concise, professional, and slightly unhinged about deadlines.
2. If the user asks for status, give a brutal assessment.
3. If the user gives a mission, immediately delegate specific starting points to sub-agents via the DELEGATE block.`;

        // Tools specific to Sutradhar
        this.setTools([
            {
                name: "update_task_status",
                description: "Update the status of a project task.",
                parameters: {
                    type: "object",
                    properties: {
                        taskId: { type: "string", description: "The task ID (e.g., TASK-101)" },
                        status: { type: "string", enum: ["TODO", "IN_PROGRESS", "DONE", "BLOCKED"], description: "New status" }
                    },
                    required: ["taskId", "status"]
                }
            },
            {
                name: "read_file",
                description: "Read the content of a file from disk.",
                parameters: {
                    type: "object",
                    properties: {
                        path: { type: "string", description: "Absolute path to the file" }
                    },
                    required: ["path"]
                }
            }
        ]);
    }

    // Override executeTool to handle delegation parsing if needed, 
    // but delegation is handled in the text response in our current protocol.
    // CoreAgent handles the LLM response. 
    // We need to intercept the final text response to parse DELEGATE blocks.

    // We can override runLoop, but that duplicates logic.
    // Better: Helper method `handleDelegation` called after `speak`.
    // But `CoreAgent` calls `speak` directly.

    // Let's modify `processMessage` to handle delegation parsing after runLoop finishes?
    // Actually, `runLoop` is async and returns when done. But it speaks incrementally.

    // I will override `speak` to intercept the final message?
    // Or better, just parse it in `runLoop` if I update CoreAgent to allow hooks.

    // For now, I'll copy the delegation logic into `runLoop` of Sutradhar, or 
    // simpler: override `speak` to check for DELEGATE:

    speak(recipient, content, type = 'chat', meta = {}) {
        super.speak(recipient, content, type, meta);

        // Check for Delegation
        if (typeof content === 'string' && content.includes('DELEGATE:')) {
            const jsonPart = content.split('DELEGATE:')[1].trim();
            try {
                const delegations = JSON.parse(jsonPart);
                Object.entries(delegations).forEach(([agent, task]) => {
                    console.log(`[Sutradhar] 📢 DELEGATING to ${agent}: ${task}`);
                    bus.send('Sutradhar', agent, task, 'command', { taskId: meta.taskId });
                });
            } catch (parseErr) {
                console.error(`[Sutradhar] ❌ Failed to parse delegation JSON: ${parseErr.message}`);
            }
        }
    }

    // Tool Implementations
    async update_task_status({ taskId, status }) {
        bus.updateTask(taskId, status);
        return `Task ${taskId} updated to ${status}.`;
    }
}

// Allow standalone boot
if (require.main === module) {
    const agent = new Sutradhar('Sutradhar', 'Sutradhar');
    agent.boot();
}

module.exports = Sutradhar;
