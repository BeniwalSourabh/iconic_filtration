import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/site-content";
import { companyPartners } from "@/data/company-partners";
import { productRecords, productTaxonomy } from "@/data/product-taxonomy";
import { absoluteUrl } from "@/lib/seo/site";

const staticRoutes = [
  "/",
  "/about",
  "/companies",
  "/products",
  "/industries",
  "/projects",
  "/gallery",
  "/certificates",
  "/downloads",
  "/blog",
  "/faqs",
  "/contact",
  "/request-quote",
  "/privacy-policy",
  "/terms",
  "/cookie-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const productFamilyRoutes = productTaxonomy.map((family) => `/products/${family.slug}`);
  const productRoutes = productRecords.map((product) => `/products/${product.slug}`);
  const blogRoutes = blogPosts.map((post) => `/blog/${post.slug}`);
  const companyRoutes = companyPartners.map((company) => `/companies/${company.slug}`);

  return [...staticRoutes, ...companyRoutes, ...productFamilyRoutes, ...productRoutes, ...blogRoutes].map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/products") || route.startsWith("/companies") ? 0.8 : 0.7,
  }));
}
