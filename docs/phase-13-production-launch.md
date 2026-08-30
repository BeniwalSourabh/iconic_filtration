# Phase 13: Production Launch

## Scope

Phase 13 begins the live infrastructure launch for ICONIC FILTRATION AND ENGINEERS LLP.

This phase can be partially prepared inside the local workspace. Final completion requires access to:

- Vercel
- production domain/DNS
- PostgreSQL
- Cloudinary
- first admin credentials
- optional Google OAuth, GA4, and Search Console accounts

## Completed Locally

- Vercel project configuration added in `vercel.json`.
- Production environment validation script added.
- Production smoke-test script added.
- Auth secret generator added.
- Deployment and launch docs updated.
- Local production server verified.
- Vercel project created: `iconic-filtration`.
- Vercel Production and Preview Auth.js URL/secret variables configured.
- Vercel Production deployment completed.
- Production smoke test passed on the Vercel default domain.
- Production PostgreSQL migration completed on Neon.
- Production seed completed with roles, catalog content, industries, SEO defaults, and the bootstrap admin.
- Live admin credential login verified.

## Current Live URL

Vercel production alias:

```text
https://iconic-filtration.vercel.app
```

Latest verified production smoke test:

```bash
pnpm verify:production https://iconic-filtration.vercel.app
```

Latest verified admin state:

- bootstrap admin exists
- status is `ACTIVE`
- role is `SUPER_ADMIN`
- live credential login returns a session cookie

## Commands

Generate a strong Auth.js secret:

```bash
pnpm generate:auth-secret
```

Validate the environment template:

```bash
pnpm verify:env:example
```

Validate real first-deploy production variables:

```bash
pnpm verify:env:first-deploy
```

Run post-deploy smoke checks:

```bash
pnpm verify:production https://www.your-production-domain.com
```

## Vercel Setup

Use these settings when importing the project:

- Framework preset: Next.js
- Install command: `pnpm install`
- Build command: `pnpm run build`
- Production branch: main branch used by the project repository
- Environment: configure Production and Preview separately

The repository now includes `vercel.json` with the install and build commands.

## First Production Variables

Required for first live launch:

```bash
NEXT_PUBLIC_SITE_URL=https://www.your-production-domain.com
DATABASE_URL=
AUTH_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://www.your-production-domain.com
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_BOOTSTRAP_EMAIL=
ADMIN_BOOTSTRAP_PASSWORD=
```

Optional:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RATE_LIMIT_REDIS_URL=
RATE_LIMIT_REDIS_TOKEN=
```

Use the same generated value for `AUTH_SECRET` and `NEXTAUTH_SECRET` unless a future Auth.js upgrade changes the secret strategy.

## Live Launch Sequence

1. Create the production PostgreSQL database.
2. Generate `AUTH_SECRET` and `NEXTAUTH_SECRET`.
3. Add Production environment variables in Vercel.
4. Add Preview environment variables separately.
5. Connect the production domain in Vercel.
6. Configure Cloudflare DNS for the domain.
7. Validate variables with `pnpm verify:env:first-deploy`.
8. Run `pnpm db:deploy`.
9. Run `pnpm db:seed`.
10. Deploy the production build.
11. Run `pnpm verify:production https://www.your-production-domain.com`.
12. Sign in at `/admin/login`.
13. Create or confirm real admin users.
14. Rotate or remove `ADMIN_BOOTSTRAP_PASSWORD`.
15. Run `pnpm verify:env`.
16. Submit one contact test and one quote test.
17. Confirm GA4 and Search Console.

## Current Stop Point

The launch is live on Vercel's default domain with production database, Cloudinary credentials, and bootstrap admin configured.

Needed from the business owner:

- final production domain
- optional Google/analytics credentials
