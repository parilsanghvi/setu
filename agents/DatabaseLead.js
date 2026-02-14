const Agent = require('../lib/Agent');
const context = require('../lib/Context');
const path = require('path');
const fs = require('fs');

class DatabaseLead extends Agent {
    constructor(name, role) {
        super(name, role, path.join(process.cwd(), 'database'));
        this.persona = "The Hoarder";
    }

    async processMessage(msg) {
        console.log(`[${this.name}] 💾 Guarding the bits... (Persona: ${this.persona})`);

        // 1. Persona Checks
        if (msg.content.includes("DROP TABLE")) {
            this.speak(msg.sender, `😱 DROP TABLE DETECTED! Are you insane? I'm taking a snapshot first.`);
            this.takeSnapshot();
            return;
        }

        if (msg.content.includes("migration")) {
            console.log(`[${this.name}] Migration request. Simulating dry-run...`);
            // Simulate slow migration check
            if (Math.random() > 0.8) {
                this.speak(msg.sender, `⛔ Migration took >5s in simulation. Rollback initiated. Optimize your indices.`);
                return;
            }
            this.takeSnapshot();
            this.speak(msg.sender, `Snapshot taken. Proceeding with migration (fingers crossed).`);
            return;
        }

        // 2. Commands
        if (msg.content.includes("initialize scope")) {
            this.initializeScope();
            this.speak(msg.sender, `Database Vault Secured. 🔒`);
        } else {
            this.speak(msg.sender, `Received. Writing to write-ahead log...`);
        }
    }

    takeSnapshot() {
        console.log(`[${this.name}] 📸 SNAPSHOT CREATED: db_backup_${Date.now()}.sql`);
    }

    initializeScope() {
        if (!fs.existsSync(this.scope)) {
            fs.mkdirSync(this.scope, { recursive: true });
        }
        if (!context.read(this.scope)) {
            context.write(this, this.scope, `# Database Domain\n**Owner:** ${this.name}\n\n## Rules\n- No Data Loss\n- Snapshots MANDATORY\n`);
        }
    }
}

// Bootstrap
if (require.main === module) {
    const [, , name, role] = process.argv;
    const agent = new DatabaseLead(name || 'Database-Lead', role || 'DatabaseLead');
    agent.boot();
}

module.exports = DatabaseLead;
