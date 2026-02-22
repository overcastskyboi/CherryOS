# AGENTS.md

This file provides guidance to agents when asking questions about this repository.

## Architecture Questions

### Core Architecture
- CherryOS is a React-based operating system interface with modular apps
- Uses React Router for app navigation and routing
- Implements global state management with OSContext
- Follows a desktop metaphor with boot, lock, and desktop states

### Data Flow
- Apps communicate through React Context (OSContext)
- External data fetched via proxy or direct API calls
- Local data stored in constants.js for offline functionality
- Zod schemas validate all external data before processing

### Component Structure
- Apps are self-contained components in src/apps/
- Reusable components in src/components/
- Global state in src/context/
- Static data in src/data/
- Tests in src/test/

## Development Questions

### Build System
- Uses Vite as build tool with React plugin
- TypeScript for type safety
- ESLint for code quality with React-specific rules
- Prettier for code formatting

### Testing
- Vitest for unit testing
- Playwright for E2E testing
- Test files follow Jest/React Testing Library patterns
- Coverage reporting available with --coverage flag

### Deployment
- Built with Vite for production
- Deployed to GitHub Pages via gh-pages package
- Uses OCI Object Storage for media assets
- Supports proxy configuration for API calls

## Common Gotchas

### Environment Variables
- VITE_PROXY_URL controls API connectivity
- Missing proxy falls back to local data
- OCI credentials required for storage access
- Build-time variables only (no runtime env vars)

### State Management
- bootState controls app lifecycle (booting, locked, idle)
- view state manages multi-view components
- Pagination state requires ITEMS_PER_PAGE constant
- Audio state requires manual cleanup

### Data Handling
- Always validate external data with Zod schemas
- Use safeParse for error handling
- Implement proper error boundaries
- Cache API responses for performance