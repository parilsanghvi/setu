---
source_hash: 8d792f02bd3545fb
facts_hash: 8b1713743b7eb640
generated_at: 2026-02-25T12:09:39.224Z
generator_version: 1.0.0
model: cheap
quality_score: 91
---
# File: lib/onboarding/doc-enricher.js

## Purpose
Write 2-3 sentences explaining what this file does and its role in the system. Be specific — mention the actual class/function names and what they accomplish.

## Exports / API Surface
Fill in EVERY Description cell in this table. Delete the example row. Each description should say what the export does in one sentence.
| Export | Type | Description |
|--------|------|-------------|
| `buildFrontmatter` | cjs_named | 
| `enrichAll` | cjs_named | 
| `enrichFile` | cjs_named | 
| `enrichFolder` | cjs_named | 
| `GENERATOR_VERSION` | cjs_named | 
| `isPlaceholderDoc` | cjs_named | 
| `parseFrontmatter` | cjs_named | 
| `PLACEHOLDER_MARKERS` | cjs_named | 
| `redactSecrets` | cjs_named | 
| `REQUIRED_FILE_HEADINGS` | cjs_named | 
| `REQUIRED_FOLDER_HEADINGS` | cjs_named | 
| `scoreDocContent` | cjs_named | 
| `scoreFolderDocContent` | cjs_named | 

## Internal Logic
Describe the main execution flow. Name the key functions and explain what each one does. If the file defines a class, describe its constructor and main methods. Do not write "Straightforward" unless the file is under 20 lines.

## Dependencies
Fill in EVERY Why cell in this table. Delete the example row. Each Why should explain the purpose of the import in one phrase.
| Module | Local | Why |
|--------|-------|-----|
| `./doc-facts` | Yes | 
| `./doc-links` | Yes | 
| `./status` | Yes | 
| `child_process` | No | 
| `crypto` | No | 
| `fs` | No | 
| `path` | No | 

## Side Effects
Describe each side effect with specifics:
- console_output: The output is generated to the console.
- filesystem_read: The script reads files from the file system.
- filesystem_write: The script writes data to the file system.
- subprocess: The script runs external processes.

## Invariants / Rules
List any architectural constraints or coding conventions this folder follows. If unsure, prefix with "Likely:". Write at least one rule based on the patterns you see.

## Dependents
No known dependents.

## Cross-References
- [doc-facts.js](./doc-facts.js.md)
- [doc-links.js](./doc-links.js.md)
- [status.js](./status.js.md)
