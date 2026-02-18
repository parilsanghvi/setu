const Module = require('module');
const originalRequire = Module.prototype.require;

// Mock native/external dependencies
Module.prototype.require = function(id) {
    if (id === 'better-sqlite3') {
        return function() { // Mock Database Constructor
            return {
                pragma: () => {},
                exec: () => {},
                prepare: () => ({
                    run: () => ({ lastInsertRowid: 1 }),
                    all: () => [],
                    get: () => ({})
                })
            };
        };
    }
    if (id === 'dotenv') {
        return { config: () => ({}) };
    }
    if (id === 'zod') {
        class ZodType {}
        return {
            z: {
                object: () => ({ parse: () => {} }),
                string: () => ({}),
                ZodType: ZodType
            }
        };
    }
    return originalRequire.apply(this, arguments);
};

const Guru = require('../agents/Guru');
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
    const agent = new Guru('Drona-Test', 'Drona');

    // Test: Ingest Docs
    const docContent = "COBOL is a compiled English-like computer programming language aimed at business use. It is imperative, procedural and, since 2002, object-oriented.";

    console.log('\n1. Teaching Guru COBOL...');

    await agent.processMessage({
        type: 'ingest_docs',
        meta: {
            content: docContent,
            language: 'COBOL'
        }
    });

    const expectedSkillPath = path.join(agent.scope, 'cobol-syntax', 'SKILL.md');
    if (fs.existsSync(expectedSkillPath)) {
        console.log('✅ Guru successfully created COBOL-syntax skill.');
        // Cleanup
        // fs.rmSync(path.join(agent.scope, 'cobol-syntax'), { recursive: true, force: true });
    } else {
        console.error('❌ Guru failed to create skill.');
    }

    process.exit(0);
}

testDronaLearning();
