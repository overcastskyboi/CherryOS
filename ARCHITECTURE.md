# CherryOS Architecture Map

## 1. Core Engine

### OSContext (`src/context/OSContext.jsx`)
The brain of CherryOS. It manages:
-   **Boot State**: Transitions from `booting` ⮕ `locked` ⮕ `idle`.
-   **Device Detection**: Real-time `isMobile` state for responsive layout switching.
-   **Window Management**: Tracks active and minimized application states.

### Routing Background (`src/components/RainBackground.jsx`)
An optimized HTML5 Canvas layer rendering a graceful, slow-motion pixel art rain effect. Targeted at `z-index: -10` to ensure no interference with application logic.

## 2. Application Layer

Every app in `src/apps/` is a high-order React component designed to function as a standalone environment.

| App | Data Source | Technology |
| :--- | :--- | :--- |
| **WatchLog** | AniList GraphQL | Infinite Scroll + rating-sorted grid |
| **MyMusic** | OCI Object Storage | Persistent Audio + `crossOrigin` streaming |
| **GameCenter** | Steam API | ID-based dynamic CDN imagery |
| **Vault** | OCI CSV | PapaParse + Recharts area visualization |
| **CloudCast** | OpenWeather | Dynamic condition-based theme switching |

## 3. Deployment Pipeline (`main.yml`)

The repository utilizes a 4-stage pipeline:

1.  **Quality Gate**: Parallel Node 20/22 runs for Linting and Vitest coverage.
2.  **Pages Deployment**: Build artifacts pushed to `gh-pages` with automated cache busting.
3.  **OCI Sync**: Direct synchronization of `collection.csv`, `music_manifest.json`, and `healthcheck.txt` to the OCI production bucket.
4.  **Docker Push**: Construction of a minimal Alpine-Nginx image for the OCI Registry.

## 4. UI/UX Specifications

-   **Design System**: Modern Glassmorphism (8% opacity, 12px blur).
-   **Typography**: 'Inter' for UI, 'Mono' for system metadata.
-   **Iconography**: Detailed 2.5D Pixel Art (SVG-based for scaling).
-   **Mobile Scaling**: 100dvh layouts with safe-area padding and 1-column grid snapping.
