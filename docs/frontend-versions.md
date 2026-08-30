# Frontend Experiences

This project keeps two independent frontend experiences while sharing one backend and one data source.

## Approved Baseline

- Approved baseline website.
- Primary route: `/`
- Alias route: `/v1`
- Source pages: `app/(site)`, `app/(legal)`
- Existing visual components remain unchanged.

## Premium Industrial Interface

- Primary route: `/v2`
- Source pages: `app/v2`
- Components: `components/v2`
- Styles: `styles/concept-b.css`

## Shared Resources

Both versions share:

- Database and Prisma
- API routes
- Authentication
- Admin panel and CMS logic
- Products, categories, brands, images, blogs, resources, contact information, quote system, and SEO data

Do not create a second database, second API, or second admin panel for the premium industrial interface.
