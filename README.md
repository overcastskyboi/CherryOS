# 🍒 CherryOS 2.3

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](https://tailwindcss.com/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-green)](https://github.com/overcastskyboi/CherryOS/actions)

CherryOS is a premium, high-performance portfolio operating system. Version 2.3 represents a comprehensive overhaul, featuring advanced cloud integration, sophisticated data visualizations, and a modern glassmorphic design.

## 🚀 Active Applications

-   **Watch List**: Real-time synchronization with **AniList**. Features GraphQL-powered data fetching, rating-based sorting, and official cover art.
-   **My Music**: High-fidelity audio player streaming directly from **Oracle Cloud Infrastructure (OCI)**. Supports WAV, MP3, and FLAC with a persistent background engine.
-   **Game Center**: Full **Steam API** integration for user `AugustElliott`. Synchronizes entire libraries and achievement data, sorted by completion percentage.
-   **Studio Rack**: Visual gallery of production VST suites. Interactive modals showcase actual DAW interfaces and detailed technical blurbs.
-   **OCI Console**: Infrastructure command center. Monitor real-time system metrics and verify data integrity across OCI Object Storage.
-   **The Vault**: Advanced collection tracker populated by automated CSV sync. Searchable, sortable, and features market value projection graphs.
-   **BPM Sync**: Precision tool for music production. Calculates delay times, LFO rates, and sample loop durations with glacial accuracy.
-   **CloudCast**: Dynamic weather station targeted at **Indianapolis, IN**. Features animated backgrounds and regional satellite links.

## 🛠️ Project Structure

```text
CherryOS-dev/
├── .github/workflows/  # CI/CD (Quality -> Pages -> OCI -> Docker)
├── oci/                # Terraform (Infrastructure as Code)
├── src/
│   ├── apps/           # Modular, self-contained OS applications
│   ├── components/     # Global UI (Glassmorphic cards, Rain, PixelIcons)
│   ├── context/        # State Management (boot, lock, device detection)
│   ├── data/           # Strict schemas, CSV buffers, and constants
│   └── test/           # Unit, integration, and E2E (Playwright) tests
├── Dockerfile          # Production Nginx image configuration
└── vite.config.js      # Build engine with Tailwind 4 & code-splitting
```

## ☁️ Cloud Strategy

CherryOS uses a dual-redundancy model:
1.  **Frontend**: Static assets served via **GitHub Pages Edge**.
2.  **Storage**: Large media files and database CSVs hosted on **OCI Object Storage** (Ashburn region).
3.  **Containers**: Hardened Docker images available in the **OCI Container Registry**.

## 🛡️ Security & Quality

-   **Zero-Exposure**: All API tokens and OCIDs are handled via GitHub Secrets.
-   **Strict Schema**: All external data is validated through **Zod** before reaching the UI.
-   **Performance**: Infinite scroll and lazy loading ensure < 2s LCP on all devices.

---
© 2026 Colin Cherry. Developed for the Modern Web.
