import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { productTaxonomy } from "../data/product-taxonomy";
import { hashPassword } from "../lib/auth/password";

const roles = [
  {
    key: "SUPER_ADMIN",
    name: "Super Admin",
    description: "Full access to users, settings, content, leads, and audit logs.",
    permissions: ["*"],
  },
  {
    key: "ADMIN",
    name: "Admin",
    description: "Manage website content, products, leads, media, and SEO.",
    permissions: [
      "dashboard:read",
      "products:*",
      "content:*",
      "leads:*",
      "media:*",
      "seo:*",
      "settings:read",
    ],
  },
  {
    key: "EDITOR",
    name: "Editor",
    description: "Manage public content, blogs, media, and SEO fields.",
    permissions: ["dashboard:read", "products:read", "content:*", "media:*", "seo:*"],
  },
  {
    key: "SALES",
    name: "Sales",
    description: "Manage quote requests, contact enquiries, and lead follow-up.",
    permissions: ["dashboard:read", "products:read", "leads:*"],
  },
  {
    key: "VIEWER",
    name: "Viewer",
    description: "Read-only access for reporting and review.",
    permissions: ["dashboard:read", "products:read", "content:read", "leads:read", "seo:read"],
  },
] as const;

const industries = [
  {
    slug: "water-treatment-companies",
    name: "Water Treatment Companies",
    shortDescription: "Components and assemblies for OEMs, EPCs, and treatment-system integrators.",
  },
  {
    slug: "industrial-plants",
    name: "Industrial Plants",
    shortDescription: "Reliable filtration and process-water support for continuous industrial operations.",
  },
  {
    slug: "pharmaceutical-industry",
    name: "Pharmaceutical Industry",
    shortDescription: "Water-treatment components for controlled, quality-focused production environments.",
  },
  {
    slug: "chemical-industry",
    name: "Chemical Industry",
    shortDescription: "Durable filtration and dosing support for chemical processing requirements.",
  },
  {
    slug: "food-beverage-industry",
    name: "Food and Beverage Industry",
    shortDescription: "Clean-water and process-water solutions for hygienic production lines.",
  },
  {
    slug: "commercial-buildings",
    name: "Commercial Buildings",
    shortDescription: "Water filtration and pressure-management support for building services.",
  },
  {
    slug: "oem-manufacturers",
    name: "OEM Manufacturers",
    shortDescription: "Consistent supply and technical support for manufacturers building water systems.",
  },
  {
    slug: "dealers-distributors",
    name: "Dealers and Distributors",
    shortDescription: "Catalog-ready products, documentation, and dependable fulfillment support.",
  },
  {
    slug: "government-projects",
    name: "Government Projects",
    shortDescription: "Structured product documentation and scalable supply for public-sector projects.",
  },
] as const;

const blogCategories = [
  {
    slug: "water-treatment-insights",
    name: "Water Treatment Insights",
    description: "Practical guidance for industrial and commercial water-treatment buyers.",
  },
  {
    slug: "product-guides",
    name: "Product Guides",
    description: "Selection, comparison, and usage notes for filtration components.",
  },
  {
    slug: "engineering-notes",
    name: "Engineering Notes",
    description: "Technical explainers from filtration, dosing, and RO applications.",
  },
] as const;

const homeFaqs = [
  {
    question: "What products does ICONIC FILTRATION AND ENGINEERS LLP supply?",
    answer:
      "ICONIC supplies water-treatment components, water-handling equipment, wastewater-treatment equipment, and engineering support for industrial, commercial, OEM, and project requirements.",
  },
  {
    question: "Can ICONIC support OEM and distributor requirements?",
    answer:
      "Yes. The website and admin system are structured to support product documentation, downloadable data, dealer enquiries, and quote workflows for OEMs and distributors.",
  },
  {
    question: "How can a buyer request a technical quote?",
    answer:
      "Buyers can submit a request with product category, application, capacity, location, timeline, and contact details. The admin dashboard will route those enquiries for follow-up.",
  },
] as const;

async function seedRoles(prisma: PrismaClient) {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { key: role.key },
      update: {
        name: role.name,
        description: role.description,
        permissions: [...role.permissions],
      },
      create: {
        key: role.key,
        name: role.name,
        description: role.description,
        permissions: [...role.permissions],
      },
    });
  }
}

async function seedAdminBootstrap(prisma: PrismaClient) {
  const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (!adminEmail) {
    return;
  }

  if (adminPassword && adminPassword.length < 12) {
    throw new Error("ADMIN_BOOTSTRAP_PASSWORD must be at least 12 characters when provided.");
  }

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      status: adminPassword ? "ACTIVE" : "INVITED",
      passwordHash: adminPassword ? await hashPassword(adminPassword) : undefined,
    },
    create: {
      email: adminEmail,
      name: "ICONIC Admin",
      status: adminPassword ? "ACTIVE" : "INVITED",
      passwordHash: adminPassword ? await hashPassword(adminPassword) : undefined,
    },
  });

  const superAdminRole = await prisma.role.findUniqueOrThrow({
    where: { key: "SUPER_ADMIN" },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: superAdminRole.id,
    },
  });
}

async function seedIndustries(prisma: PrismaClient) {
  const industryRecords = [];

  for (const [index, industry] of industries.entries()) {
    const record = await prisma.industry.upsert({
      where: { slug: industry.slug },
      update: {
        name: industry.name,
        shortDescription: industry.shortDescription,
        position: index + 1,
        status: "PUBLISHED",
      },
      create: {
        slug: industry.slug,
        name: industry.name,
        shortDescription: industry.shortDescription,
        position: index + 1,
        featured: index < 6,
        status: "PUBLISHED",
      },
    });

    industryRecords.push(record);
  }

  return industryRecords;
}

