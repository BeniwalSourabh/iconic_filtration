# Phase 2 - Design System

## Approved Defaults

The following defaults are accepted for the next phases:

- Use the logo green as a restrained sustainability and purity accent.
- Support both credentials login and Google login for the admin dashboard.
- Use an initial ICONIC-ready product taxonomy based on industry/reference signals until the final catalog is provided.

## Design Intent

ICONIC should feel like a premium Indian water-filtration engineering company: technically capable, trustworthy, precise, and easy to contact. The visual system should avoid a generic blue-water template by balancing clean white space, industrial charcoal, bright technical cyan, controlled green, and small quality accents.

The public site should feel polished and confident. The admin dashboard should feel denser, quieter, and operational.

## Brand Attributes

- Precise
- Clean
- Engineered
- Reliable
- Premium
- Sustainable
- Responsive

## Logo Usage

Primary logo asset:

- `public/brand/iconic-filtration-logo-384.png`

Usage rules:

- Use the full logo in the website header, footer, contact sections, and generated social images.
- Keep clear space around the logo equal to the height of the leaf in the mark.
- Avoid placing the full-color logo on busy video frames.
- Use a white or very light background for the full-color logo.
- For dark sections, use either a future white one-color logo asset or place the current logo on a simple light plate with 6px radius.

## Color System

### Core Tokens

| Token | Hex | Usage |
|---|---:|---|
| Deep Blue | `#05306F` | Primary actions, major headings, active navigation |
| Engineering Navy | `#071A33` | Dark sections, footer, admin shell |
| Process Cyan | `#18BFE7` | Water-tech highlights, focus states, stats |
| Purity Green | `#2E8B24` | Sustainability badges, certification accents |
| Quality Gold | `#C99A2E` | Small premium proof points, awards, certificate accents |
| Graphite | `#202832` | Primary text |
| Steel | `#64748B` | Secondary text and metadata |
| Mist | `#F4F8FB` | Page background bands |
| White | `#FFFFFF` | Main content background |
| Border | `#D8E2EA` | Subtle dividers |

### Color Principles

- Deep Blue is the primary brand color, but it should not dominate every surface.
- Cyan should communicate water technology and interaction, not decoration.
- Green should be used sparingly for sustainability, purity, and environmental cues.
- Quality Gold is limited to trust markers such as certificates, awards, and tested quality.
- Dark sections should be used for technical storytelling, metrics, footers, and contrast.

## Typography

Approved brand type:

- Headings: Poppins
- Body and UI: Inter

Type usage:

- H1: 52-76px desktop, 38-46px mobile
- H2: 36-48px desktop, 30-36px mobile
- H3: 24-32px
- Body: 16-18px for marketing pages
- UI labels: 13-14px
- Admin tables: 13-14px
- Metrics: Poppins Semibold or Inter Semibold

Rules:

- Do not scale font size with viewport width.
- Keep letter spacing at 0 by default.
- Use uppercase only for short labels, badges, and section metadata.
- Avoid oversized headings inside compact cards, sidebars, admin panels, or forms.

## Layout System

Page width:

- Marketing content max width: 1180px
- Dense catalog/admin content max width: 1280px
- Narrow editorial content max width: 760px

Grid:

- Desktop marketing sections: 12 columns
- Tablet sections: 6 columns
- Mobile sections: 1 column

Spacing:

- Base step: 4px
- Section vertical spacing: 72-112px desktop, 48-72px mobile
- Card padding: 20-28px
- Admin panel padding: 16-24px
- Form field gap: 14-18px

Radius:

- Buttons: 6px
- Cards: 8px
- Inputs: 6px
- Badges: 999px only for small status chips
- Media: 8px

## Component Direction

### Buttons

Use icon + label when the action benefits from recognition, especially for quote, download, phone, WhatsApp, filter, search, and admin actions.

Primary:

- Deep Blue background
- White text
- Cyan focus ring

Secondary:

