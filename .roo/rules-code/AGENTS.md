# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project-Specific Patterns

### Audio Player State Management
- Always use `audioRef.current` pattern for audio elements (not React refs)
- Implement proper cleanup in useEffect return functions for audio resources
- Use `isSeeking` state to prevent rapid progress updates during user interaction
- Debounce seek operations with setTimeout to avoid performance issues

### Data Validation
- Use Zod schemas for ALL external data validation (MusicManifestSchema, TrackSchema, AlbumSchema)
- Implement safeParse for API responses to handle validation failures gracefully
- Validate track durations with custom validation functions before processing

### Component Architecture
- Use `view` state pattern for multi-view components (library, album, player)
- Implement pagination with ITEMS_PER_PAGE constant for large datasets
- Use `useCallback` for event handlers that depend on state (skipTrack, fetchData)
- Implement proper error boundaries with LoadingState and ErrorState components

### API Integration
- Always check for VITE_PROXY_URL before making external API calls
- Use HEAD requests for health checks to minimize bandwidth
- Implement retry logic with exponential backoff for failed requests
- Cache API responses with proper cache headers for performance

### Styling Conventions
- Use Tailwind CSS utility classes with consistent color palette
- Implement responsive design with md: and lg: prefixes
- Use backdrop-blur for overlay effects on dark backgrounds
- Follow consistent spacing patterns (p-6, md:p-10, lg:p-12)