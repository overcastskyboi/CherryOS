# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build Commands

### Development
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Quality
- `npm run lint` - Run ESLint on JavaScript/JSX files
- `npm run format` - Format code with Prettier

### Testing
- `npm test` - Run Vitest unit tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run Playwright E2E tests

## Code Style Guidelines

### ESLint Configuration
- React hooks rules enforced (exhaustive-deps, rules-of-hooks)
- Security rules for object injection detection
- SonarJS rules for code quality (no duplicate strings)
- React refresh plugin for HMR compatibility

### React Patterns
- Use functional components with hooks
- Implement proper cleanup in useEffect return functions
- Use useCallback for event handlers with dependencies
- Follow React.memo for expensive components

### Data Handling
- Validate all external data with Zod schemas
- Use safeParse for error handling
- Implement proper error boundaries
- Cache API responses for performance

## Project-Specific Patterns

### Audio Player
- Use audioRef.current pattern for audio elements
- Implement proper cleanup for audio resources
- Use isSeeking state to prevent rapid updates
- Debounce seek operations with setTimeout

### API Integration
- Check VITE_PROXY_URL before making external calls
- Use HEAD requests for health checks
- Implement retry logic with exponential backoff
- Cache responses with proper headers

### Component Architecture
- Use view state pattern for multi-view components
- Implement pagination with ITEMS_PER_PAGE constant
- Use LoadingState and ErrorState components
- Follow consistent spacing patterns (p-6, md:p-10, lg:p-12)