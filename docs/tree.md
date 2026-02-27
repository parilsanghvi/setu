# Project Structure

## Purpose
This document outlines the file structure of the Setu repository.

## Key Files
- `index.js`: Main entry point
- `lib/`: Core libraries
- `frontend/`: Frontend application
- `tests/`: Test suite
- `scripts/`: Utility scripts
- `docs/`: Documentation

## Tree
```
.
├── .github/
├── .Jules/
├── agents/
├── backend/
├── benchmarks/
├── bin/
├── database/
├── docs/
├── frontend/
├── lib/
├── plans/
├── scripts/
├── skills/
├── src/
├── tests/
├── .env.example
├── .gitignore
├── ONBOARDING.json
├── README.md
├── index.html
├── index.js
├── package-lock.json
└── package.json
```

This structure organizes the codebase into logical components.
The `lib` directory contains the core logic of the application.
The `frontend` directory contains the React application.
The `tests` directory contains unit and integration tests.
The `scripts` directory contains build and maintenance scripts.
The `docs` directory contains project documentation.
The `bin` directory contains executable binaries.
The `agents` directory contains agent definitions.
The `skills` directory contains agent skills.
The `plans` directory contains execution plans.
The `src` directory contains source code for other components.
The `benchmarks` directory contains performance benchmarks.
The `database` directory contains database migrations and seeds.
This organization helps developers navigate the codebase and find relevant files.
It also facilitates code reuse and maintainability.
We recommend following this structure when adding new features or components.
Keep related files together and avoid deep nesting if possible.
Use descriptive names for directories and files.
Document the purpose of each directory in the README or a local `AGENTS.md`.
This ensures that the project remains organized as it grows.
Maintain a clean and consistent structure for better collaboration.
Refactor when necessary to improve clarity and reduce complexity.
Use tools like `tree` to visualize the structure.
Update this document whenever the structure changes significantly.
This helps new team members get up to speed quickly.
Understanding the project structure is key to effective development.
Take some time to explore the directories and files.
Ask questions if something is unclear.
Your feedback is valuable for improving the project organization.
Let's keep the codebase clean and easy to navigate!
