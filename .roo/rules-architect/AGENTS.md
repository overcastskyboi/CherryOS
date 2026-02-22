# AGENTS.md

This file provides guidance to agents when architecting solutions in this repository.

## System Architecture

### Core Architecture
- React-based operating system interface with modular app architecture
- Uses React Router for client-side routing and navigation
- Implements global state management with OSContext
- Follows desktop metaphor with boot, lock, and desktop states

### Data Flow Architecture
- Apps communicate through React Context (OSContext)
- External data fetched via proxy or direct API calls
- Local data stored in constants.js for offline functionality
- Zod schemas validate all external data before processing

### Component Architecture
- Apps are self-contained components in src/apps/
- Reusable components in src/components/
- Global state in src/context/
- Static data in src/data/
- Tests in src/test/

## Performance Architecture

### Optimization Patterns
- Use React.memo for expensive components
- Implement lazy loading for large components
- Optimize bundle size with code splitting
- Use proper caching strategies for API responses

### Asset Management
- Optimize images with LazyImage component
- Use appropriate file formats for different media types
- Implement proper compression for static assets
- Cache static assets effectively

## Security Architecture

### Input Validation
- Always validate user input with Zod schemas
- Sanitize data from external sources
- Implement proper error handling
- Use HTTPS for all API calls

### API Security
- Implement proper authentication
- Handle CORS appropriately
- Validate all responses
- Use proxy for sensitive API calls

## Scalability Considerations

### State Management
- Use useState for local component state
- Use useContext for global state (OSContext)
- Avoid prop drilling when possible
- Use useCallback for expensive functions

### Data Architecture
- Implement proper error boundaries
- Handle loading and error states properly
- Use async/await for API calls
- Implement proper caching strategies

## Deployment Architecture

### Build Process
- Use Vite for bundling
- Implement proper environment variables
- Optimize for production builds
- Test builds locally before deployment

### Containerization
- Use multi-stage Docker builds
- Optimize container size
- Implement health checks
- Use proper security practices