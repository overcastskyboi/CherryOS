# 🍒 CherryOS 2.0

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](https://tailwindcss.com/)
[![Security](https://img.shields.io/badge/Security-OWASP-green)](https://owasp.org/)
[![Quality](https://img.shields.io/badge/Quality-SonarJS-orange)](https://github.com/SonarSource/eslint-plugin-sonarjs)

CherryOS is a high-performance, responsive portfolio operating system built with **React 19** and **Vite 7**. It features a modular architecture designed for a seamless, full-page desktop experience.

## 🚀 Key Features

- **Modular "Apps"**: Full-page routing for immersive sub-applications (Watch List, Game Center, Studio Rack).
- **Mobile-First Design**: Optimized for all screen sizes with Tailwind CSS 4.0.
- **Enterprise Security**: Built-in static analysis (SonarJS), OWASP security checks, and strict CSP.
- **Optimized Performance**: Manual chunking, code splitting, and automated asset synchronization.

## ☁️ Cloud & Infrastructure (OCI)

CherryOS is optimized for **zero-cost, high-security serverless hosting**:

- **OCI Object Storage**: Production artifacts are synced to a secure, project-isolated OCI compartment.
- **Serverless Architecture**: All project-specific network infrastructure (VCNs, Gateways) has been decommissioned to eliminate attack surface and unnecessary costs.
- **Fail-Safe Deployment**: Local Git hooks handle encrypted sync to OCI via a hardened CLI wrapper with proactive existence checks.

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router 7, Zod
- **Styling**: Tailwind CSS 4.0, Lucide React
- **Build Tool**: Vite 7 (Rollup)
- **Infrastructure**: Oracle Cloud Infrastructure (OCI), GitHub Pages
- **Quality**: ESLint (SonarJS + Security Plugins)

## 📖 Getting Started

Refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for local development setup and guidelines.

## 🛡️ Security Posture

- **CSP**: Strict Content Security Policy enforced in `index.html`.
- **Hardening**: Console logs stripped; Source maps disabled in production.
- **Validation**: Strict schema validation for all mock and external data via **Zod**.

---
© 2026 Colin Cherry. Built for the modern web.