- White or transparent background
- Deep Blue text
- Border in light steel

Conversion CTA:

- Deep Blue or Engineering Navy
- Optional cyan edge or small animated shine, used sparingly

### Navigation

Public header:

- Sticky
- Clear logo presence
- Product mega menu
- Direct quote CTA
- Mobile sheet menu

Mega menu groups:

- Product Categories
- Industries
- Resources
- Company
- Quick actions

Admin navigation:

- Sidebar on desktop
- Sheet navigation on mobile
- Compact labels with icons
- Clear active state

### Cards

Cards are for repeated items and framed tools only:

- Product cards
- Industry cards
- Blog cards
- Certificate cards
- Dashboard summary cards
- Form panels

Avoid nested cards. Page sections should be full-width bands or unframed layouts.

### Forms

All forms must include:

- Accessible labels
- Clear validation states
- Inline error text
- Loading and success states
- Bot and abuse protection in later phases

Quote form should feel like a technical intake, not a generic contact form.

### Product Pages

Expected product page sections:

- Product hero with category, title, intro, quote CTA
- Key specifications
- Applications
- Industries served
- Product images
- Downloads
- Related products
- FAQs
- Request quote panel

### Admin UI

Use shadcn/ui primitives:

- Button
- Input
- Textarea
- Select
- Table
- Tabs
- Dialog
- AlertDialog
- Sheet
- DropdownMenu
- Badge
- Separator
- Skeleton
- Tooltip

Admin surfaces should default to a compact, work-focused design. Avoid marketing hero layouts inside the admin dashboard.

## Motion System

Motion should support clarity, not distract from the products.

Use Framer Motion for:

- Section reveals
- Counter transitions
- Menu open/close transitions
- Card hover lift
- Page transitions

Use GSAP only for:

- Hero video overlay sequencing
- High-value scroll storytelling
- Manufacturing process timeline if it needs advanced control

Timing:

- Micro interactions: 120-180ms
- Menus and sheets: 180-240ms
- Section reveals: 420-700ms
- Page transitions: 220-320ms

Accessibility:

- Respect `prefers-reduced-motion`.
- Do not animate essential content in a way that delays reading.

## Imagery and Video

Use real or realistic industrial filtration imagery:

- Manufacturing floor
- FRP vessels
- RO systems
- Membrane housings
- Pumps and valves
- Engineers inspecting equipment
- Water treatment plants
- Certificates and testing

Avoid:

- Generic water splashes as the main visual identity
- Overly dark cropped stock photos
- Decorative abstract blobs
- Product photos without clear object visibility

Hero video should be short, compressed, muted, and optional on slower connections.

## Accessibility Rules

- Maintain WCAG AA contrast.
- All images need meaningful alt text.
- Buttons and links need visible focus states.
- Forms need labels connected to controls.
- Navigation must be keyboard usable.
- Avoid text over busy media without sufficient overlay.
- All icon-only buttons need tooltips or accessible labels.

## SEO Content Style

Voice:

- Direct
- Technical without being cold
- Buyer-focused
- Specific to filtration and engineering outcomes

Avoid:

- Generic claims like "best quality products"
- AI-sounding phrases
- Overloaded buzzwords
- Copying product descriptions from the reference website

CTA examples:

- Request a Technical Quote
- Talk to a Filtration Engineer
- Download Product Data
- View Product Range
- Discuss Your Application

## Dark Mode

Dark mode should be available, but the default public website experience can be light. Dark sections will be used intentionally for contrast. The admin dashboard can default to a dark-capable theme with a user toggle in a later phase.

## Implementation Files Added

- `styles/globals.css`
- `tailwind.config.ts`
- `components.json`
- `lib/design-system.ts`
- `data/product-taxonomy.ts`

## Phase 2 Approval Checkpoint

After approval, Phase 3 will generate:

- Prisma schema
- Normalized PostgreSQL data model
- ER diagram
- Seed file
- Migration strategy
