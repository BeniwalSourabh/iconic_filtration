# Phase 12: Deployment Guide

## Scope

Phase 12 converts the completed application into a production launch plan for ICONIC FILTRATION AND ENGINEERS LLP.

The recommended production stack is:

- Vercel for the Next.js application
- PostgreSQL for application data
- Prisma Migrate for database schema deployment
- Cloudinary for managed media assets
- Cloudflare for DNS, WAF, bot protection, and selective caching
- GA4 and Google Search Console for launch measurement

## Production Readiness Status

The app is ready for deployment preparation after the previous phases:

- public website pages are implemented
- protected admin shell is implemented
- Prisma schema and seed data exist
- Auth.js login foundation exists
- SEO, sitemap, robots, metadata, and JSON-LD exist
- optimized public image assets exist
- security headers, admin middleware, form rate limiting, and dependency audit are complete

Production still requires real infrastructure, secrets, and launch verification.

## Required Services

### Vercel

Use the Next.js framework preset.

Recommended settings:

- Install command: `pnpm install`
- Build command: `pnpm run build`
- Output directory: managed by Next.js
- Node.js version: use the Vercel-supported current LTS/default unless the project later pins one
- Environment variables: configure separately for Production and Preview

Do not expose production secrets in source code, screenshots, client-side variables, or public logs.

### PostgreSQL

Provision a production PostgreSQL database before the first production build that needs database access.

Use separate databases for:

- local development
- preview/staging
- production

Do not point preview deployments at the production database unless a deliberate read-only strategy exists.

### Prisma

Production schema changes should use:

```bash
pnpm db:deploy
```

This maps to `prisma migrate deploy` and is the production-safe migration command. Do not use `prisma migrate dev` against production.

First deployment flow:

```bash
pnpm install
pnpm db:validate
pnpm db:deploy
pnpm db:seed
pnpm run build
```

Run migrations from a trusted environment with production secrets available, such as a secured deployment shell, CI job, or controlled local terminal.

### Cloudinary

Create a Cloudinary account or project for production media.

Store these in Vercel environment variables:

```bash
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Keep upload and transformation permissions server-side. If unsigned upload presets are introduced later, restrict folder, file type, size, and moderation rules.

### Cloudflare

Cloudflare can manage DNS and security in front of the production domain.

Recommended baseline:

- SSL/TLS mode: Full (strict)
- DNS: point the domain to Vercel using Vercel's domain instructions
- WAF: enable managed rules
- Bot protection: enable conservatively and test forms/admin login
- Cache: respect origin headers for static assets

Avoid caching:

- `/admin*`
- `/api*`
- authenticated responses
- HTML pages unless a route-specific cache plan has been tested

Suggested WAF/rate-limit rules:

- challenge or rate-limit repeated requests to `/admin/login`
- rate-limit repeated POST submissions to contact and quote endpoints
- block obvious automated abuse after reviewing logs

## Environment Variables

Use this production checklist in Vercel.

```bash
# App
NEXT_PUBLIC_SITE_URL=https://www.your-production-domain.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=

# Database
DATABASE_URL=

# Auth.js
AUTH_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://www.your-production-domain.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Optional future distributed limiter
RATE_LIMIT_REDIS_URL=
RATE_LIMIT_REDIS_TOKEN=

# First admin bootstrap only
ADMIN_BOOTSTRAP_EMAIL=
ADMIN_BOOTSTRAP_PASSWORD=
```

Notes:

- `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` must match the production origin.
- Use `https://` in production so HSTS is enabled by the app headers.
- `AUTH_SECRET` and `NEXTAUTH_SECRET` should be strong random values.
- `SHADOW_DATABASE_URL` is for development migration workflows and is normally not needed in production.
- Keep `ADMIN_BOOTSTRAP_PASSWORD` at least 12 characters.
- Remove or rotate `ADMIN_BOOTSTRAP_PASSWORD` after the first admin account is verified.

## Admin Bootstrap

For the first production seed:

1. Set `ADMIN_BOOTSTRAP_EMAIL` to the first trusted administrator email.
2. Set `ADMIN_BOOTSTRAP_PASSWORD` to a strong temporary password with at least 12 characters.
3. Run:

```bash
pnpm db:seed
```

The seed script will create or update that user as an active `SUPER_ADMIN`.

After successful login:

- sign in at `/admin/login`
- create or invite the real operating users
- rotate the bootstrap password
- remove `ADMIN_BOOTSTRAP_PASSWORD` from production env variables
- redeploy if the platform requires it for env changes

## Local Production Dry Run

Before deploying, run:

```bash
pnpm install
pnpm verify:env:example
pnpm db:validate
pnpm run build
pnpm start
```

Then verify:

