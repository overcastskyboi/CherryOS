# CherryOS API Specifications

## 1. Steam Integration (Game Center)

-   **User**: `AugustElliott`
-   **SteamID**: `76561198043191125`
-   **Pattern**: REST fetch via `VITE_PROXY_URL`.
-   **Image Logic**: `https://cdn.akamai.steamstatic.com/steam/apps/${id}/header.jpg`.
-   **Sorting**: `(a, b) => b.achievementPercent - a.achievementPercent`.

## 2. AniList Integration (Watch List)

-   **Type**: GraphQL (v2)
-   **Auth**: Bearer Token injected as `VITE_AL_TOKEN`.
-   **Sorting**: `(a, b) => b.score - a.score`.
-   **Batching**: 12 items initial, triggered via `displayCount` increments.

## 3. OCI Integration (The Backbone)

-   **Namespace**: `idg3nfddgypd`
-   **Region**: `us-ashburn-1`
-   **Endpoints**:
    -   Manifest: `.../o/music_manifest.json`
    -   Collection: `.../o/collection.csv`
    -   Health: `.../o/healthcheck.txt`

## 4. Environment Secrets

| Variable | Usage | Source |
| :--- | :--- | :--- |
| `VITE_PROXY_URL` | Steam/Weather Proxy | GH Secret |
| `VITE_AL_TOKEN` | AniList GraphQL | GH Secret |
| `VITE_WEATHER_API` | OpenWeather Maps | GH Secret |
| `VITE_AL_ID` | User Identification | Build Var |
| `VITE_STEAM_ID` | User Identification | Build Var |