async function seedProductCatalog(prisma: PrismaClient, industryIds: string[]) {
  for (const [categoryIndex, family] of productTaxonomy.entries()) {
    const category = await prisma.productCategory.upsert({
      where: { slug: family.slug },
      update: {
        name: family.name,
        shortDescription: family.description,
        description: family.description,
        position: categoryIndex + 1,
        status: "PUBLISHED",
      },
      create: {
        slug: family.slug,
        name: family.name,
        shortDescription: family.description,
        description: family.description,
        position: categoryIndex + 1,
        status: "PUBLISHED",
      },
    });

    for (const [productIndex, product] of family.products.entries()) {
      const record = await prisma.product.upsert({
        where: { slug: product.slug },
        update: {
          categoryId: category.id,
          name: product.name,
          summary: product.applicationHint,
          description:
            `${product.name} supports ${product.applicationHint.toLowerCase()} ICONIC can enrich this page with final specifications, datasheets, and application details during content entry.`,
          position: productIndex + 1,
          status: "PUBLISHED",
          featured: productIndex < 4,
        },
        create: {
          categoryId: category.id,
          slug: product.slug,
          name: product.name,
          summary: product.applicationHint,
          description:
            `${product.name} supports ${product.applicationHint.toLowerCase()} ICONIC can enrich this page with final specifications, datasheets, and application details during content entry.`,
          applications: [],
          standards: [],
          position: productIndex + 1,
          status: "PUBLISHED",
          featured: productIndex < 4,
          publishedAt: new Date(),
        },
      });

      const industriesForProduct = industryIds.slice(0, 6);

      for (const industryId of industriesForProduct) {
        await prisma.productIndustry.upsert({
          where: {
            productId_industryId: {
              productId: record.id,
              industryId,
            },
          },
          update: {},
          create: {
            productId: record.id,
            industryId,
          },
        });
      }
    }
  }
}

async function seedBlogCategories(prisma: PrismaClient) {
  for (const [index, category] of blogCategories.entries()) {
    await prisma.blogCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        position: index + 1,
        status: "PUBLISHED",
      },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        position: index + 1,
        status: "PUBLISHED",
      },
    });
  }
}

async function seedFaqs(prisma: PrismaClient) {
  await prisma.faq.deleteMany({
    where: { pagePath: "/" },
  });

  await prisma.faq.createMany({
    data: homeFaqs.map((faq, index) => ({
      question: faq.question,
      answer: faq.answer,
      pagePath: "/",
      category: "Company",
      position: index + 1,
      status: "PUBLISHED",
    })),
  });
}

async function seedSeoMetadata(prisma: PrismaClient) {
  await prisma.seoMetadata.upsert({
    where: { path: "/" },
    update: {
      title: "ICONIC Filtration and Engineers LLP | Water Filtration Products India",
      description:
        "Premium water filtration components, water-handling equipment, wastewater-treatment equipment, and engineering support for industrial, commercial, OEM, and project buyers.",
      keywords: [
        "water filtration company India",
        "water treatment components",
        "RO components supplier",
        "industrial water filtration",
      ],
    },
    create: {
      path: "/",
      title: "ICONIC Filtration and Engineers LLP | Water Filtration Products India",
      description:
        "Premium water filtration components, water-handling equipment, wastewater-treatment equipment, and engineering support for industrial, commercial, OEM, and project buyers.",
      keywords: [
        "water filtration company India",
        "water treatment components",
        "RO components supplier",
        "industrial water filtration",
      ],
    },
  });

  await prisma.seoMetadata.upsert({
    where: { path: "/products" },
    update: {
      title: "Water Filtration Products | ICONIC Filtration and Engineers LLP",
      description:
        "Explore water-treatment components, water-handling equipment, and wastewater-treatment equipment for industrial and commercial applications.",
    },
    create: {
      path: "/products",
      title: "Water Filtration Products | ICONIC Filtration and Engineers LLP",
      description:
        "Explore water-treatment components, water-handling equipment, and wastewater-treatment equipment for industrial and commercial applications.",
    },
  });
}

async function seedSiteSettings(prisma: PrismaClient) {
  const settings = [
    {
      key: "company.name",
      label: "Company Name",
      group: "company",
      value: "ICONIC FILTRATION AND ENGINEERS LLP",
      valueType: "STRING",
      isPublic: true,
    },
    {
      key: "company.tagline",
      label: "Tagline",
      group: "company",
      value: "Filtration for Purity. Engineering for Life.",
      valueType: "STRING",
      isPublic: true,
    },
    {
      key: "brand.logo",
      label: "Primary Logo",
      group: "brand",
      value: "/brand/iconic-filtration-logo-384.png",
      valueType: "URL",
      isPublic: true,
    },
    {
      key: "leads.defaultSource",
      label: "Default Lead Source",
      group: "leads",
      value: "WEBSITE",
      valueType: "STRING",
      isPublic: false,
    },
  ] as const;

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {
        label: setting.label,
        group: setting.group,
        value: setting.value,
        valueType: setting.valueType,
        isPublic: setting.isPublic,
      },
      create: {
        key: setting.key,
        label: setting.label,
        group: setting.group,
        value: setting.value,
        valueType: setting.valueType,
        isPublic: setting.isPublic,
      },
    });
  }
}

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required before running the Prisma seed script.");
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    await seedRoles(prisma);
    await seedAdminBootstrap(prisma);
    const industryRecords = await seedIndustries(prisma);
    await seedProductCatalog(
      prisma,
      industryRecords.map((industry) => industry.id),
    );
    await seedBlogCategories(prisma);
    await seedFaqs(prisma);
    await seedSeoMetadata(prisma);
    await seedSiteSettings(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
