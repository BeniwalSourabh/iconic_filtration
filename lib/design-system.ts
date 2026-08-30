export const brand = {
  name: "ICONIC FILTRATION AND ENGINEERS LLP",
  shortName: "ICONIC",
  tagline: "Filtration for Purity. Engineering for Life.",
  logoPath: "/brand/iconic-filtration-logo-384.png",
} as const;

export const colors = {
  deepBlue: "#05306F",
  engineeringNavy: "#071A33",
  processCyan: "#18BFE7",
  purityGreen: "#2E8B24",
  qualityGold: "#C99A2E",
  graphite: "#202832",
  steel: "#64748B",
  mist: "#F4F8FB",
  white: "#FFFFFF",
  border: "#D8E2EA",
} as const;

export const typography = {
  heading: "Poppins",
  body: "Inter",
  scale: {
    heroDesktop: "52px-76px",
    heroMobile: "38px-46px",
    h2Desktop: "36px-48px",
    h2Mobile: "30px-36px",
    h3: "24px-32px",
    body: "16px-18px",
    ui: "13px-14px",
  },
} as const;

export const radii = {
  button: "6px",
  card: "8px",
  input: "6px",
  media: "8px",
  badge: "999px",
} as const;

export const layout = {
  marketingMaxWidth: "1180px",
  operationalMaxWidth: "1280px",
  editorialMaxWidth: "760px",
  sectionYDesktop: "72px-112px",
  sectionYMobile: "48px-72px",
} as const;

export const motion = {
  micro: "120ms-180ms",
  menu: "180ms-240ms",
  reveal: "420ms-700ms",
  page: "220ms-320ms",
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

export const publicNavigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Projects", href: "/projects" },
  { label: "Resources", href: "/downloads" },
  { label: "Contact", href: "/contact" },
] as const;

export const adminNavigation = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Industries", href: "/admin/industries" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Case Studies", href: "/admin/case-studies" },
  { label: "Blogs", href: "/admin/blogs" },
  { label: "FAQs", href: "/admin/faqs" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Certificates", href: "/admin/certificates" },
  { label: "Downloads", href: "/admin/downloads" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Quote Requests", href: "/admin/quote-requests" },
  { label: "Contact Enquiries", href: "/admin/contact-enquiries" },
  { label: "SEO", href: "/admin/seo" },
  { label: "Settings", href: "/admin/settings" },
  { label: "Users", href: "/admin/users" },
] as const;
