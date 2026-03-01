# CherryOS API & Data Specifications

CherryOS Version 2.5 uses a **Build-Time Data Mirroring** strategy to ensure maximum performance, zero CORS issues, and free-tier compatibility.

## 1. Automated Data Mirroring

The system utilizes a GitHub Actions workflow that runs on every push and twice daily via `cron`. This workflow fetches live data from external providers and generates static JSON artifacts *before* the build process. These artifacts are then bundled directly into the production build.

### **Internal Data Endpoints (Bundled)**
-   **Metadata**: `/data/mirror/metadata.json`
    -   Contains: `lastUpdated` (ISO Timestamp)
-   **Steam Sync**: `/data/mirror/steam.json`
    -   Contains: Full user library, playtime, and achievement data for `AugustElliott`.
-   **AniList Sync**: `/data/mirror/anilist.json`
    -   Contains: GraphQL response for combined Anime/Manga collections.

## 2. Infrastructure Endpoints (OCI)

-   **Music Manifest**: `https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/music_manifest.json`
-   **Collection Database**: `https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/collection.csv`

## 3. Deployment Flow

1.  **GitHub Action** ⮕ Fetches **Steam/AniList** API data.
2.  **Pre-build** ⮕ Writes data to `public/data/mirror/`.
3.  **Build** ⮕ Vite bundles these files as static assets.
4.  **Runtime** ⮕ Apps fetch from their own local path (e.g., `import.meta.env.BASE_URL + 'data/mirror/...'`).

---
© 2026 CherryOS Core. All data validated via Zod.
