# CherryOS API & Data Specifications

CherryOS Version 2.3 uses a **Hybrid Cloud Data Strategy** to ensure high performance, zero CORS issues, and real-time synchronization.

## 1. Automated Data Mirroring (New)

The system utilizes a GitHub Actions workflow (`Refresh API Data Mirror`) that runs hourly to fetch live data from external providers and save it as static JSON artifacts within the repository.

### **Endpoints**
-   **Metadata**: `https://overcastskyboi.github.io/CherryOS/src/data/mirror/metadata.json`
    -   Contains: `lastUpdated` (UTC Timestamp)
-   **Steam Sync**: `https://overcastskyboi.github.io/CherryOS/src/data/mirror/steam.json`
    -   Contains: Full user library, playtime, and achievement data for `AugustElliott`.
-   **AniList Sync**: `https://overcastskyboi.github.io/CherryOS/src/data/mirror/anilist.json`
    -   Contains: GraphQL response for combined Anime/Manga collections.

## 2. Infrastructure Endpoints (OCI)

-   **Music Manifest**: `https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/music_manifest.json`
-   **Collection Database**: `https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/collection.csv`

## 3. Data Flow Diagram

1.  **GitHub Action** ⮕ Fetches **Steam/AniList** ⮕ Commits to **`src/data/mirror/`**.
2.  **App** ⮕ Fetches **Static Mirror JSON** (Fast, No CORS).
3.  **App UI** ⮕ Displays **Last Updated** timestamp from metadata.

---
© 2026 CherryOS Core. All data validated via Zod.
