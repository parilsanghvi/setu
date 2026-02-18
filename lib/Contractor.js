const fs = require('fs');
const path = require('path');

class Contractor {
    constructor(contractsPath) {
        this.contractsPath = contractsPath || path.join(process.cwd(), 'contracts.json');
        this.contracts = this.load();
    }

    load() {
        if (fs.existsSync(this.contractsPath)) {
            try {
                return JSON.parse(fs.readFileSync(this.contractsPath, 'utf8'));
            } catch (e) {
                console.error('[Contractor] ❌ Failed to load contracts.json:', e.message);
                return {};
            }
        }
        return {};
    }

    save() {
        fs.writeFileSync(this.contractsPath, JSON.stringify(this.contracts, null, 2));
    }

    /**
     * Issues a new spec (contract draft)
     */
    issueSpec(taskId, domain, spec) {
        this.contracts[taskId] = {
            domain,
            spec,
            status: 'PROPOSED',
            timestamp: new Date().toISOString(),
            vetoes: []
        };
        this.save();
        console.log(`[Contractor] 🔨 Spec issued for Task ${taskId} (Domain: ${domain})`);
    }

    /**
     * Records a VETO from a Lead agent
     */
    recordVeto(taskId, agentName, reason) {
        if (!this.contracts[taskId]) return;

        this.contracts[taskId].vetoes.push({
            agent: agentName,
            reason,
            timestamp: new Date().toISOString()
        });
        this.contracts[taskId].status = 'VETOED';
        this.save();
        console.warn(`[Contractor] 🛑 VETO received for Task ${taskId} from ${agentName}: ${reason}`);
    }

    /**
     * Approves the current spec
     */
    approve(taskId) {
        if (!this.contracts[taskId]) return;
        this.contracts[taskId].status = 'APPROVED';
        this.save();
        console.log(`[Contractor] ✅ Spec approved for Task ${taskId}`);
    }

    getSpec(taskId) {
        return this.contracts[taskId];
    }
}

const contractor = new Contractor();
contractor.Contractor = Contractor;
module.exports = contractor;
