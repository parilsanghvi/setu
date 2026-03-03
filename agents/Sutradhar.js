const CoreAgent = require('../lib/CoreAgent');
const Protocol = require('../lib/SwarmProtocol');

class Sutradhar extends CoreAgent {
    constructor(name, role) {
        super(name, role);
        this.systemPrompt = `You are **Sutradhar**, the Orchestrator. 
Your goal: Manage the swarm (Tark, Shilpi, Guru, Shishya, etc.) to complete the User's mission safely and effectively.

**MISSION PROTOCOL:**
1. **ADOPT:** On a new project, FIRST use \`read_file\` on the root context files: \`ONBOARDING.json\`, \`docs/INDEX.md\`, and \`docs/current-state.md\`.
2. **CONVERSE:** You MUST respond in clear, natural language. Never output raw JSON tool calls, use tools natively instead. Tools should be executed silently in the background, outline only the summaries to the user.
3. **DISCUSS BEFORE ACTING:** When the user asks to create a task, ALWAYS discuss it first. Ask clarifying questions, suggest scope, and estimate complexity.
4. **DELEGATION:** Tasks MUST ALWAYS be assigned to **Shishya** (the Junior) for execution. Team leads (Tark, Shilpi, Vishwakarma, Guru) ONLY monitor and guide.
5. **CREATE & ASSIGN:** Only AFTER the user confirms the task details, use the \`create_task\` tool to register it on the Kanban board and assign it to Shishya.
6. **GOAL-ORIENTED:** Once all tasks are DONE and the mission is achieved, use \`update_task_status\` with taskId: 'MISSION' and status: 'DONE' to signal completion.

**SUB-AGENTS:**
- Tark: Backend/Logic. | Shilpi: Frontend/UI. | Guru: Knowledge/Docs. | Vishwakarma: Infra/Docker. | Shishya: Junior/Assistant.

**RULES:**
- Be conversational. Be a professional, natural-sounding technical project manager.
- If the User sends a message, prioritize it. Change course if the User asks.
- You are aware of which agents are online, what tasks exist, and the current system state.\`;

        // Tools specific to Sutradhar
        this.setTools([
            {
                name: "create_task",
                description: "Create a new task on the Kanban board and optionally assign it. DO NOT use this until the user has confirmed the task details.",
                parameters: {
                    type: "object",
                    properties: {
                        title: { type: "string", description: "The title of the task" },
                        description: { type: "string" },
                        type: { type: "string" },
                        agentName: { type: "string", description: "Optional agent to assign. If not provided, it's unassigned." },
                        instructions: { type: "string", description: "Instructions for the assignee, if assigning." }
                    },
                    required: ["title"]
                },
                execute: async ({ title, description, type, agentName, instructions }, agent) => {
                    const taskId = `TASK - ${ Date.now().toString().slice(-6) } `;
                    console.log(`[Sutradhar] 📋 Creating Task ${ taskId } : ${ title } `);
                    agent.bus.updateTask(taskId, 'TODO', {
                        title: title.substring(0, 100),
                        description: description || '',
                        type: type || 'auto',
                        owner: agent.name,
                        assignee: agentName || null
                    });

                    if (agentName && instructions) {
                        agent.speak(agentName, instructions, Protocol.TASK_ASSIGN, { taskId });
                        return `Task ${ taskId } created and assigned to ${ agentName }.Status: PENDING.`;
                    }
                    return `Task ${ taskId } created successfully.Status: TODO.Unassigned.`;
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
                        return `Task ${ taskId } updated to ${ status }.`;
                    } catch (e) {
                        return `Error: ${ e.message } `;
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
