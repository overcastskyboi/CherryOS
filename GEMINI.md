# CherryOS Project Context

CherryOS is a modular React 19 web application simulating a desktop operating system environment.

## 1. Project Organization
- **Core Repository**: `CherryOS-dev` (contains all source, tests, and configuration).
- **Deployment**: Assets are served from the `gh-pages` branch.
- **Git Strategy**: Strictly adheres to **GitHub Flow**.
  - `main`: Protected production-ready code.
  - `feature/*` or `bugfix/*`: Task-specific branches merged via PR.

## 2. Naming Conventions (Automated)
- **Commits**: Must follow **Conventional Commits** (e.g., `feat:`, `fix:`, `chore:`). Enforced via `commitlint` in CI.
- **Branches**: 
  - Features: `feature/short-description`
  - Bugs: `bugfix/issue-id-description`
  - Maintenance: `chore/task-name`
- **Tags**: Semantic Versioning (SemVer) required (e.g., `v2.0.1`).

## 3. CI/CD & Quality Gates
- **Unified Lifecycle (`main.yml`)**:
  - `test-and-lint`: Runs Vitest unit tests and ESLint.
  - `deploy-github-pages`: Deploys the application to GitHub Pages.
  - `deploy-oci-container`: (Optional) Builds and pushes a Docker container to OCI Container Registry.
- **Security**: Weekly dependency audits via Dependabot and on-demand CodeQL scans.

## 4. Performance Standards
- **Lazy Loading**: All desktop apps are code-split.
- **LCP Target**: < 2.0s (Current benchmark: ~2.4s).
- **Monitoring**: Performance metrics are captured in `src/test/e2e/performance.spec.js`.

## 5. Applications
The following applications are currently available in CherryOS:
- **My Music:** A music player for a curated list of songs.
- **Watch List:** A tracker for movies and TV shows.
- **Game Center:** A cross-platform game library tracker.
- **Studio Rack:** A list of VST plugins.
- **OCI Console:** A dashboard for OCI metrics.
- **CodeFlow:** A simple in-browser code editor.
- **CloudCast:** A weather application.
- **Scratchpad:** A note-taking application.
- **Calculator:** A standard calculator with a music timing mode.
- **Collection Tracker:** A dashboard for tracking the value of collectibles from a CSV file.

## 6. Development Commands
| Command | Action |
|---------|--------|
| `npm run dev` | Start development server |
| `npm run lint` | Run static analysis (does not fail on warnings) |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run format` | Standardize code formatting (Prettier) |
