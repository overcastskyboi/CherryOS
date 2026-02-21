# CherryOS Testing Protocols

This document outlines the testing procedures and protocols for ensuring the quality and reliability of CherryOS.

## Current Implementation (Quick Reference)

- **Unit tests:** Vitest — `npm test` (or `npm run test:coverage` for coverage).
- **E2E tests:** Playwright — `npm run test:e2e`. Covers Chromium, Firefox, WebKit, and mobile viewports (Pixel 5, iPhone 12).
- **Lint:** ESLint 9 — `npm run lint`.
- **CI:** On every push to `main`, the workflow runs lint, unit tests, dependency audit, E2E (all browsers/devices), then deploys to GitHub Pages. See [.github/workflows/main.yml](../.github/workflows/main.yml).
- **Performance:** E2E performance test enforces DOM Content Loaded &lt; 2s and LCP &lt; 2.5s (Core Web Vitals–aligned). See `src/test/e2e/performance.spec.js`.
- **Security:** Headers in dev/preview; dependency audit in CI; see [SECURITY_AUDIT.md](SECURITY_AUDIT.md).

## Table of Contents

1. [Testing Strategy](#testing-strategy)
2. [Unit Testing](#unit-testing)
3. [Component Testing](#component-testing)
4. [Integration Testing](#integration-testing)
5. [End-to-End Testing](#end-to-end-testing)
6. [Cross-Browser Testing](#cross-browser-testing)
7. [Performance Testing](#performance-testing)
8. [Accessibility Testing](#accessibility-testing)
9. [Security Testing](#security-testing)
10. [Continuous Integration](#continuous-integration)

## Testing Strategy

CherryOS follows a layered testing approach:

1. **Unit Tests**: Test individual functions and utilities
2. **Component Tests**: Test React components in isolation
3. **Integration Tests**: Test interactions between components
4. **End-to-End Tests**: Test complete user workflows
5. **Manual Testing**: Human verification of UX and edge cases

## Unit Testing

Unit tests focus on pure functions, utilities, and helper functions.

### Setup

Install testing dependencies:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### Example Test Structure

```javascript
// utils/formatTime.test.js
import { formatTime } from './formatTime';

describe('formatTime', () => {
  test('formats seconds correctly', () => {
    expect(formatTime(90)).toBe('1:30');
  });
  
  test('handles zero correctly', () => {
    expect(formatTime(0)).toBe('0:00');
  });
});
```

### What to Unit Test

- Utility functions
- Helper functions
- Pure functions without side effects
- Data transformation functions

### Running Unit Tests

```bash
npm test
```

Or for continuous testing:
```bash
npm test -- --watch
```

Coverage:
```bash
npm run test:coverage
```

## Component Testing

Component tests verify that individual React components render correctly and handle user interactions.

### Setup

Using React Testing Library:
```bash
npm install --save-dev @testing-library/react @testing-library/user-event
```

### Example Component Test

```javascript
// components/DesktopIcon.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DesktopIcon from './DesktopIcon';
import { Terminal } from 'lucide-react';

describe('DesktopIcon', () => {
  test('renders icon and label', () => {
    render(
      <DesktopIcon 
        icon={Terminal} 
        label="Terminal" 
        onClick={() => {}} 
      />
    );
    
    expect(screen.getByText('Terminal')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  
  test('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(
      <DesktopIcon 
        icon={Terminal} 
        label="Terminal" 
        onClick={handleClick} 
      />
    );
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### What to Component Test

- Rendering with different props
- User interactions (clicks, typing, etc.)
- State changes
- Conditional rendering
- Accessibility attributes

### Running Component Tests

Component tests are run with the same Vitest suite:

```bash
npm test
```

## Integration Testing

Integration tests verify that multiple components work together correctly.

### Example Integration Test

```javascript
// integration/windowManagement.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';

describe('Window Management', () => {
  test('opens window when desktop icon is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Click on Terminal icon
    await user.click(screen.getByText('Terminal'));
    
    // Verify window is opened
    expect(screen.getByText('Terminal')).toBeInTheDocument();
  });
  
  test('can minimize and restore window', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Open window
    await user.click(screen.getByText('Terminal'));
    
    // Minimize window
    await user.click(screen.getByLabelText('Minimize'));
    
    // Verify window is minimized
    // Check taskbar for minimized window
  });
});
```

### What to Integration Test

- Component interactions
- Context provider functionality
- Complex user workflows
- State management across components

### Running Integration Tests

Integration tests are part of the main test suite:

```bash
npm test
```

## End-to-End Testing

End-to-end tests simulate real user scenarios across the entire application using **Playwright**.

### Setup

Playwright is already a dev dependency. Install browsers (first time or CI):

```bash
npx playwright install --with-deps
```

### E2E Test Suites

- **basic.spec.js** — Boot, lock screen, unlock, open Terminal.
- **mobile.spec.js** — Mobile viewport: boot, unlock, desktop, mobile nav, open app.
- **performance.spec.js** — Load and LCP thresholds (DOM Content Loaded &lt; 2s, LCP &lt; 2.5s).
- **screenshot.spec.js**, **debug_console.spec.js** — Visual and console checks.

### What to E2E Test

- Complete user journeys
- Critical business flows
- Mobile and desktop viewports
- Performance budgets

### Running E2E Tests

```bash
npm run test:e2e
```

To run with UI or a single browser:

```bash
npx playwright test --ui
npx playwright test --project=chromium
```

## Cross-Browser and Device Testing

Ensure CherryOS works across major browsers and devices.

### Automated Browser/Device Matrix (Playwright)

- **Chromium** (Desktop Chrome)
- **Firefox** (Desktop Firefox)
- **WebKit** (Desktop Safari)
- **Mobile Chrome** (Pixel 5 viewport: 393×851)
- **Mobile Safari** (iPhone 12 viewport: 390×844)

All E2E specs run against these projects; CI runs the full matrix on every push to `main`.

### Supported Browsers (Manual / Production)

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Responsive Testing

E2E covers mobile viewports; for manual checks use:

- Mobile: 320px, 375px, 390px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1440px, 1920px

## Performance Testing

Performance is enforced in CI via Playwright.

### Enforced Thresholds (Industry-Standard)

- **DOM Content Loaded:** &lt; 2s
- **Largest Contentful Paint (LCP):** &lt; 2.5s (Core Web Vitals–aligned)

Implemented in `src/test/e2e/performance.spec.js`.

### Metrics to Monitor

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- First Input Delay (FID) / Interaction to Next Paint (INP)
- Cumulative Layout Shift (CLS)

### Additional Tools

- Lighthouse (Chrome DevTools or CLI)
- WebPageTest.org
- Chrome DevTools Performance panel

## Accessibility Testing

Ensure CherryOS is accessible to all users.

### Automated Testing

Using axe-core with Jest:
```bash
npm install --save-dev axe-core jest-axe
```

```javascript
// accessibility.test.js
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should have no accessibility violations', async () => {
  const wrapper = render(<App />);
  const results = await axe(wrapper.container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing

- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- Focus management

### WCAG Compliance

Target WCAG 2.1 Level AA compliance:
- Perceivable
- Operable
- Understandable
- Robust

## Security Testing

### Dependency Scanning

CI runs `npm audit --audit-level=high` on every push. Locally:

```bash
npm audit
npm audit fix
```

### Security Headers and Pen-Test

Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy) are applied in dev/preview. For penetration-testing checklist and remediation steps, see **[SECURITY_AUDIT.md](SECURITY_AUDIT.md)**.

## Continuous Integration

The **CherryOS Lifecycle** workflow (`.github/workflows/main.yml`) runs on every **push to `main`** and on **workflow_dispatch** and **release**:

1. **quality-gate** — Node 18 and 20: `npm ci`, `npm audit --audit-level=high`, `npm run lint`, `npm test`
2. **e2e-tests** — Playwright (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari); artifacts uploaded on failure
3. **deploy** — Build and deploy to GitHub Pages (only when `ref == main` and event is `push`)
4. **publish** — On release: build and publish to npm/GitHub Packages (when NPM_TOKEN is configured)

### Test Coverage

Run `npm run test:coverage` for Vitest coverage. Set or adjust thresholds in `vitest.config.js` if required.

## Test Reporting

Generate comprehensive test reports.

### Coverage Reports

- Istanbul/nyc for JavaScript coverage
- Generate HTML reports for easy viewing
- Track coverage trends over time

### Test Results Dashboard

- Aggregate results from all test types
- Display pass/fail rates
- Show performance metrics
- Highlight flaky tests

## Maintenance and Updates

Regular testing maintenance:

1. Update test dependencies
2. Review and update test cases
3. Add tests for new features
4. Remove obsolete tests
5. Refactor tests for improved clarity

## Troubleshooting Common Issues

### Flaky Tests

- Use deterministic data
- Mock external dependencies
- Avoid race conditions
- Use appropriate waits

### Slow Tests

- Parallelize test execution
- Optimize setup/teardown
- Use focused tests for development
- Profile slow tests

### False Positives/Negatives

- Validate test assertions
- Check test environment consistency
- Review mocking strategies
- Ensure proper cleanup

## Conclusion

Following these testing protocols ensures that CherryOS maintains high quality and reliability. Regular testing helps catch issues early and provides confidence in deployments.