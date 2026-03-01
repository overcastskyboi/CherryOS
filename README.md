# 🍒 CherryOS 2.0

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](https://tailwindcss.com/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-green)](https://github.com/overcastskyboi/CherryOS/actions)
[![Quality](https://img.shields.io/badge/Quality-SonarJS-orange)](https://github.com/SonarSource/eslint-plugin-sonarjs)

CherryOS is a high-performance, responsive portfolio operating system built with **React 19** and **Vite 7**. It features a modular architecture designed for a seamless, full-page desktop experience.

## 🚀 Key Features

- **Modular "Apps"**: Full-page routing for immersive sub-applications (Watch List, Game Center, Studio Rack).
- **Mobile-First Design**: Optimized for all screen sizes with Tailwind CSS 4.0.
- **Enterprise Security**: Built-in static analysis (SonarJS), OWASP security checks, and strict CSP.
- **Optimized Performance**: Manual chunking, code splitting, and automated asset synchronization.

## ☁️ Cloud & Infrastructure (OCI)

CherryOS is integrated with **Oracle Cloud Infrastructure (OCI)** for robust asset management:

- **OCI Object Storage**: Production artifacts (`dist/`), music manifests, and health checks are automatically synced to OCI.
- **Always Free Tier**: Leveraging OCI's high-availability storage and container registry within free tier limits.
- **Automated CI/CD**: A consolidated 4-stage pipeline handles testing, security, Pages deployment, and OCI synchronization.

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router 7, Zod
- **Styling**: Tailwind CSS 4.0, Lucide React
- **Build Tool**: Vite 7 (Rollup)
- **Infrastructure**: Oracle Cloud Infrastructure (OCI), GitHub Pages
- **Quality**: ESLint (SonarJS + Security Plugins)

## 📖 Documentation

Detailed technical guides are available in the repository:

- **[Architecture Map](./ARCHITECTURE.md)**: Project hierarchy, component mapping, and developer guides.
- **[API Specifications](./API_SPEC.md)**: Detailed Zod schemas and OCI integration details.
- **[Contributing Guide](./CONTRIBUTING.md)**: Local development setup and PR guidelines.

## 🛡️ Security Posture

- **Secrets Management**: All OCI credentials and API keys are stored securely in GitHub Secrets.
- **Hardening**: Recursive security scans and `npm audit` gates in CI/CD.
- **Validation**: Strict schema validation for all external data via **Zod**.

---
© 2026 Colin Cherry. Built for the modern web.
