# CherryOS API Specifications

## 1. Steam Achievement Sync (Live)

**Pattern**: ACHIEVEMENT_SORTED_ASC (Highest % First)
- **Endpoint**: `${VITE_PROXY_URL}/steam?steamId=${VITE_STEAM_ID}`
- **Sorting**: Data is sorted by `achievementPercent` descending before rendering.
- **Infinite Scroll**: Initial fetch loads 12 items; observer triggers subsequent batches of 12.

## 2. AniList GraphQL Integration (Live)

**Pattern**: RATING_DESC (Highest Score First)
- **API**: `https://graphql.anilist.co`
- **Auth**: Bearer Token injected at build-time.
- **Query**: Combined Anime/Manga list retrieval including `MediaListCollection` metadata.

## 3. Music Manifest API (Cloud)

**Source**: `https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/music_manifest.json`
- **Schema**: Strictly validated via `MusicManifestSchema` (Zod).
- **CORS**: Requires `crossOrigin = 'anonymous'` for browser-level audio streaming.

## 4. Collection Tracker (The Vault)

**Source**: `src/data/collection.csv` (Synced to OCI)
- **Parser**: PapaParse with dynamic typing enabled.
- **Fields**: Supports price-in-pennies conversion, category breakdown, and market value projection.

## 5. Security Protocol

**Zero-Exposure Policy**:
- All `VITE_` variables are securely handled via GitHub Environment Secrets.
- API tokens are never exposed in the client-side source code post-build.
- `404.html` SPA routing ensures sub-paths are protected and correctly redirected to the main engine.
