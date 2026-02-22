# AGENTS.md

This file provides guidance to agents when debugging code in this repository.

## Debugging Patterns

### Audio Debugging
- Audio elements require manual cleanup - check for memory leaks in useEffect
- Use browser console to monitor audio events (timeupdate, ended, error)
- Test autoplay restrictions in different browsers (Chrome blocks autoplay)
- Verify audio src changes don't cause unnecessary reloads

### Network Issues
- Check VITE_PROXY_URL environment variable for API connectivity
- Use HEAD requests for health checks to minimize bandwidth usage
- Monitor fetch errors in browser console for API failures
- Test with and without proxy to identify connectivity issues

### State Management
- Use React DevTools to inspect OSContext state changes
- Check bootState transitions (booting → locked → idle)
- Monitor view state changes in multi-view components
- Verify pagination state with ITEMS_PER_PAGE constant

### Performance Issues
- Use React Profiler to identify expensive re-renders
- Check for unnecessary useEffect dependencies
- Monitor audio playback performance with large libraries
- Test lazy loading with LazyImage component

### Error Handling
- Check ErrorState components for user-facing error messages
- Monitor console for schema validation errors (Zod)
- Verify fallback logic in MediaCard components
- Test error boundaries in complex component hierarchies

### Development Tools
- Use VS Code debugger for Node.js issues
- Check browser console for React warnings
- Use React DevTools for component inspection
- Monitor network tab for API calls and responses