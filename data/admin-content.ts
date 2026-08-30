import { productRecords, productTaxonomy } from "@/data/product-taxonomy";
import {
  blogPosts,
  caseStudies,
  certificateItems,
  downloadItems,
  faqs,
  galleryItems,
  industryPages,
  projectHighlights,
} from "@/data/site-content";

export type AdminMetric = {
  label: string;
  value: string;
  helper: string;
};

export type AdminColumn = {
  key: string;
  label: string;
};

export type AdminRow = Record<string, string>;

export type AdminSection = {
  key: string;
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  metrics: AdminMetric[];
  columns: AdminColumn[];
  rows: AdminRow[];
  workflow: string[];
  emptyState?: string;
};

const productRows = productRecords.slice(0, 8).map((product) => ({
  name: product.name,
  category: product.family.name,
  status: "Draft",
  updated: "Static seed",
}));

const categoryRows = productTaxonomy.map((family) => ({
  name: family.name,
  products: String(family.products.length),
  status: "Draft",
  updated: "Static seed",
}));

const blogRows = blogPosts.map((post) => ({
  title: post.title,
  category: post.category,
  status: "Published seed",
  updated: post.publishedAt,
}));

const galleryRows = galleryItems.map((item) => ({
  title: item.title,
  category: item.category,
  status: "Needs media",
  updated: "Awaiting upload",
}));

const certificateRows = certificateItems.map((item) => ({
  title: item.title,
  status: item.status,
  type: "Document",
  updated: "Awaiting approval",
}));

const downloadRows = downloadItems.map((item) => ({
  title: item.title,
  type: item.type,
  status: "File pending",
  updated: "Awaiting upload",
}));

const caseStudyRows = caseStudies.map((study) => ({
  title: study.title,
  industry: study.industry,
  status: "Draft proof",
  updated: "Static seed",
}));

const industryRows = industryPages.slice(0, 6).map((industry) => ({
  name: industry.name,
  needs: String(industry.needs.length),
  status: "Published seed",
  updated: "Static seed",
}));

const projectRows = projectHighlights.map((project) => ({
  title: project.title,
  industry: project.industry,
  status: "Draft proof",
  updated: "Static seed",
}));

