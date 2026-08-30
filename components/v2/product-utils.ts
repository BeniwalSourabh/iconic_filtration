import { getCompanyProductsForProduct } from "@/data/company-partners";
import type { ProductRecord } from "@/data/product-taxonomy";

export function getV2ProductImage(product: ProductRecord) {
  const companyProduct = getCompanyProductsForProduct(product.slug).find((item) => item.imagePath);

  if (companyProduct?.imagePath) {
    return {
      src: companyProduct.imagePath,
      alt: companyProduct.imageAlt ?? `${companyProduct.company.name} ${companyProduct.name} product image`,
    };
  }

  const imageMap: Record<string, { src: string; alt: string }> = {
    "ro-membranes": { src: "/partners/hydranautics/products/ld-technology-ro-membranes.webp", alt: "RO membrane elements" },
    "domestic-ro-membranes": { src: "/partners/hydranautics/products/ld-technology-ro-membranes.webp", alt: "Domestic RO membrane elements" },
    "ro-housings": { src: "/partners/dax/products/ro-pressure-vessels.webp", alt: "RO pressure vessels" },
    "frp-vessels": { src: "/partners/dax/products/pressure-vessel-accessories.webp", alt: "FRP vessel accessories" },
    "dosing-pumps": { src: "/partners/seko/products/kosmo-mm2-dosing-pump.webp", alt: "Industrial dosing pump" },
    "wastewater-dosing-systems": { src: "/partners/seko/products/tork-ty-dosing-pump.webp", alt: "Wastewater dosing pump" },
    "wastewater-filtration-systems": { src: "/partners/fenton/products/uf-8585-ultrafiltration-membrane.webp", alt: "Ultrafiltration membrane system" },
    "wastewater-accessories": { src: "/partners/fenton/products/compact-heavy-duty-oil-skimmer.webp", alt: "Wastewater treatment accessory" },
    "filter-cartridges": { src: "/blog/industrial-filtration-components.jpg", alt: "Industrial filtration components" },
    "high-pressure-pumps": { src: "/blog/dosing-pump-selection-fit.jpg", alt: "Industrial pump application" },
  };

  return imageMap[product.slug] ?? {
    src: "/images/homepage-filtration-hero-1600.jpg",
    alt: `${product.name} product application`,
  };
}

export function getV2ProductBrand(product: ProductRecord) {
  const companyProduct = getCompanyProductsForProduct(product.slug)[0];

  if (companyProduct?.company.name) {
    return companyProduct.company.name;
  }

  const name = product.name.toLowerCase();

  if (name.includes("dosing")) {
    return "SEKO";
  }

  if (name.includes("membrane")) {
    return "Hydranautics";
  }

  if (name.includes("housing") || name.includes("vessel")) {
    return "DAX";
  }

  return "ICONIC";
}

export function getV2RelatedProducts(product: ProductRecord, products: ProductRecord[], limit = 4) {
  return products.filter((item) => item.family.slug === product.family.slug && item.slug !== product.slug).slice(0, limit);
}
