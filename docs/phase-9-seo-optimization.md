# Phase 9: SEO Optimization

## Scope

Phase 9 adds the technical SEO foundation for the public website.

Completed items:

- Central SEO site config in `lib/seo/site.ts`
- Reusable metadata helper in `lib/seo/metadata.ts`
- JSON-LD renderer in `components/seo/json-ld.tsx`
- Structured data builders in `lib/seo/schema.ts`
- Site-wide Organization schema
- Site-wide WebSite schema
- Product schema for individual product pages
- Article schema for blog article pages
- FAQ schema for `/faqs`
- Breadcrumb schema for product categories, products, and blog articles
- Canonical URLs and Open Graph/Twitter metadata for public pages
- `robots.txt` through `app/robots.ts`
- `sitemap.xml` through `app/sitemap.ts`
- `noindex` metadata for admin pages and admin login
- Optional Google Search Console verification through `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- Optional GA4 script through `NEXT_PUBLIC_GA_MEASUREMENT_ID`

## Public Sitemap Coverage

The sitemap includes:

- core public pages
- product catalog page
- product category pages
- individual product pages
- blog index
- blog article pages
- legal pages

The sitemap intentionally excludes:

- `/admin`
- `/admin/login`
- `/api`

## Environment Variables

Already available in `.env.example`:

```bash
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

Set `NEXT_PUBLIC_SITE_URL` to the production domain before launch so sitemap, canonical URLs, and schema use the final URL.

## Verification

- `pnpm run build` passed.
- Next generated 63 routes.
- `/robots.txt` returns `200`.
- `/sitemap.xml` returns `200`.
- Sitemap includes public product and blog URLs.
- Sitemap excludes admin URLs.
- Product detail pages include Product and Breadcrumb JSON-LD.
- Blog detail pages include Article and Breadcrumb JSON-LD.
- FAQ page includes FAQ JSON-LD.
- Admin login includes `noindex`.

## Reference Guidance

Implementation follows:

- [Next.js sitemap file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Next.js robots file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Google Search Central sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Google Search Central structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)

## Next Phase

Phase 10 should focus on performance optimization:

- image size and format review
- bundle review
- font/loading strategy review
- Lighthouse checks
- Core Web Vitals checks
- caching and deployment headers
- production analytics validation
