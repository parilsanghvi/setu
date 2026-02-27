# Project Dependencies

## Purpose
This document lists the main dependencies of the Setu project.

## Key Files
- `package.json`: Main dependencies
- `frontend/app/package.json`: Frontend dependencies

## Dependencies
### Backend
- `better-sqlite3`: SQLite database driver
- `blessed`: Terminal UI library
- `cors`: CORS middleware
- `dotenv`: Environment variable loader
- `express`: Web server framework
- `socket.io`: Real-time communication
- `zod`: Schema validation

### Frontend
- `react`: UI library
- `vite`: Build tool
- `playwright`: E2E testing
- `sass`: CSS preprocessor
- `socket.io-client`: WebSocket client

These dependencies are essential for the project functionality.
We use `pnpm` as the package manager.
Make sure to install dependencies using `pnpm install`.
Check `package.json` for the full list of dependencies and versions.
We try to keep dependencies up to date to ensure security and performance.
Regularly run `pnpm update` to upgrade dependencies.
Be careful with major version updates as they may introduce breaking changes.
Read the changelogs before upgrading.
Test thoroughly after upgrading dependencies.
Remove unused dependencies to keep the project lightweight.
Avoid adding unnecessary dependencies if possible.
Evaluate new dependencies carefully before adding them.
Consider the maintenance and community support of the dependency.
Check for security vulnerabilities using `npm audit`.
Use `pnpm audit` to check for security issues in dependencies.
Fix vulnerabilities promptly.
Document any special instructions for dependencies in the README.
Some dependencies may require native build tools.
Ensure your environment is set up correctly.
Consult the documentation of each dependency for usage instructions.
Dependencies are managed separately for backend and frontend.
This allows for independent development and deployment.
Shared dependencies should be minimized or managed carefully.
Use `peerDependencies` if developing a library.
Use `devDependencies` for build and test tools.
Use `dependencies` for runtime requirements.
Understanding dependencies helps in debugging and optimization.
Keep an eye on bundle size and performance impact.
Optimize imports to reduce bundle size.
Use tree-shaking where possible.
Happy coding with Setu!
