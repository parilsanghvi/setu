---
source_hash: 2cf5f4f8f87c6fd1
facts_hash: 4449aff96de8ece1
generated_at: 2026-03-04T05:42:17.810Z
generator_version: 1.0.0
model: cheap
quality_score: 92
---
# File: lib/onboarding/doc-enricher.js

## Purpose
Write 2-3 sentences explaining what this file does and its role in the system. Be specific — mention the actual class/function names and what they accomplish.

## Exports / API Surface
Fill in EVERY Description cell in this table. Delete the example row. Each description should say what the export does in one sentence.
| Export | Type | Description |
|--------|------|-------------|
| `buildFrontmatter` | cjs_named | 
| `cleanOrphanDocs` | cjs_named | 
| `enrichAll` | cjs_named | 
| `enrichCoreArtifacts` | cjs_named | 
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
- console_output: The output of the console will be modified.
- database: There is no direct interaction with a database in this code.
- filesystem_read: The file system will be read from to access certain files and directories.
- filesystem_write: The file system will be written to by modifying existing files and creating new ones.
- subprocess: There are no external processes running or started as part of this script.

STOP HERE. Do not write anything after ## Side Effects.

## Dependents
No known dependents.

## Cross-References
- [doc-facts.js](./doc-facts.js.md)
- [doc-links.js](./doc-links.js.md)
- [status.js](./status.js.md)
