#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const db = require('../lib/db'); // Assuming this connects to the central DB, or we might need a local one?
// For now, assuming Setu is installed globally or linked, and db refers to the central Setu DB.
// If this script is run from the Setu repo, it works. If installed as a global bin, we might need to locate the DB differently.
// Given the context is "Setu Swarm", it likely runs from a central location.

const args = process.argv.slice(2);
let targetPath = process.cwd();

// Simple argument parsing
for (let i = 0; i < args.length; i++) {
    if (args[i] === '--path' && args[i + 1]) {
        targetPath = path.resolve(args[i + 1]);
        i++;
    }
}

console.log(`🚀 Setu Swarm Initializing at: ${targetPath}`);

if (!fs.existsSync(targetPath)) {
    console.error(`❌ Target path does not exist: ${targetPath}`);
    process.exit(1);
}

// 1. Create .setu directory
const setuDir = path.join(targetPath, '.setu');
if (!fs.existsSync(setuDir)) {
    fs.mkdirSync(setuDir);
    console.log('✅ Created .setu/ directory');
}

// 2. Scan & Generate CONTEXT.md
const contextTemplate = (role) => `# System Overview\n\nManaged by Setu Swarm.\n\n**Owner:** ${role}\n`;

const generateContext = (filePath, role, content) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content || contextTemplate(role));
        console.log(`📝 Created ${path.relative(targetPath, filePath)} (Owned by ${role})`);
    } else {
        console.log(`ℹ️  ${path.relative(targetPath, filePath)} already exists. Skipping.`);
    }
};

// Root Context
generateContext(path.join(targetPath, 'CONTEXT.md'), 'Sutradhar', `# System Overview\n\nManaged by Setu Swarm.\n\nThis project is now under the observation of the Setu Swarm.\n`);

// Backend (Tark)
const backendPath = path.join(targetPath, 'backend');
if (fs.existsSync(backendPath)) {
    generateContext(path.join(backendPath, 'CONTEXT.md'), 'Tark');
}

// Frontend (Shilpi)
const frontendPath = path.join(targetPath, 'frontend');
if (fs.existsSync(frontendPath)) {
    generateContext(path.join(frontendPath, 'CONTEXT.md'), 'Shilpi');
}

// Infra (Vishwakarma)
if (fs.existsSync(path.join(targetPath, 'docker-compose.yml'))) {
    const infraDir = path.join(targetPath, 'infra');
    if (!fs.existsSync(infraDir)) {
        fs.mkdirSync(infraDir);
    }
    generateContext(path.join(infraDir, 'CONTEXT.md'), 'Vishwakarma');
}

// 3. Handover - Send Message to Bus
try {
    // We need to ensure we can talk to the DB.
    // lib/db.js connects to ../setu.db relative to itself.
    // If this script is in bin/, require('../lib/db') works and connects to setu.db in root.

    db.send('User', 'Sutradhar', `Adopting project at ${targetPath}. Deploy the Swarm.`, 'command', {
        type: 'PROJECT_ADOPTION',
        basePath: targetPath
    });
    console.log('📨 Message sent to Sutradhar: "Adopting project..."');
} catch (e) {
    console.error('❌ Failed to send message to Bus:', e.message);
}

console.log('✨ Project Adoption Complete.');
process.exit(0);
