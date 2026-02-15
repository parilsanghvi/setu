const Drona = require('../agents/Drona');
const LLM = require('../lib/LLM');
const fs = require('fs');
const path = require('path');

// MOCK LLM
LLM.generate = async (system, prompt) => {
    if (prompt.includes("Syntax Skill")) {
        return JSON.stringify({
            slug: "cobol-syntax",
            description: "COBOL syntax basics.",
            content: "# COBOL\n\nIDENTIFICATION DIVISION.\nPROGRAM-ID. HELLO-WORLD."
        });
    }
    return "{}";
};

async function testDronaLearning() {
    console.log('--- 🧘 Testing Drona (Polyglot) ---');

    // Setup Agent
    const agent = new Drona('Drona-Test', 'Drona');

    // Test: Ingest Docs
    const docContent = "COBOL is a compiled English-like computer programming language aimed at business use. It is imperative, procedural and, since 2002, object-oriented.";

    console.log('\n1. Teaching Drona COBOL...');

    await agent.processMessage({
        type: 'ingest_docs',
        meta: {
            content: docContent,
            language: 'COBOL'
        }
    });

    const expectedSkillPath = path.join(agent.scope, 'cobol-syntax', 'SKILL.md');
    if (fs.existsSync(expectedSkillPath)) {
        console.log('✅ Drona successfully created COBOL-syntax skill.');
        // Cleanup
        // fs.rmSync(path.join(agent.scope, 'cobol-syntax'), { recursive: true, force: true });
    } else {
        console.error('❌ Drona failed to create skill.');
    }

    process.exit(0);
}

testDronaLearning();