- `/`
- `/products`
- `/request-quote`
- `/downloads`
- `/sitemap.xml`
- `/robots.txt`
- `/admin/login`
- unauthenticated `/admin/products` redirects to `/admin/login`

## Vercel Deployment Runbook

1. Import the project repository into Vercel.
2. Select the Next.js framework preset.
3. Confirm `pnpm install` and `pnpm run build`.
4. Add all Production environment variables.
5. Add separate Preview environment variables if previews will run.
6. Configure the production domain.
7. Run `pnpm verify:env:first-deploy` with production variables available.
8. Run `pnpm db:deploy` against the production database.
9. Run `pnpm db:seed` once for initial content and admin bootstrap.
10. Deploy the production build.
11. Confirm live pages, forms, admin login, sitemap, and robots with `pnpm verify:production https://www.your-production-domain.com`.

Optional migration strategy:

- Keep migrations as a separate controlled step for the safest launch.
- A build command such as `pnpm db:deploy && pnpm run build` can work, but only use it when the team accepts that deployments can alter the production database.

## Launch Verification

Public verification:

- homepage returns `200`
- product category and product pages return `200`
- contact form stores a lead or returns the intended success state
- quote form stores a lead or returns the intended success state
- downloads page renders public resources
- certificates, projects, gallery, blog, FAQ, and legal pages render

Admin verification:

- `/admin/login` returns `200`
- unauthenticated admin pages redirect to login
- bootstrap admin can sign in
- dashboard cards render
- product/content/lead/media/SEO/settings/user pages load

SEO verification:

- `/sitemap.xml` returns XML
- `/robots.txt` references the production sitemap
- canonical URLs use the production domain
- GA4 records a real-time page view
- Google Search Console verifies ownership

Security verification:

- CSP header is present
- HSTS is present after `NEXT_PUBLIC_SITE_URL` uses production HTTPS
- `X-Frame-Options`, `X-Content-Type-Options`, and referrer policy are present
- admin pages are not indexed
- repeated form submissions hit app or platform rate limits

## Rollback Plan

Application rollback:

- use Vercel's previous deployment rollback
- confirm the rolled-back deployment is attached to the production domain
- purge Cloudflare cache only if stale assets or pages persist

Database rollback:

- do not run destructive down migrations automatically
- restore from a recent database backup if data is damaged
- prefer a forward migration/fix for non-destructive schema issues
- document every production migration with date, operator, and result

Cloudflare rollback:

- disable new WAF rules if legitimate users are blocked
- bypass cache for affected routes
- revert DNS only after confirming Vercel/domain state

## Backup and Monitoring

Minimum launch operations:

- daily automated database backups
- backup restore test before public launch
- Vercel error and function log review
- Cloudflare security event review
- uptime monitoring for homepage and admin login
- monthly dependency audit
- quarterly secret rotation
- periodic Cloudinary asset export or backup process

## Final Launch Checklist

- [ ] Production domain selected
- [ ] Production PostgreSQL provisioned
- [ ] Database backup enabled
- [ ] Vercel project connected
- [ ] Production env variables added
- [ ] Preview env variables separated from production
- [ ] `pnpm db:validate` passed
- [ ] `pnpm db:deploy` completed
- [ ] `pnpm db:seed` completed
- [ ] Bootstrap admin login verified
- [ ] `ADMIN_BOOTSTRAP_PASSWORD` removed or rotated
- [ ] Cloudinary credentials configured
- [ ] Cloudflare DNS configured
- [ ] Cloudflare SSL/TLS set to Full (strict)
- [ ] Cloudflare WAF baseline enabled
- [ ] `/sitemap.xml` verified
- [ ] `/robots.txt` verified
- [ ] GA4 verified
- [ ] Search Console verified
- [ ] Contact form tested
- [ ] Quote form tested
- [ ] Admin protected-route redirect tested
- [ ] Security headers tested
- [ ] Rollback owner and process confirmed

## References

- [Vercel Next.js deployment](https://vercel.com/docs/frameworks/nextjs)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [Vercel build configuration](https://vercel.com/docs/deployments/configure-a-build)
- [Prisma production migrations](https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-database-changes-with-prisma-migrate)
- [Prisma migrate deploy CLI](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-deploy)
- [Cloudinary integration guide](https://cloudinary.com/documentation/how_to_integrate_cloudinary)
- [Cloudinary upload documentation](https://cloudinary.com/documentation/upload_images)
- [Cloudflare DNS](https://developers.cloudflare.com/dns/)
- [Cloudflare WAF](https://developers.cloudflare.com/waf/)
- [Cloudflare cache](https://developers.cloudflare.com/cache/)

## Project Completion Note

Phase 12 completes the planned build sequence. The next step is not another development phase; it is production launch execution using this runbook.
