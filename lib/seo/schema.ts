import type { ProductRecord } from "@/data/product-taxonomy";
import { brand } from "@/lib/design-system";
import { absoluteUrl, siteConfig } from "@/lib/seo/site";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type BlogPostSchemaInput = {
  title: string;
  excerpt: string;
  publishedAt: string;
  slug: string;
  authorName?: string;
  featuredImage?: {
    path?: string;
    isPlaceholder?: boolean;
  };
};

type FaqSchemaInput = {
  question: string;
  answer: string;
};

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: brand.name,
    alternateName: brand.shortName,
    slogan: brand.tagline,
    url: absoluteUrl("/"),
    logo: absoluteUrl(siteConfig.logoPath),
    image: absoluteUrl(siteConfig.heroImagePath),
    description: siteConfig.description,
    sameAs: [],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    name: siteConfig.shortName,
    url: absoluteUrl("/"),
    publisher: {
      "@id": `${absoluteUrl("/")}#organization`,
    },
    inLanguage: "en-IN",
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productSchema(product: ProductRecord) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${absoluteUrl(`/products/${product.slug}`)}#product`,
    name: product.name,
    description: product.description,
    category: product.family.name,
    url: absoluteUrl(`/products/${product.slug}`),
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Industrial water-treatment buyers",
    },
    additionalProperty: product.selectionNotes.map((note) => ({
      "@type": "PropertyValue",
      name: "Selection note",
      value: note,
    })),
  };
}

export function articleSchema(post: BlogPostSchemaInput) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absoluteUrl(`/blog/${post.slug}`)}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    author: {
      "@type": "Organization",
      name: post.authorName ?? brand.name,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@id": `${absoluteUrl("/")}#organization`,
    },
  };

  if (post.featuredImage?.path && !post.featuredImage.isPlaceholder) {
    schema.image = absoluteUrl(post.featuredImage.path);
  }

  return schema;
}

export function faqSchema(faqs: FaqSchemaInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
