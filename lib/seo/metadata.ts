import type { Metadata } from "next";
import { absoluteUrl, siteConfig, trimDescription } from "@/lib/seo/site";

export function createPageMetadata({
  title,
  description,
  path,
  imagePath = siteConfig.heroImagePath,
  keywords = [],
  type = "website",
  publishedTime,
}: {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const cleanDescription = trimDescription(description);
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(imagePath);

  return {
    title,
    description: cleanDescription,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: cleanDescription,
      url,
      siteName: siteConfig.shortName,
      locale: siteConfig.locale,
      type,
      publishedTime,
      images: [
        {
          url: imageUrl,
          width: 1725,
          height: 912,
          alt: `${siteConfig.shortName} water filtration systems`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cleanDescription,
      images: [imageUrl],
    },
  };
}
