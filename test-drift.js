const fs = require('fs');

const result = {
    ok: false,
    changed_files: [],
    required_docs: [],
    missing_docs: [],
    ownership: {
        ownership_source: 'none'
    },
    ownership_sla: {
        mode: 'warn',
        unowned_blocking: true
    }
};

fs.writeFileSync('drift.json', JSON.stringify(result));
