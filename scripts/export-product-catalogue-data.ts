import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { companyContact } from "../data/company-contact";
import { companyPartners, getCompanyProductsForProduct } from "../data/company-partners";
import type { CompanyProductMatch } from "../data/company-partners";
import { productRecords, productTaxonomy } from "../data/product-taxonomy";
import { brand } from "../lib/design-system";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://iconic-filtration.vercel.app";
const outputPath = join(process.cwd(), "output", "source", "iconic-product-catalogue-data.json");

function absoluteUrl(path: string) {
  return new URL(path.startsWith("/") ? path : `/${path}`, siteUrl).toString();
}

function firstDefined<T>(values: Array<T | undefined>) {
  return values.find(Boolean);
}

function categoryImage(slug: string) {
  const mapped: Record<string, string> = {
    "ro-membranes": "/partners/hydranautics/products/ld-technology-ro-membranes.webp",
    "domestic-ro-membranes": "/partners/hydranautics/products/ld-technology-ro-membranes.webp",
    "ro-housings": "/partners/dax/products/ro-pressure-vessels.webp",
    "dosing-pumps": "/partners/seko/products/kosmo-mm2-dosing-pump.webp",
    "wastewater-filtration-systems": "/partners/fenton/products/uf-8585-ultrafiltration-membrane.webp",
    "wastewater-accessories": "/partners/fenton/products/compact-heavy-duty-oil-skimmer.webp",
    "filter-cartridges": "/blog/industrial-filtration-components.jpg",
    "frp-vessels": "/partners/dax/products/ro-pressure-vessels.webp",
  };

  return mapped[slug] ?? "/images/homepage-filtration-hero-1600.jpg";
}

function relatedProducts(slug: string) {
  const current = productRecords.find((product) => product.slug === slug);

  if (!current) {
    return [];
  }

  return productRecords
    .filter((product) => product.slug !== slug && product.family.slug === current.family.slug)
    .slice(0, 4)
    .map((product) => product.name);
}

function compatibleProducts(productSlug?: string) {
  if (!productSlug) {
    return [];
  }

  const product = productRecords.find((item) => item.slug === productSlug);

  return product ? relatedProducts(product.slug) : [];
}

const partnerProducts = companyPartners.flatMap((company) =>
  company.categories.flatMap((category) =>
    category.products.map((product) => ({
      ...product,
      company,
      category,
    })),
  ),
);

const categories = productRecords.map((product) => {
  const matchedProducts = getCompanyProductsForProduct(product.slug);

  return {
    slug: product.slug,
    name: product.name,
    description: product.applicationHint || product.description,
    imagePath: categoryImage(product.slug),
    productCount: matchedProducts.length || 1,
    pageUrl: absoluteUrl(`/products/${product.slug}`),
  };
});

const genericProductPages = productRecords.map((product) => {
  const matchedProducts = getCompanyProductsForProduct(product.slug);
  const imagePath = firstDefined(matchedProducts.map((item) => item.imagePath)) ?? categoryImage(product.slug);

  return {
    id: `category-${product.slug}`,
    type: "category-product",
    name: product.name,
    brand: matchedProducts.length ? "Multiple brands available" : undefined,
    modelNumber: undefined,
    description: product.description,
    imagePath,
    category: product.family.name,
    productPageUrl: absoluteUrl(`/products/${product.slug}`),
    quoteUrl: absoluteUrl(`/request-quote?product=${encodeURIComponent(product.name)}`),
    keyFeatures: product.selectionNotes,
    applications: product.applications,
    technicalSpecifications: [],
    variants: matchedProducts.map((item) => item.name).slice(0, 8),
    compatibleProducts: relatedProducts(product.slug),
    relatedProducts: matchedProducts.map((item) => `${item.company.name} ${item.name}`).slice(0, 5),
  };
});

const brandProductPages = partnerProducts.map((product) => {
  const matchedTaxonomy = product.productSlug ? productRecords.find((record) => record.slug === product.productSlug) : undefined;
  const productUrl = absoluteUrl(`/companies/${product.company.slug}`);

  return {
    id: `brand-${product.company.slug}-${product.slug}`,
    type: "brand-product",
    name: product.name,
    brand: product.company.name,
    modelNumber: undefined,
    description: product.description ?? matchedTaxonomy?.description ?? product.category.description,
    imagePath: product.imagePath ?? categoryImage(product.productSlug ?? ""),
    category: product.category.name,
    productPageUrl: productUrl,
    quoteUrl: absoluteUrl(`/request-quote?product=${encodeURIComponent(product.name)}`),
    keyFeatures: matchedTaxonomy?.selectionNotes ?? [],
    applications: product.applications ?? matchedTaxonomy?.applications ?? [],
    technicalSpecifications: [],
    variants: [],
    compatibleProducts: compatibleProducts(product.productSlug),
    relatedProducts: getCompanyProductsForProduct(product.productSlug ?? "")
      .filter((item: CompanyProductMatch) => item.slug !== product.slug)
      .slice(0, 5)
      .map((item: CompanyProductMatch) => `${item.company.name} ${item.name}`),
  };
});

const data = {
  generatedAt: new Date().toISOString(),
  siteUrl,
  brand: {
    companyName: brand.name,
    logoPath: brand.logoPath,
    title: "Product Catalogue",
    tagline: "Premium Water Filtration Products & Engineering Solutions",
  },
  contact: {
    website: siteUrl,
    phone: companyContact.phoneDisplay,
    email: companyContact.email,
    whatsapp: companyContact.phoneDisplay,
    quoteUrl: absoluteUrl("/request-quote"),
    contactUrl: absoluteUrl("/contact"),
    offices: companyContact.offices.map((office) => ({
      title: office.title,
      lines: office.lines,
    })),
  },
  categoryGroups: productTaxonomy.map((family) => ({
    slug: family.slug,
    name: family.name,
    description: family.description,
    productCount: family.products.length,
  })),
  categories,
  products: [...genericProductPages, ...brandProductPages],
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Product catalogue data exported to ${outputPath}`);
