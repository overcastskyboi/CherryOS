# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x     | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you believe you have found a security vulnerability:

1. **Do not** open a public issue.
2. Email the maintainers or open a **private** security advisory on GitHub: [Security Advisories](https://github.com/overcastskyboi/cherryos/security/advisories/new).
3. Include steps to reproduce, impact, and suggested fix if possible.
4. You can expect an initial response within 5 business days and regular updates until the issue is resolved or declined.

## Security Practices

- We run dependency audits and address high/critical vulnerabilities.
- Security-related headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy) are applied in development and preview; see [docs/SECURITY_AUDIT.md](docs/SECURITY_AUDIT.md) for production guidance.
- No secrets or API keys are committed; use environment variables and keep `.env` out of version control.

For a full checklist and penetration-testing notes, see [docs/SECURITY_AUDIT.md](docs/SECURITY_AUDIT.md).
