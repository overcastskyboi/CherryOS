# 🍒 CherryOS 2.5.1

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](https://tailwindcss.com/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-green)](https://github.com/overcastskyboi/CherryOS/actions)

CherryOS is a high-fidelity, high-performance portfolio operating system. Version 2.5.1 features a comprehensive **Cyber-Glass** aesthetic overhaul, dynamic atmospheric theming, and deep cloud integration with Steam, AniList, and Oracle Cloud Infrastructure (OCI).

## 🚀 Experience the Mesh

-   **Activity Log**: Advanced tracking for media history. Real-time synchronization with **AniList** featuring GraphQL-powered fetching and official artifact cover art.
-   **My Music**: Ultra-low latency audio engine streaming directly from **OCI Object Storage**. Includes dynamic reactive glows and background persistence.
-   **Game Center**: Deep **Steam API** integration. Synchronizes full libraries and achievement telemetry, visualized through "Neural Mastery" progress metrics.
-   **Pokédex**: Interactive biological archive. Features pixel-perfect animated sprite rendering, type-reactive atmospheres, and tactical moveset data.
-   **Studio Rack**: Visual showcase of production DSP tools. High-resolution interface previews and detailed technical analysis of VST plugin suites.
-   **OCI Console**: Real-time infrastructure monitoring. Verifies satellite node integrity and mirrors storage availability across the Ashburn region.
-   **The Vault**: Multi-asset collection tracker. Populated via automated cloud CSV sync with integrated market value projection and sector visualization.
-   **BPM Sync**: Precision synchronization tool for audio engineering. Calculates mission-critical delay, LFO, and reverb timings with absolute accuracy.
-   **CloudCast**: Dynamic meteorological station. Real-time data targeting regional coordinates with satellite-linked atmospheric rendering.

## 🛠️ Project Structure

```text
CherryOS-dev/
├── .github/workflows/  # Automated CI/CD & Data Mirroring
├── oci/                # Terraform Infrastructure (IaC)
├── src/
│   ├── apps/           # Modular, code-split OS applications
│   ├── components/     # High-fidelity UI primitives (Glass, Rain, Sprites)
│   ├── context/        # Global Mesh State (Dynamic Theming, Boot, Lock)
│   ├── data/           # Strict schemas (Zod), time logic, and constants
│   └── test/           # Integrity verification (Vitest, Playwright)
└── vite.config.js      # High-performance build engine
```

## ☁️ Cloud Strategy

CherryOS utilizes a triple-redundant architecture:
1.  **Edge Compute**: Frontend delivery via **GitHub Pages Global CDN**.
2.  **Telemetry Storage**: Large media assets and telemetry databases hosted on **Oracle Cloud Infrastructure**.
3.  **Data Mirroring**: Automated GitHub Actions periodically mirror external APIs (Steam, AniList) to ensure offline availability and extreme performance.

## 🛡️ Security & Performance

-   **Encrypted Secrets**: Mission-critical tokens are managed exclusively through GitHub Secrets.
-   **Neural Logic**: Centralized time conversion and data normalization for consistent cross-app telemetry.
-   **LCP Optimized**: Aggressive lazy loading and asset compression achieve < 2.0s LCP targets.

---
© 2026 Colin Cherry. Developed for the Modern Web.
