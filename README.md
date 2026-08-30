# ICONIC FILTRATION AND ENGINEERS LLP

Production website workspace for ICONIC FILTRATION AND ENGINEERS LLP.

## Current Status

The project is now runnable as a Next.js app shell.

Completed foundations:

- Phase 1 architecture documentation
- Phase 2 design system foundation
- Phase 3 Prisma database foundation
- Phase 4 authentication foundation
- Phase 5 reusable component foundation
- Phase 6 premium homepage
- Phase 7 remaining public pages
- Phase 8 protected admin dashboard expansion
- Phase 9 SEO optimization foundation
- Phase 10 performance optimization
- Phase 11 security audit and hardening
- Phase 12 deployment guide
- Phase 13 production launch preparation
- Initial Next.js 15 app shell
- Brand-led homepage starter
- Product taxonomy, category, and detail pages
- Contact and quote form surfaces with validated server actions
- Public resources, projects, gallery, certificates, case studies, blog, FAQs, and legal pages
- Protected admin module pages for catalog, content, media, leads, SEO, settings, and users
- Sitemap, robots, canonical metadata, Open Graph/Twitter metadata, and structured data
- Optimized public image assets and static cache headers
- CSP/security headers, admin middleware, form rate limiting, and clean dependency audit
- Production deployment runbook for Vercel, PostgreSQL, Prisma, Cloudinary, and Cloudflare
- Vercel launch config, environment validation, smoke tests, and Auth secret generation

## Run Locally

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open http://localhost:3000.

## Database

Validate Prisma:

```bash
pnpm db:validate
```

Generate Prisma client:

```bash
pnpm db:generate
```

Apply migrations after `DATABASE_URL` is configured:

```bash
pnpm db:migrate
```

## Authentication

Admin routes live under `/admin`. Configure these variables before real login:

```bash
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

Optional Google login:

```bash
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Component Foundation

Reusable components are documented in `docs/phase-5-reusable-components.md`.

## Homepage

The Phase 6 homepage is documented in `docs/phase-6-homepage.md`.

## Public Pages

The Phase 7 public pages are documented in `docs/phase-7-pages.md`.

## Admin Dashboard

The Phase 8 admin dashboard is documented in `docs/phase-8-admin-dashboard.md`.

## SEO

The Phase 9 SEO foundation is documented in `docs/phase-9-seo-optimization.md`.

## Performance

The Phase 10 performance work is documented in `docs/phase-10-performance-optimization.md`.

## Security

The Phase 11 security audit is documented in `docs/phase-11-security-audit.md`.

## Deployment

The Phase 12 deployment guide is documented in `docs/phase-12-deployment-guide.md`.

Production launch execution is tracked in `docs/production-launch-execution.md`.

Phase 13 launch preparation is documented in `docs/phase-13-production-launch.md`.

Run the production smoke test against the local or live site:

```bash
pnpm generate:auth-secret
pnpm verify:env:example
pnpm verify:production
pnpm verify:production https://www.your-production-domain.com
```

## Reference Rule

The Aventura reference website is used only for industry, navigation, product taxonomy, and user-experience signals. Layout, design, code, images, icons, colors, animations, and copy must remain original for ICONIC.
