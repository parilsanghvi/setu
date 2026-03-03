---
source_hash: e4b7481248ae5cce
facts_hash: e4b7481248ae5cce
generated_at: 2026-03-03T07:56:15.822Z
generator_version: 1.0.0
model: cheap
quality_score: 100
---
# Folder: bin

## Purpose
The bin/ folder contains essential scripts for managing user authentication and profile information, setting up project environments, and testing dashboard functionality. These scripts provide the foundation for a system management tool, guiding users through setup processes and handling critical operations such as data refreshing and task fetching.

## Key Files
| File | Role |
| `dashboard.js` | Implements real-time dashboard metrics display using terminal user interface (TUI). |
| `setu-auth.js` | Handles user authentication and profile management. |
| `setu-init.js` | Initiates project setup process, creating necessary directories and files, and sending messages to the central database. |
| `setup.js` | Configures Dual-Model Environment through a setup wizard, setting up Docker environments and writing configuration to a `.env` file. |
| `test-dashboard.js` | Tests dashboard data sources by verifying agent and task fetching from the database. |

## Ownership
Not yet assigned.

## Invariants / Rules
| Rule | Description |
| Likely: Consistency - All authentication-related functions follow the same logging pattern. |
| Likely: Dependency Management - No script depends on another without proper imports or asynchronous loading. |

## Cross-References
- [dashboard.js](../../files/bin/dashboard.js.md)
- [setu-auth.js](../../files/bin/setu-auth.js.md)
- [setu-init.js](../../files/bin/setu-init.js.md)
- [setup.js](../../files/bin/setup.js.md)
- [test-dashboard.js](../../files/bin/test-dashboard.js.md)

