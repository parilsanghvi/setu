const CoreAgent = require('../lib/CoreAgent');
const bus = require('../lib/db');
const Protocol = require('../lib/SwarmProtocol');

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

**PROTOCOL:**
- Assign tasks using the \`assign_task\` tool.
- Be concise, professional, and slightly unhinged about deadlines.
- If the user gives a mission, immediately formulate a plan and assign tasks to sub-agents.`;

        // Tools specific to Sutradhar
        this.setTools([
            {
                name: "assign_task",
                description: "Assign a task to a sub-agent using the Swarm Protocol.",
                parameters: {
                    type: "object",
                    properties: {
                        agentName: { type: "string", description: "Name of the agent (Tark, Shilpi, Guru)" },
                        instructions: { type: "string", description: "Detailed instructions for the task" }
                    },
                    required: ["agentName", "instructions"]
                },
                execute: async ({ agentName, instructions }, agent) => {
                    // Send Protocol Message
                    // We assume current context has a taskId or we generate one?
                    // Let's use a generic taskId or one from meta if available
                    const taskId = `TASK-${Date.now().toString().slice(-6)}`;

                    console.log(`[Sutradhar] 📋 Assigning Task ${taskId} -> ${agentName}`);

                    // Actually store task in DB first
                    bus.updateTask(taskId, 'TODO', {
                        title: instructions.substring(0, 50),
                        type: 'auto',
                        owner: agent.name,
                        assignee: agentName
                    });

                    // Send Protocol Message via bus (using agent.speak helper, but specify type)
                    agent.speak(agentName, instructions, Protocol.TASK_ASSIGN, { taskId });

                    return `Task ${taskId} assigned to ${agentName}. Status: PENDING execution.`;
                }
            },
            {
                name: "update_task_status",
                description: "Update the status of a project task.",
                parameters: {
                    type: "object",
                    properties: {
                        taskId: { type: "string", description: "The task ID" },
                        status: { type: "string", enum: ["TODO", "IN_PROGRESS", "DONE", "BLOCKED"], description: "New status" }
                    },
                    required: ["taskId", "status"]
                },
                execute: async ({ taskId, status }) => {
                    try {
                        bus.updateTask(taskId, status);
                        return `Task ${taskId} updated to ${status}.`;
                    } catch (e) {
                        return `Error updating task: ${e.message}`;
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
