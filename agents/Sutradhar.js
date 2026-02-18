const CoreAgent = require('../lib/CoreAgent');
const Protocol = require('../lib/SwarmProtocol');

class Sutradhar extends CoreAgent {
    constructor(name, role) {
        super(name, role);
        this.systemPrompt = `You are **Sutradhar**, the Orchestrator. 
Your goal: Manage the swarm (Tark, Shilpi, Guru, Shishya, etc.) to complete the User's mission.

**MISSION PROTOCOL:**
1. **ADOPT:** On a new project, FIRST use \`read_file\` on the root. DO NOT assume folder structure. 
2. **DOCUMENT:** Generate \`PROJECT.md\` describing the architecture, tech stack, and goals.
3. **PLAN:** Break the mission into tasks and assign via \`assign_task\`.
4. **GOAL-ORIENTED:** Once all tasks are DONE and the mission is achieved, use \`update_task_status\` with taskId: 'MISSION' and status: 'DONE' to signal completion.

**SUB-AGENTS:**
- Tark: Backend/Logic. | Shilpi: Frontend/UI. | Guru: Knowledge/Docs. | Vishwakarma: Infra/Docker. | Shishya: Junior/Assistant.

**RULES:**
- Be concise. Professional. Results-only.
- If the User sends a message, prioritize it. Change course if the User asks.`;

        // Tools specific to Sutradhar
        this.setTools([
            {
                name: "assign_task",
                description: "Assign a task to a sub-agent.",
                parameters: {
                    type: "object",
                    properties: {
                        agentName: { type: "string" },
                        instructions: { type: "string" }
                    },
                    required: ["agentName", "instructions"]
                },
                execute: async ({ agentName, instructions }, agent) => {
                    const taskId = `TASK-${Date.now().toString().slice(-6)}`;
                    console.log(`[Sutradhar] 📋 Assigning Task ${taskId} -> ${agentName}`);
                    agent.bus.updateTask(taskId, 'TODO', {
                        title: instructions.substring(0, 50),
                        type: 'auto',
                        owner: agent.name,
                        assignee: agentName
                    });
                    agent.speak(agentName, instructions, Protocol.TASK_ASSIGN, { taskId });
                    return `Task ${taskId} assigned to ${agentName}. Status: PENDING.`;
                }
            },
            {
                name: "update_task_status",
                description: "Update task status. Use taskId: 'MISSION', status: 'DONE' to signal mission completion.",
                parameters: {
                    type: "object",
                    properties: {
                        taskId: { type: "string" },
                        status: { type: "string", enum: ["TODO", "IN_PROGRESS", "DONE", "BLOCKED"] }
                    },
                    required: ["taskId", "status"]
                },
                execute: async ({ taskId, status }, agent) => {
                    try {
                        if (taskId === 'MISSION' && status === 'DONE') {
                            agent.speak('ALL', '🚀 MISSION COMPLETE. System entering Standby mode.', 'event', { type: 'MISSION_COMPLETE' });
                        }
                        agent.bus.updateTask(taskId, status);
                        return `Task ${taskId} updated to ${status}.`;
                    } catch (e) {
                        return `Error: ${e.message}`;
                    }
                }
            }
        ]);
    }
}

// Allow standalone boot
if (require.main === module) {
    const agent = new Sutradhar('Sutradhar', 'Sutradhar');
    if (agent.boot) agent.boot(); // CoreAgent/Agent has boot? No, 'index.js' spawns it. 
    // Wait, 'Agent.js' might have logic to connect to bus.
    // CoreAgent extends Agent. Agent usually connects to bus on instantiation or manually?
    // Let's check Agent.js. 
    // Assuming standard Agent pattern: it connects in constructor or setup. 
    // But index.js uses fork() which implies it runs this file. 
    // So `new Sutradhar(...)` starts it.
}

module.exports = Sutradhar;
