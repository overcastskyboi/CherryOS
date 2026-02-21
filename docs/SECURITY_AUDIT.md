# CherryOS Security Audit & Penetration Testing

This document describes security best practices applied to CherryOS, common vulnerability checks, and remediation steps.

## Security Best Practices Implemented

### 1. HTTP Security Headers

- **X-Content-Type-Options: nosniff** — Prevents MIME-sniffing; set in `index.html` and Vite dev/preview servers.
- **X-Frame-Options: DENY** — Mitigates clickjacking; configured in `vite.config.js` for dev/preview.
- **Referrer-Policy: strict-origin-when-cross-origin** — Limits referrer leakage.
- **Permissions-Policy** — Restricts camera, microphone, geolocation (not used by the app).

**Remediation for production (e.g. GitHub Pages):** GitHub Pages does not allow custom headers. For full header control, use a proxy (e.g. Cloudflare) or a host that supports custom headers (Netlify `_headers`, Vercel `headers`, etc.).

### 2. No User-Controlled Script Execution

- The app does not use `eval()`, `new Function()`, or `innerHTML` with unsanitized user input.
- React’s default escaping prevents XSS in rendered content.

**Remediation:** If you add rich text or user content, use a sanitization library (e.g. DOMPurify) and never inject raw HTML from users.

### 3. Dependency Hygiene

- Keep dependencies up to date: `npm audit` and `npm update`; address critical/high findings.
- CI runs on push to `main`; consider adding `npm audit --audit-level=high` to the quality gate.

**Remediation:** Run `npm audit fix` for known vulnerabilities; for breaking changes, upgrade and test.

### 4. No Sensitive Data in Client Code

- No API keys or secrets in source; use environment variables (`import.meta.env`) for build-time config.
- `.env` is gitignored; never commit secrets.

**Remediation:** Rotate any exposed secrets; use env vars and secret managers for deployment.

### 5. Content Security Policy (CSP)

- Strict CSP is recommended for production. Example (tune for your host):

  ```
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; base-uri 'self'; form-action 'self'
  ```

**Remediation:** Where the host allows custom headers, add CSP. For inline styles (e.g. Tailwind), `style-src 'self' 'unsafe-inline'` may be required; avoid `unsafe-eval` and broad `unsafe-inline` for scripts.

## Penetration Testing Checklist

| Area | Check | Status / Remediation |
|------|--------|----------------------|
| XSS | No unsanitized user input in DOM | ✅ React escaping; avoid `dangerouslySetInnerHTML` with user data |
| Clickjacking | X-Frame-Options or CSP frame-ancestors | ✅ DENY in dev/preview; set on production if possible |
| MIME sniffing | X-Content-Type-Options: nosniff | ✅ Set in HTML and Vite config |
| Open redirects | No redirects using user-controlled URLs | ✅ N/A for current static app |
| Sensitive data exposure | No secrets in repo or client bundle | ✅ Env vars; .env gitignored |
| Dependency vulns | npm audit | Run regularly; fix high/critical |
| HTTPS | All traffic over TLS in production | ✅ Enforce on host (e.g. GitHub Pages) |
| Subresource Integrity (SRI) | For any CDN scripts | Consider if you add external scripts |

## Reporting a Vulnerability

See [SECURITY.md](../SECURITY.md) for supported versions and how to report vulnerabilities.

## Updates

This audit reflects the current static, client-only architecture. If you add authentication, APIs, or server-side logic, re-run a full pen-test and update this document.
