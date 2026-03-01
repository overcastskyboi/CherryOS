# 🍒 CherryOS 2.2

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](https://tailwindcss.com/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-green)](https://github.com/overcastskyboi/CherryOS/actions)
[![Security](https://img.shields.io/badge/Security-Patched-success)](./package.json)

CherryOS is a premium, high-performance portfolio operating system. Version 2.2 introduces a complete visual transformation, moving from retro pixel art to a modern, elegant **Glassmorphism** aesthetic while maintaining deep cloud integration.

## 🚀 Key Features

- **Modern Glassmorphism**: A sophisticated UI featuring background blurs, subtle glows, and clean "Inter" typography.
- **Atmospheric Rain**: A high-performance HTML5 Canvas background with ultra-thin, graceful pixel rain.
- **Infinite Discovery**: Integrated **Infinite Scroll** for the Watch List and Game Center, providing seamless browsing through thousands of entries.
- **Live Data Backbone**: Direct integration with **Steam**, **AniList**, and **OpenWeather** APIs.
- **The Vault**: A high-capacity collection tracker powered by automated OCI CSV synchronization.

## ☁️ Cloud & Infrastructure (OCI)

CherryOS leverages **Oracle Cloud Infrastructure** for high-availability asset delivery:

- **Automated OCI Sync**: Production builds, music manifests, and collection data are synced to OCI Object Storage via GitHub Actions.
- **Resilient Media**: The music player features a CORS-enabled engine for secure streaming of high-fidelity tracks directly from the cloud.
- **Containerized Edge**: Hardened Nginx-based Docker images are automatically deployed to your regional OCI Registry.

## 📖 Documentation

- **[Architecture Map](./ARCHITECTURE.md)**: Deep dive into the component layering, z-index strategy, and CI/CD logic.
- **[API Specifications](./API_SPEC.md)**: Details on GraphQL queries, Steam achievement sorting, and OCI sync patterns.

---
© 2026 Colin Cherry. Built for the modern web.
