/**
 * dependency-engine.js — Rule-based Symbol Dependency Resolution
 *
 * Maps function/class calls to their source definitions using static facts.
 * NO LLM involvement. Deterministic.
 */

const path = require('path');
const fs = require('fs');

/**
 * Build a global registry of all exported symbols in the project.
 * @param {Array<Object>} allFileFacts - Array of facts from doc-facts.js
 * @returns {Map<string, string[]>} Symbol Name -> Array of File Paths that export it
 */
function buildGlobalRegistry(allFileFacts) {
    const registry = new Map();

    for (const facts of allFileFacts) {
        if (!facts.exports) continue;
        for (const exp of facts.exports) {
            const name = exp.name;
            if (!registry.has(name)) registry.set(name, []);
            registry.get(name).push(facts.file);
        }
    }

    return registry;
}

/**
 * Resolve call sites in a file to their likely source files.
 * @param {Object} fileFacts - Facts for a single file
 * @param {Map<string, string[]>} globalRegistry - The registry from buildGlobalRegistry
 * @returns {Array<Object>} List of resolved dependencies { symbol, file }
 */
function resolveFileDependencies(fileFacts, globalRegistry) {
    const resolved = [];
    const seen = new Set();

    if (!fileFacts.calls) return resolved;

    for (const symbol of fileFacts.calls) {
        let sourceFiles = [];

        if (globalRegistry.has(symbol)) {
            sourceFiles = globalRegistry.get(symbol);
        }

        for (const f of sourceFiles) {
            if (f === fileFacts.file) continue; // Skip self-references
            const key = `${symbol}|${f}`;
            if (!seen.has(key)) {
                seen.add(key);
                resolved.push({ symbol, file: f });
            }
        }
    }

    // Sort by file for deterministic output
    resolved.sort((a, b) => a.file.localeCompare(b.file) || a.symbol.localeCompare(b.symbol));
    return resolved;
}

/**
 * Compute the downstream impact map (who calls this file's symbols?).
 * @param {Array<Object>} allFileFacts - Array of all file facts
 * @param {Map<string, string[]>} globalRegistry - Registry
 * @returns {Map<string, Array<Object>>} File Path -> [{ callerFile, symbol }]
 */
function computeImpactMap(allFileFacts, globalRegistry) {
    const impactMap = new Map(); // targetFile -> Array of { callerFile, symbol }

    for (const callerFacts of allFileFacts) {
        const resolved = resolveFileDependencies(callerFacts, globalRegistry);
        for (const res of resolved) {
            if (!impactMap.has(res.file)) impactMap.set(res.file, []);
            impactMap.get(res.file).push({ callerFile: callerFacts.file, symbol: res.symbol });
        }
    }

    // Sort callers for deterministic output
    for (const [file, callers] of impactMap.entries()) {
        callers.sort((a, b) => a.callerFile.localeCompare(b.callerFile) || a.symbol.localeCompare(b.symbol));
    }

    return impactMap;
}

module.exports = {
    buildGlobalRegistry,
    resolveFileDependencies,
    computeImpactMap,
};
