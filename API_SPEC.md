# CherryOS API Specifications

All external data in CherryOS is strictly validated using **Zod** schemas to ensure frontend stability and security.

## 1. Music Manifest API

**Source**: `https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/music_manifest.json`

### `AlbumSchema`
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `album_name` | `string` | Title of the collection |
| `artist` | `string` | Artist name |
| `type` | `enum` | `'Single'`, `'Album'`, `'EP'`, `'LP'` |
| `cover_url` | `string (url)` | Fully qualified OCI URL to album art |
| `tracks` | `Array<Track>` | List of audio tracks |

### `TrackSchema`
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Track name |
| `track_number`| `int | null` | Order in album |
| `url` | `string (url)` | Direct OCI URL to `.wav` or `.mp3` file |

## 2. Cloud Health API (OCI)

**Source**: `https://objectstorage.us-ashburn-1.oraclecloud.com/n/idg3nfddgypd/b/cherryos-deploy-prod/o/healthcheck.txt`

The dashboard performs a `HEAD` request to this endpoint to determine real-time connectivity to the OCI Object Storage backbone.

## 3. Watch List (AniList) Integration

**Proxy Pattern**: Data is routed through `VITE_PROXY_URL` to hide API keys. If unavailable, system defaults to Demo Mode.

## 4. Security Pattern
**Zero-Exposure Policy**:
- API Keys are **never** stored in the repository.
- OCI credentials managed via **GitHub Secrets**.
- Fail-over: If proxy is undefined, the app switches to **Demo Mode** using `src/data/constants.js`.
