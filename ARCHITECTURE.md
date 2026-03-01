# CherryOS Architecture Map

This document provides a comprehensive guide to the project structure and technical implementation of CherryOS.

## 1. Project Hierarchy

```text
CherryOS-dev/
├── .github/            # CI/CD Workflows (Consolidated Quality & Deployment)
├── oci/                # Terraform Infrastructure as Code
├── src/                # Source Code
│   ├── apps/           # Modular full-page applications
│   ├── components/     # Reusable UI components (DataGrid, SystemHealth)
│   ├── context/        # Global State Management (OSContext)
│   ├── data/           # Music manifests, schemas (Zod), and constants
│   └── test/           # Unit and Integration tests (Vitest)
├── Dockerfile          # Multi-stage Docker build for OCI Registry
└── vite.config.js      # Vite 7 configuration with Tailwind 4 integration
```

## 2. Component Architecture

### Core OS Layer
- **`OSContext.jsx`**: Manages boot state, active windows, and device detection.
- **`App.jsx`**: Root router using `basename="/CherryOS"` for GitHub Pages compatibility.
- **`SystemHealth.jsx`**: Real-time connectivity monitor for OCI Object Storage services.

### Application Layer
Each app in `src/apps/` is a self-contained environment:
- **`MySongsApp.jsx`**: Fetches and validates music data from OCI Object Storage.
- **`CloudDashboardApp.jsx`**: Visualizes OCI infrastructure health and metrics.

## 3. CI/CD Pipeline

The project uses a consolidated GitHub Actions workflow (`main.yml`):
1.  **Quality Gate**: Runs ESLint, Vitest, and `npm audit`.
2.  **Pages Deployment**: Automatically builds and pushes the static site to the `gh-pages` branch.
3.  **OCI Sync**: Synchronizes build artifacts and metadata to OCI Object Storage.
4.  **Container Push**: Builds and pushes a hardened Nginx-based Docker image to OCI Container Registry.

## 4. OCI Integration Details
- **Region**: `us-ashburn-1` (iad)
- **Bucket**: `cherryos-deploy-prod` (ObjectRead public access for health checks)
- **Namespace**: `idg3nfddgypd`
- **Registry**: `iad.ocir.io/idg3nfddgypd/cherryos`
