# Production Launch Execution

This document is the practical next step after Phase 12. It tracks the live launch actions that require real infrastructure access.

## Current Local Status

The project is production-build ready.

Phase 13 launch preparation is documented in `docs/phase-13-production-launch.md`.

Verified locally:

```bash
pnpm db:validate
pnpm exec tsc --noEmit --pretty false
pnpm run build
```

Reusable production smoke test:

```bash
pnpm verify:production
```

Production environment validation:

```bash
pnpm verify:env
```

Generate strong Auth.js secrets:

```bash
pnpm generate:auth-secret
```

First-deploy environment validation with admin bootstrap required:

```bash
pnpm verify:env:first-deploy
```

Use a live URL after deployment:

```bash
pnpm verify:production https://www.your-production-domain.com
```

Or:

```bash
SMOKE_BASE_URL=https://www.your-production-domain.com pnpm verify:production
```

## Access Needed For Live Launch

Before the launch can be completed, collect these values:

- Vercel account or project access
- production domain name
- PostgreSQL `DATABASE_URL`
- strong `AUTH_SECRET`
- strong `NEXTAUTH_SECRET`
- production `NEXTAUTH_URL`
- Cloudinary cloud name, API key, and API secret
- first admin email
- first admin temporary password with at least 12 characters
- optional Google OAuth client ID and secret
- optional GA4 measurement ID
- optional Google Search Console verification token

## Launch Order

1. Create the production PostgreSQL database.
2. Generate a strong secret with `pnpm generate:auth-secret`.
3. Add production environment variables in Vercel.
4. Connect the repository to Vercel.
5. Configure the production domain in Vercel.
6. Configure Cloudflare DNS to point to Vercel.
7. Validate production environment variables:

```bash
pnpm verify:env:first-deploy
```

8. Run:

```bash
pnpm db:deploy
pnpm db:seed
```

9. Deploy the production build.
10. Run:

```bash
pnpm verify:production https://www.your-production-domain.com
```

11. Sign in at `/admin/login`.
12. Rotate or remove `ADMIN_BOOTSTRAP_PASSWORD`.
13. Run `pnpm verify:env` again after removing bootstrap credentials.
14. Verify contact and quote submissions.
15. Verify GA4 and Search Console.

## Environment Validation Coverage

`pnpm verify:env` checks:

- required production URL, database, Auth.js, and Cloudinary variables exist
- production URLs use `https://`
- `DATABASE_URL` is a PostgreSQL connection string
- `NEXTAUTH_SECRET` or `AUTH_SECRET` is at least 32 characters
- Google OAuth variables are configured as a pair
- admin bootstrap password length is at least 12 characters when present
- `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` origins match or are intentionally reviewed

Template validation:

```bash
pnpm verify:env:example
```

## Smoke Test Coverage

`pnpm verify:production` currently checks:

- homepage returns `200`
- admin login returns `200`
- protected admin page redirects to `/admin/login`
- sitemap returns `200`
- robots file returns `200`
- Content Security Policy header is present

## Current Blocker

The remaining launch work cannot be completed from the local workspace alone. It needs production service credentials and the final domain decision.

Once those are available, use the Phase 12 guide and this execution checklist together.
