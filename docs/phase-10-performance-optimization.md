# Phase 10: Performance Optimization

## Scope

Phase 10 reduces public asset payload, improves image delivery behavior, and adds long-lived cache headers for static assets.

## Completed Optimizations

- Created optimized public logo asset:
  - from `assets/source/iconic-filtration-logo-original.png`
  - to `public/brand/iconic-filtration-logo-384.png`
- Created optimized public hero asset:
  - from `assets/source/homepage-filtration-hero-original.png`
  - to `public/images/homepage-filtration-hero-1600.jpg`
- Updated brand configuration to use the optimized logo.
- Updated homepage and gallery images to use the optimized hero.
- Updated SEO Open Graph image path to use the optimized hero.
- Moved large original PNG assets out of `public/` into `assets/source/`.
- Added Next image configuration:
  - AVIF and WebP output formats
  - bounded device/image sizes
  - long image optimizer TTL
- Added immutable cache headers for static JS/CSS/font/image assets.
- Updated older phase docs to reference the current optimized public assets.

## Asset Impact

Public image assets before optimization:

- Hero PNG: about 2.14 MB
- Logo PNG: about 521 KB

Public image assets after optimization:

- Hero JPG: about 275 KB
- Logo PNG: about 107 KB

The original full-size files are preserved in `assets/source/` for future editing, but they are no longer served as public assets.

## Verification

- `pnpm run build` passed.
- Next generated 63 routes.
- Local production server started successfully.
- `/`, `/projects`, `/gallery`, `/products/frp-vessels`, and `/sitemap.xml` returned `200`.
- Public pages reference the optimized hero and logo files.
- Optimized assets return immutable cache headers.
- Next image optimizer returned AVIF for the hero image request.

## Remaining Performance Work

Before launch, run Lighthouse in the deployed environment because real scores depend on the production domain, CDN, network, and image optimizer behavior.

Recommended launch checks:

- Lighthouse mobile and desktop
- Core Web Vitals
- Vercel image optimizer behavior
- Cloudflare cache rules
- GA4 script impact after analytics keys are configured
- real product-image compression workflow

## Next Phase

Phase 11 should focus on security audit:

- OWASP review
- authentication and role checks
- route protection
- form validation and spam controls
- security headers
- secret handling
- audit logging
- deployment hardening
