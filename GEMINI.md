# CherryOS Project Context

CherryOS is a modular React 19 web application simulating a high-fidelity desktop operating system environment.

## 1. Project Organization
- **Core Repository**: `CherryOS-dev` (contains all source, tests, and configuration).
- **Current Version**: v2.5.1
- **Deployment**: Assets are served from the `gh-pages` branch via GitHub Actions.
- **Git Strategy**: Strictly adheres to **GitHub Flow**.
  - `main`: Protected production-ready code.
  - `feature/*` or `bugfix/*`: Task-specific branches merged via PR.

## 2. Naming Conventions (Automated)
- **Commits**: Must follow **Conventional Commits** (e.g., `feat:`, `fix:`, `chore:`). Enforced via `commitlint` in CI.
- **Branches**: 
  - Features: `feature/short-description`
  - Bugs: `bugfix/issue-id-description`
- **Tags**: Semantic Versioning (SemVer) required (e.g., `v2.5.1`).

## 3. UI/UX Architecture
- **Cyber-Glass Aesthetic**: Unified glassmorphism using `backdrop-filter` and refined borders.
- **Dynamic Theming**: Global `themeColor` state in `OSContext` drives application-specific atmospheres.
- **Atmospheric Effects**: `RainBackground` dynamically reacts to the active app's theme color.
- **Time Logic**: Centralized `time_utils.js` for converting large totals into human-readable "Days, Hours, Minutes" format.

## 4. Active Applications
The following applications are currently live in CherryOS:
- **My Music**: Audio player streaming from OCI with dynamic art glows.
- **Activity Log**: Real-time sync with AniList for tracking anime and manga.
- **Game Center**: Steam API integration with achievement-based "Neural Mastery" tracking.
- **Studio Rack**: Interactive gallery of production VST plugin suites.
- **OCI Console**: Infrastructure dashboard for monitoring OCI metrics and data integrity.
- **The Vault**: Asset collection tracker with market value visualization.
- **CloudCast**: Weather station with regional satellite data.
- **BPM Sync**: Precision production tool for delay and LFO timing.
- **Pokédex**: Comprehensive biological archive with animated sprite interpolation.

## 5. Performance Standards
- **Lazy Loading**: Desktop apps are code-split for rapid LCP.
- **LCP Target**: < 2.0s.
- **Verification**: Performance and integrity checks via Playwright and Vitest.

## 6. Development Commands
| Command | Action |
|---------|--------|
| `npm run dev` | Start development server |
| `npm run lint` | Run ESLint static analysis |
| `npm test` | Run unit tests (Vitest) |
| `npm run build` | Generate production bundle |
| `npm run test:e2e` | Run Playwright end-to-end tests |
