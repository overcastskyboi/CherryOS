# CherryOS Architecture Map

## 1. Project Hierarchy & Structure

```text
CherryOS-dev/
├── .github/workflows/  # 4-Stage CI/CD Pipeline (Quality -> Pages -> OCI -> Docker)
├── oci/                # Terraform (Infrastructure as Code)
├── src/
│   ├── apps/           # Modular OS Applications (Music, Games, Watch, Studio)
│   ├── components/
│   │   ├── Desktop.jsx # Glassmorphic core interface
│   │   ├── RainBackground.jsx # HTML5 Canvas atmospheric layer (z-[-10])
│   │   └── PixelIcons.jsx # Centralized handcrafted SVG icon library
│   ├── context/        # Global state (OSContext) including isMobile detection
│   └── data/           # Strict schemas (Zod) and internal CSV buffers
```

## 2. Layering & UI Strategy

CherryOS uses a strict **z-index stacking model** to ensure visual clarity:
- **Atmospheric Layer (`z-[-10]`)**: The dynamic rain canvas.
- **Desktop Layer (`z-0`)**: Icons and background decor.
- **Application Layer (`z-10`)**: The active route content.
- **Overlay Layer (`z-40+`)**: Sticky headers, mini-players, and system modals.

## 3. Data Flow & Synchronization

1.  **Direct API Access**: Apps fetch live data from AniList (GraphQL) and Steam (REST) using injected build-time secrets.
2.  **OCI Mirroring**: A dedicated OCI sync job ensures that the `collection.csv` and `music_manifest.json` are mirrored across GitHub and Oracle Cloud for redundancy.
3.  **Resilient Fallbacks**: If API connectivity is interrupted, apps gracefully transition to high-fidelity local data buffers (`src/data/constants.js`).

## 4. Performance Optimization

- **Infinite Scroll**: Intersection Observer API implementation in `GameCenterApp` and `WatchLogApp` to handle large datasets without UI lag.
- **Manual Chunking**: Strategic `rollupOptions` in `vite.config.js` to separate vendor libraries from application logic.
- **Lazy Loading**: Integrated `LazyImage` component for deferred loading of high-resolution media covers.
