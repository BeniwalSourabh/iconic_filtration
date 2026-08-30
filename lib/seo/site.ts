import { brand } from "@/lib/design-system";

export const siteConfig = {
  name: brand.name,
  shortName: brand.shortName,
  tagline: brand.tagline,
  description:
    "Premium water filtration components, engineering solutions, and industrial water-treatment support from ICONIC FILTRATION AND ENGINEERS LLP.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000",
  locale: "en_IN",
  logoPath: brand.logoPath,
  heroImagePath: "/images/homepage-filtration-hero-1600.jpg",
  keywords: [
    "water filtration",
    "water treatment components",
    "industrial water filtration",
    "RO components",
    "FRP vessels",
    "dosing pumps",
    "filter cartridges",
    "wastewater treatment equipment",
    "ICONIC Filtration",
  ],
} as const;

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, siteConfig.url).toString();
}

export function trimDescription(description: string, maxLength = 158) {
  if (description.length <= maxLength) {
    return description;
  }

  return `${description.slice(0, maxLength - 1).trimEnd()}.`;
}
