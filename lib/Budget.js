const db = require('./db');

class BudgetManager {
    constructor(defaultLimit = 2.00) {
        this.defaultLimit = defaultLimit; // $2.00
        this.costPerToken = 0.000015; // Approx blend of input/output (e.g. GPT-4o)
    }

    /**
     * Check if a task has budget remaining
     * @param {string} taskId 
     * @returns {boolean}
     */
    check(taskId) {
        // In a real DB, we'd query the task's 'cost_so_far' column.
        // For MVP, we'll store it in the 'meta' JSON field of the tasks table.
        const task = db.db.prepare('SELECT meta FROM tasks WHERE id = ?').get(taskId);

        if (!task) return true; // No task? Assume ad-hoc (infinite budget or strict fail?) -> Allow for now.

        const meta = JSON.parse(task.meta || '{}');
        const currentCost = meta.cost || 0;
        const limit = meta.budget || this.defaultLimit;

        if (currentCost >= limit) {
            console.warn(`[Budget] 💸 Task ${taskId} exceeded budget ($${currentCost.toFixed(4)} / $${limit})`);
            return false;
        }
        return true;
    }

    /**
     * Record usage
     * @param {string} taskId 
     * @param {number} tokens 
     */
    record(taskId, tokens) {
        if (!taskId) return;

        const cost = tokens * this.costPerToken;
        const task = db.db.prepare('SELECT meta FROM tasks WHERE id = ?').get(taskId);

        if (task) {
            const meta = JSON.parse(task.meta || '{}');
            meta.cost = (meta.cost || 0) + cost;

            db.db.prepare('UPDATE tasks SET meta = ? WHERE id = ?')
                .run(JSON.stringify(meta), taskId);

            console.log(`[Budget] 💰 Task ${taskId} used ${tokens} tokens. Total: $${meta.cost.toFixed(4)}`);
        }
    }
}

module.exports = new BudgetManager();
