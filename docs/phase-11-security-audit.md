# Phase 11: Security Audit

## Scope

Phase 11 reviews and hardens the application against common production web risks, with emphasis on OWASP Top 10 themes:

- access control
- authentication
- injection resistance
- security misconfiguration
- vulnerable dependencies
- logging and monitoring readiness

## Completed Hardening

### Headers

Updated `next.config.ts` with stronger response headers:

- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`
- `Cross-Origin-Resource-Policy`
- conditional `Strict-Transport-Security` when `NEXT_PUBLIC_SITE_URL` starts with `https://`

The CSP allows the current JSON-LD and optional GA4 scripts. A future stricter version can move to nonce-based scripts after analytics and tag-management requirements are final.

### Admin Access Control

Added `middleware.ts` to enforce an additional admin gate before protected admin pages render.

Behavior:

- `/admin/login` remains public.
- `/admin/*` requires a valid NextAuth token with an admin-capable role.
- Unauthorized admin requests redirect to `/admin/login`.
- Admin layouts still retain the server-side `requireAdminSession()` check, so protection exists at both middleware and page levels.

### Public Form Protection

Updated public contact and quote server actions:

- Zod validation remains active.
- Honeypot field remains active.
- Input text is cleaned before storage.
- IP/email-scoped rate limiting added for contact and quote submissions.
- User-facing `limited` status added for repeated submissions.

The current rate limiter is in-memory and process-local. Production should replace or supplement it with Redis, Cloudflare WAF/rate limiting, or a durable platform-level control.

### Dependency Audit

Initial audit found three moderate transitive advisories:

- `@hono/node-server`
- `postcss`
- `uuid`

Added `pnpm-workspace.yaml` overrides for patched versions and refreshed the lockfile.

Final result:

```bash
pnpm audit --audit-level moderate
```

Result: no known vulnerabilities found.

### Secrets and Environment

Reviewed current source for hardcoded secrets. No database credentials, API keys, OAuth secrets, or Auth.js secrets were found in tracked source.

Required production secrets remain environment-based:

- `DATABASE_URL`
- `NEXTAUTH_SECRET` or `AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `CLOUDINARY_*`
- deployment analytics and verification keys

## Verification

- `pnpm run build` passed.
- Next generated 63 routes.
- Middleware built successfully.
- Public routes return `200`.
- `/admin`, `/admin/products`, and `/admin/seo` return `307` redirects to `/admin/login` when unauthenticated.
- `/admin/login` returns `200` and remains `noindex`.
- Security headers are present on public and admin responses.
- `pnpm audit --audit-level moderate` passed with no known vulnerabilities.

## Residual Risks Before Production

These require production infrastructure or business decisions:

- Configure PostgreSQL and run migrations.
- Seed or invite real admin users with least-privilege roles.
- Rotate and store secrets in the deployment platform.
- Use HTTPS production domain and set `NEXT_PUBLIC_SITE_URL` to enable HSTS.
- Configure Cloudflare WAF and bot/rate-limit rules.
- Replace in-memory form rate limiting with Redis or edge/platform limiting.
- Add CAPTCHA or managed challenge only if spam becomes a problem.
- Connect audit logs to operational review workflows.
- Define backup, restore, and incident-response procedures.
- Review Privacy Policy and Terms with a qualified legal professional.

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [OWASP Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Next.js Server Actions security](https://nextjs.org/docs/app/guides/data-security)

## Next Phase

Phase 12 should create the deployment guide:

- Vercel setup
- PostgreSQL provisioning
- Prisma migration/deploy workflow
- Cloudinary setup
- Cloudflare DNS/WAF/cache setup
- environment variables
- admin bootstrap
- backups and monitoring