export const adminSections: Record<string, AdminSection> = {
  products: {
    key: "products",
    href: "/admin/products",
    eyebrow: "Catalog",
    title: "Products",
    description: "Manage product records, product copy, applications, specifications, images, downloads, and related products.",
    primaryAction: "Add product",
    secondaryAction: "Import catalog",
    metrics: [
      { label: "Product records", value: String(productRecords.length), helper: "seeded from taxonomy" },
      { label: "Families", value: String(productTaxonomy.length), helper: "category groups" },
      { label: "Featured slots", value: "4", helper: "homepage-ready" },
      { label: "Status", value: "Draft", helper: "admin managed" },
    ],
    columns: [
      { key: "name", label: "Product" },
      { key: "category", label: "Category" },
      { key: "status", label: "Status" },
      { key: "updated", label: "Updated" },
    ],
    rows: productRows,
    workflow: ["Create product", "Attach images", "Add specifications", "Link downloads", "Review SEO", "Publish"],
  },
  categories: {
    key: "categories",
    href: "/admin/categories",
    eyebrow: "Catalog",
    title: "Categories",
    description: "Control product category hierarchy, descriptions, display order, and public publishing status.",
    primaryAction: "Add category",
    secondaryAction: "Reorder",
    metrics: [
      { label: "Categories", value: String(productTaxonomy.length), helper: "top-level groups" },
      { label: "Linked products", value: String(productRecords.length), helper: "catalog records" },
      { label: "Nested levels", value: "1", helper: "ready to expand" },
      { label: "Visibility", value: "Draft", helper: "approval needed" },
    ],
    columns: [
      { key: "name", label: "Category" },
      { key: "products", label: "Products" },
      { key: "status", label: "Status" },
      { key: "updated", label: "Updated" },
    ],
    rows: categoryRows,
    workflow: ["Create category", "Write description", "Assign icon", "Set display order", "Review public page", "Publish"],
  },
  blogs: {
    key: "blogs",
    href: "/admin/blogs",
    eyebrow: "Content",
    title: "Blogs",
    description: "Manage article drafts, blog categories, author information, publishing status, and SEO metadata.",
    primaryAction: "Write article",
    secondaryAction: "Manage categories",
    metrics: [
      { label: "Articles", value: String(blogPosts.length), helper: "public seeds" },
      { label: "Categories", value: "3", helper: "guide types" },
      { label: "SEO fields", value: "Ready", helper: "per post" },
      { label: "Workflow", value: "Review", helper: "before publish" },
    ],
    columns: [
      { key: "title", label: "Article" },
      { key: "category", label: "Category" },
      { key: "status", label: "Status" },
      { key: "updated", label: "Updated" },
    ],
    rows: blogRows,
    workflow: ["Draft article", "Assign category", "Add excerpt", "Review SEO", "Preview page", "Publish"],
  },
  gallery: {
    key: "gallery",
    href: "/admin/gallery",
    eyebrow: "Media",
    title: "Gallery",
    description: "Manage approved product, project, quality, and operations media with alt text and publishing controls.",
    primaryAction: "Upload media",
    secondaryAction: "Organize gallery",
    metrics: [
      { label: "Media slots", value: String(galleryItems.length), helper: "public categories" },
      { label: "Cloudinary", value: "Ready", helper: "model support" },
      { label: "Alt text", value: "Required", helper: "accessibility" },
      { label: "Approval", value: "Needed", helper: "before publish" },
    ],
    columns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "status", label: "Status" },
      { key: "updated", label: "Updated" },
    ],
    rows: galleryRows,
    workflow: ["Upload asset", "Write caption", "Add alt text", "Choose category", "Check consent", "Publish"],
  },
  certificates: {
    key: "certificates",
    href: "/admin/certificates",
    eyebrow: "Trust",
    title: "Certificates",
    description: "Manage certificates, compliance documents, issuing authorities, expiry dates, file URLs, and visibility.",
    primaryAction: "Add certificate",
    secondaryAction: "Review expiry",
    metrics: [
      { label: "Document groups", value: String(certificateItems.length), helper: "public sections" },
      { label: "Expiry tracking", value: "Ready", helper: "schema field" },
      { label: "File status", value: "Pending", helper: "approval needed" },
      { label: "Visibility", value: "Controlled", helper: "draft/publish" },
    ],
    columns: [
      { key: "title", label: "Document" },
      { key: "type", label: "Type" },
      { key: "status", label: "Status" },
      { key: "updated", label: "Updated" },
    ],
    rows: certificateRows,
    workflow: ["Add document", "Enter authority", "Set issue date", "Attach file", "Review accuracy", "Publish"],
  },
  downloads: {
    key: "downloads",
    href: "/admin/downloads",
    eyebrow: "Resources",
    title: "Downloads",
    description: "Manage brochures, datasheets, manuals, catalogs, gated files, versions, and product download links.",
    primaryAction: "Add download",
    secondaryAction: "Manage versions",
    metrics: [
      { label: "Download slots", value: String(downloadItems.length), helper: "public resources" },
      { label: "File types", value: "4", helper: "seeded groups" },
      { label: "Gated files", value: "Ready", helper: "schema support" },
      { label: "Versioning", value: "Ready", helper: "schema field" },
    ],
    columns: [
      { key: "title", label: "Download" },
      { key: "type", label: "Type" },
      { key: "status", label: "Status" },
      { key: "updated", label: "Updated" },
    ],
    rows: downloadRows,
    workflow: ["Upload file", "Choose type", "Add description", "Set version", "Link products", "Publish"],
  },
  testimonials: {
    key: "testimonials",
    href: "/admin/testimonials",
    eyebrow: "Trust",
    title: "Testimonials",
    description: "Manage approved customer quotes, industry links, ratings, display order, and public visibility.",
    primaryAction: "Add testimonial",
    secondaryAction: "Review consent",
    metrics: [
      { label: "Approved quotes", value: "0", helper: "awaiting real approvals" },
      { label: "Industry links", value: String(industryPages.length), helper: "ready to connect" },
      { label: "Ratings", value: "Ready", helper: "optional field" },
      { label: "Consent", value: "Required", helper: "before publish" },
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "company", label: "Company" },
      { key: "status", label: "Status" },
      { key: "updated", label: "Updated" },
    ],
    rows: [],
    workflow: ["Collect quote", "Confirm consent", "Add designation", "Link industry", "Review wording", "Publish"],
    emptyState: "No real customer testimonials are seeded yet. Add only approved public references.",
  },
  "quote-requests": {
    key: "quote-requests",
    href: "/admin/quote-requests",
    eyebrow: "Leads",
    title: "Quote Requests",
    description: "Review technical quote requests, product interest, application details, timeline, status, and sales assignment.",
    primaryAction: "Create quote",
    secondaryAction: "Export leads",
    metrics: [
      { label: "New requests", value: "0", helper: "live database" },
      { label: "Statuses", value: "8", helper: "lead pipeline" },
      { label: "Assignments", value: "Ready", helper: "sales user link" },
      { label: "Form", value: "Live", helper: "public route" },
    ],
    columns: [
      { key: "name", label: "Contact" },
      { key: "product", label: "Product interest" },
      { key: "status", label: "Status" },
      { key: "updated", label: "Received" },
    ],
    rows: [],
    workflow: ["Review request", "Qualify details", "Assign owner", "Contact buyer", "Send proposal", "Close status"],
    emptyState: "Quote submissions will appear here after PostgreSQL is connected and the public form receives entries.",
  },
  "contact-enquiries": {
    key: "contact-enquiries",
    href: "/admin/contact-enquiries",
    eyebrow: "Leads",
    title: "Contact Enquiries",
    description: "Review website contact messages, document requests, support questions, lead status, and assignment.",
    primaryAction: "Add enquiry",
    secondaryAction: "Export contacts",
    metrics: [
      { label: "New messages", value: "0", helper: "live database" },
      { label: "Statuses", value: "8", helper: "lead pipeline" },
      { label: "Consent", value: "Captured", helper: "public form" },
      { label: "Assignment", value: "Ready", helper: "user link" },
    ],
    columns: [
      { key: "name", label: "Contact" },
      { key: "subject", label: "Subject" },
      { key: "status", label: "Status" },
      { key: "updated", label: "Received" },
    ],
    rows: [],
    workflow: ["Read enquiry", "Check intent", "Assign owner", "Reply", "Update status", "Archive when closed"],
    emptyState: "Contact messages will appear here after PostgreSQL is connected and public enquiries are submitted.",
  },
  seo: {
    key: "seo",
    href: "/admin/seo",
    eyebrow: "Search",
    title: "SEO",
    description: "Manage meta titles, descriptions, canonical URLs, Open Graph data, schema JSON, and indexing controls.",
    primaryAction: "Add metadata",
    secondaryAction: "Audit pages",
    metrics: [
      { label: "Public pages", value: "30+", helper: "phase 7 routes" },
      { label: "Product pages", value: String(productRecords.length), helper: "SSG generated" },
      { label: "Blog pages", value: String(blogPosts.length), helper: "SSG generated" },
      { label: "Schema", value: "Phase 9", helper: "next workflow" },
    ],
    columns: [
      { key: "path", label: "Path" },
      { key: "title", label: "Title" },
      { key: "status", label: "Status" },
      { key: "updated", label: "Updated" },
    ],
    rows: [
      { path: "/", title: "Homepage", status: "Metadata set", updated: "Phase 6" },
      { path: "/products", title: "Products", status: "Metadata set", updated: "Phase 7" },
      { path: "/blog", title: "Blog", status: "Metadata set", updated: "Phase 7" },
      { path: "/request-quote", title: "Request Quote", status: "Metadata set", updated: "Phase 7" },
    ],
    workflow: ["Audit route", "Write title", "Write description", "Add OG data", "Add schema", "Submit sitemap"],
  },
  settings: {
    key: "settings",
    href: "/admin/settings",
    eyebrow: "Configuration",
    title: "Settings",
    description: "Manage public contact details, analytics IDs, social links, business information, and website defaults.",
    primaryAction: "Add setting",
    secondaryAction: "Review public values",
    metrics: [
      { label: "Setting groups", value: "5", helper: "general/contact/seo/social/forms" },
      { label: "Public values", value: "Ready", helper: "schema support" },
      { label: "Types", value: "7", helper: "string/json/url/email" },
      { label: "Audit", value: "Ready", helper: "log model" },
    ],
    columns: [
      { key: "key", label: "Key" },
      { key: "group", label: "Group" },
      { key: "status", label: "Status" },
      { key: "updated", label: "Updated" },
    ],
    rows: [
      { key: "site.name", group: "general", status: "Seeded", updated: "Brand file" },
      { key: "contact.email", group: "contact", status: "Needed", updated: "Before launch" },
      { key: "analytics.ga4", group: "analytics", status: "Needed", updated: "Phase 9" },
      { key: "cloudinary.folder", group: "media", status: "Needed", updated: "Before uploads" },
    ],
    workflow: ["Add key", "Choose value type", "Mark public/private", "Validate value", "Save setting", "Audit change"],
  },
  users: {
    key: "users",
    href: "/admin/users",
    eyebrow: "Access control",
    title: "Users",
    description: "Manage admin users, role assignments, account status, invitation state, and access boundaries.",
    primaryAction: "Invite user",
    secondaryAction: "Review roles",
    metrics: [
      { label: "Roles", value: "5", helper: "permission levels" },
      { label: "Status values", value: "4", helper: "user lifecycle" },
      { label: "Auth", value: "Active", helper: "Auth.js foundation" },
      { label: "Audit", value: "Ready", helper: "login events" },
    ],
    columns: [
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
      { key: "status", label: "Status" },
      { key: "updated", label: "Last login" },
    ],
    rows: [],
    workflow: ["Invite user", "Assign role", "Activate account", "Review permissions", "Monitor login", "Suspend when needed"],
    emptyState: "Users will appear after database setup and seed/admin invitations are completed.",
  },
  "case-studies": {
    key: "case-studies",
    href: "/admin/case-studies",
    eyebrow: "Content",
    title: "Case Studies",
    description: "Manage challenge-solution-outcome stories, industry links, project references, status, and publishing controls.",
    primaryAction: "Add case study",
    secondaryAction: "Link project",
    metrics: [
      { label: "Case studies", value: String(caseStudies.length), helper: "approved records" },
      { label: "Project links", value: "Pending", helper: "requires approved projects" },
      { label: "Industries", value: String(industryPages.length), helper: "linkable segments" },
      { label: "Approval", value: "Required", helper: "before claims" },
    ],
    columns: [
      { key: "title", label: "Case study" },
      { key: "industry", label: "Industry" },
      { key: "status", label: "Status" },
      { key: "updated", label: "Updated" },
    ],
    rows: caseStudyRows,
    workflow: ["Draft story", "Link project", "Confirm facts", "Add outcome", "Review consent", "Publish"],
  },
  projects: {
    key: "projects",
    href: "/admin/projects",
    eyebrow: "Proof",
    title: "Projects",
    description: "Manage application highlights, client-approved references, locations, industries, images, and case-study links.",
    primaryAction: "Add project",
    secondaryAction: "Attach images",
    metrics: [
      { label: "Published projects", value: String(projectHighlights.length), helper: "approved records" },
      { label: "Images", value: "Pending", helper: "requires approved media" },
      { label: "Industries", value: String(industryPages.length), helper: "linkable segments" },
      { label: "Consent", value: "Required", helper: "client references" },
    ],
    columns: [
      { key: "title", label: "Project" },
      { key: "industry", label: "Industry" },
      { key: "status", label: "Status" },
      { key: "updated", label: "Updated" },
    ],
    rows: projectRows,
    workflow: ["Create project", "Add industry", "Write summary", "Attach images", "Link case study", "Publish"],
  },
  industries: {
    key: "industries",
    href: "/admin/industries",
    eyebrow: "Segments",
    title: "Industries",
    description: "Manage target industries, buyer needs, product links, SEO copy, and public visibility.",
    primaryAction: "Add industry",
    secondaryAction: "Map products",
    metrics: [
      { label: "Industries", value: String(industryPages.length), helper: "target segments" },
      { label: "Needs mapped", value: String(industryPages.reduce((total, item) => total + item.needs.length, 0)), helper: "buyer signals" },
      { label: "Product links", value: "Ready", helper: "schema support" },
      { label: "SEO pages", value: "Ready", helper: "future expansion" },
    ],
    columns: [
      { key: "name", label: "Industry" },
      { key: "needs", label: "Buyer needs" },
      { key: "status", label: "Status" },
      { key: "updated", label: "Updated" },
    ],
    rows: industryRows,
    workflow: ["Create industry", "Write summary", "Map buyer needs", "Link products", "Review SEO", "Publish"],
  },
  faqs: {
    key: "faqs",
    href: "/admin/faqs",
    eyebrow: "Support",
    title: "FAQs",
    description: "Manage global, page-specific, and product-specific questions for buyers and SEO schema.",
    primaryAction: "Add FAQ",
    secondaryAction: "Assign page",
    metrics: [
      { label: "FAQs", value: String(faqs.length), helper: "public seeds" },
      { label: "Page links", value: "Ready", helper: "schema field" },
      { label: "Product links", value: "Ready", helper: "schema relation" },
      { label: "Schema", value: "Phase 9", helper: "next workflow" },
    ],
    columns: [
      { key: "question", label: "Question" },
      { key: "page", label: "Page" },
      { key: "status", label: "Status" },
      { key: "updated", label: "Updated" },
    ],
    rows: faqs.slice(0, 5).map((faq) => ({
      question: faq.question,
      page: "Global",
      status: "Published seed",
      updated: "Phase 7",
    })),
    workflow: ["Write question", "Add answer", "Assign page", "Set order", "Review schema", "Publish"],
  },
};

export const adminDashboardModules = [
  adminSections.products,
  adminSections.categories,
  adminSections.industries,
  adminSections.projects,
  adminSections["case-studies"],
  adminSections.blogs,
  adminSections.faqs,
  adminSections.gallery,
  adminSections.certificates,
  adminSections.downloads,
  adminSections.testimonials,
  adminSections["quote-requests"],
  adminSections["contact-enquiries"],
  adminSections.seo,
  adminSections.settings,
  adminSections.users,
];
