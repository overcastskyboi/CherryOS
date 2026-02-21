# CherryOS Deployment Guide

This guide outlines the procedures for deploying CherryOS to various environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Production Build](#production-build)
4. [Deployment Options](#deployment-options)
5. [Environment Variables](#environment-variables)
6. [CI/CD Integration](#cicd-integration)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

Before deploying CherryOS, ensure you have:

- Node.js v18 or later (see `engines` in package.json)
- npm or yarn package manager
- Git (for version control)
- Access to deployment target (local server, cloud provider, etc.)

## Local Development

To run CherryOS locally for development:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173` (or the URL shown in the terminal).

The development server includes hot reloading and applies security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy) for local testing.

## Production Build

To create an optimized production build:

1. Run the build command:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist/` directory

3. To preview the production build locally:
   ```bash
   npm run preview
   ```

### Build Configuration

The production build is configured through `vite.config.js` and includes:

- Code minification
- Asset optimization
- Tree shaking
- Environment variable injection

## Deployment Options

### Static Hosting

CherryOS can be deployed to any static hosting service:

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the contents of the `dist/` directory to your hosting provider

Popular static hosting options include:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Google Cloud Storage

### Server Deployment

For server-based deployments:

1. Build the project:
   ```bash
   npm run build
   ```

2. Copy the `dist/` directory to your server

3. Configure your web server to serve the files:
   - Set the document root to the `dist/` directory
   - Configure routing to support client-side routing (if applicable)

### Docker Deployment

To deploy using Docker:

1. Build the Docker image:
   ```bash
   docker build -t cherryos .
   ```

2. Run the container:
   ```bash
   docker run -p 8080:80 cherryos
   ```

Example Dockerfile:
```dockerfile
FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Environment Variables

CherryOS supports environment variables for configuration:

### Development (.env.local)
```bash
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=CherryOS Development
```

### Production (.env.production)
```bash
VITE_API_URL=https://api.prod.example.com
VITE_APP_TITLE=CherryOS
```

To use environment variables:

1. Create `.env` files in the project root
2. Prefix variables with `VITE_` to make them available in the browser
3. Access them in your code with `import.meta.env.VITE_VARIABLE_NAME`

## CI/CD Integration

### GitHub Actions

This repository uses the **CherryOS Lifecycle** workflow (`.github/workflows/main.yml`). On every **push to `main`** it runs lint, unit tests, dependency audit, and E2E tests (including cross-browser and mobile), then builds and deploys to **GitHub Pages**. Ensure GitHub Pages is enabled in the repo settings (Actions → Pages). Example pattern:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Other CI/CD Platforms

Most CI/CD platforms follow a similar pattern:

1. Checkout code
2. Setup Node.js environment
3. Install dependencies
4. Run tests (if applicable)
5. Build the project
6. Deploy to target environment

## Monitoring and Maintenance

### Performance Monitoring

Recommended tools for monitoring CherryOS performance:

- Google PageSpeed Insights
- Lighthouse audits
- WebPageTest.org
- Chrome DevTools Performance panel

### Error Tracking

For production error tracking:

- Sentry
- Rollbar
- Bugsnag
- Custom error logging solution

Implementation example:
```javascript
// In your main.jsx
if (import.meta.env.PROD) {
  import('./utils/errorTracking').then(({ init }) => init());
}
```

### Analytics

To add analytics:

1. Add tracking code to `index.html`
2. Use privacy-compliant analytics (Plausible, Fathom, etc.)
3. Respect user privacy with opt-out mechanisms

### Updates and Maintenance

Regular maintenance tasks:

1. Update dependencies:
   ```bash
   npm outdated
   npm update
   ```

2. Check for security vulnerabilities:
   ```bash
   npm audit
   ```

3. Test after updates:
   ```bash
   npm run test
   npm run build
   ```

4. Review browser compatibility periodically

## Troubleshooting

Common deployment issues and solutions:

### Blank Page After Deployment

1. Check browser console for errors
2. Verify all asset paths are correct
3. Ensure routing is configured properly for client-side apps

### Slow Loading Times

1. Optimize images and assets
2. Enable compression on your server
3. Use a CDN for static assets
4. Implement caching strategies

### Mixed Content Errors

1. Ensure all resources use HTTPS
2. Update API endpoints to HTTPS
3. Check third-party integrations

## Backup and Recovery

For backup and disaster recovery:

1. Version control all code and configurations
2. Regularly backup environment configurations
3. Document deployment procedures
4. Test recovery procedures periodically

## Scaling Considerations

For high-traffic deployments:

1. Use a CDN for static assets
2. Implement caching strategies
3. Consider server-side rendering for SEO
4. Monitor performance metrics
5. Plan for geographic distribution

## Security Considerations

Deployment security best practices:

1. Use HTTPS for all connections
2. Implement security headers
3. Regularly update dependencies
4. Scan for vulnerabilities
5. Implement CSP (Content Security Policy)
6. Sanitize user inputs if accepting them

## Support and Resources

For additional help with deployment:

- Vite documentation: https://vitejs.dev/
- React documentation: https://reactjs.org/
- Tailwind CSS documentation: https://tailwindcss.com/
- Community forums and Stack Overflow