# Gemini CLI Context - CherryOS

## Project Overview
CherryOS is a React-based web application simulating a desktop operating system. It features a modular architecture using React Router for full-page application experiences ("Apps").

## Core Architecture
*   **Framework**: React 19 (Vite 7)
*   **Styling**: Tailwind CSS 4.0
*   **Routing**: React Router 7 (`BrowserRouter` with `basename="/CherryOS"`)
*   **State Management**: `OSContext` (React Context API)
*   **Data Validation**: Zod (for Watch List and other data models)
*   **Deployment**: GitHub Pages (via `gh-pages` branch) & OCI Object Storage (sync via Git Hook)

## Security & Quality Standards
*   **Static Analysis**: ESLint configured with `eslint-plugin-sonarjs` and `eslint-plugin-security`.
*   **CSP**: Strict Content Security Policy in `index.html`.
*   **Validation**: All external/mock data inputs validated via Zod schemas.
*   **Production Hardening**: Source maps disabled; console logs/debuggers stripped during build.

## OCI Infrastructure (Optimized)
*   **Deployment**: Serverless architecture using **OCI Object Storage**.
*   **Governance**: Project isolated in dedicated compartment (when active) with Standard Tier storage.
*   **Networking**: **Decommissioned all project-specific VCNs and Gateways** (e.g., `CherryOS-VCN`) to ensure zero attack surface and zero unnecessary costs.
*   **CI/CD**: Local `.git/hooks/pre-push` syncs `dist/` to OCI using a secure `oci.bat` wrapper pointing to AppData-resident Python CLI.

## Development Commands
*   `npm run dev`: Start dev server.
*   `npm run build`: Production build (security hardened).
*   `npm run lint`: Run static analysis (SonarJS/Security).
