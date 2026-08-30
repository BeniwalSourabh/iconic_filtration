export type CompanyCatalogProduct = {
  slug: string;
  name: string;
  description?: string;
  imagePath?: string;
  imageAlt?: string;
  productSlug?: string;
  applications?: string[];
  catalogFiles?: CompanyCatalogFile[];
};

export type CompanyCatalogFile = {
  label: string;
  path: string;
};

export type CompanyCatalogCategory = {
  slug: string;
  name: string;
  description: string;
  products: CompanyCatalogProduct[];
};

export type CompanyPartner = {
  slug: string;
  name: string;
  logoPath: string;
  logoAlt: string;
  summary: string;
  catalogPath?: string;
  catalogLabel?: string;
  catalogFiles?: CompanyCatalogFile[];
  catalogStatus: "logo-only" | "catalog-ready";
  categories: CompanyCatalogCategory[];
};

export type CompanyProductMatch = CompanyCatalogProduct & {
  company: Pick<CompanyPartner, "slug" | "name" | "logoPath" | "logoAlt">;
  category: Pick<CompanyCatalogCategory, "slug" | "name" | "description">;
};

export const maxCompanyPartners = 6;

const allCompanyPartners: CompanyPartner[] = [
  {
    slug: "chemsel",
    name: "CHEMSEL",
    logoPath: "/partners/chemsel/logo.jpeg",
    logoAlt: "CHEMSEL company logo",
    summary:
      "CHEMSEL Agencies is associated with water and wastewater treatment solutions including RO plants, effluent treatment plants, industrial evaporators, Hydranautics membranes, RO antiscalant, MBBR media, and allied treatment products for industrial applications.",
    catalogStatus: "logo-only",
    categories: [],
  },
  {
    slug: "nextgen",
    name: "NEXTGEN Envirotech",
    logoPath: "/partners/nextgen/logo.png",
    logoAlt: "NEXTGEN Envirotech company logo",
    summary:
      "NEXTGEN Envirotech electromagnetic flow meter catalogue for conductive liquids, acids, alkalies, water, pulps, slurries, and industrial flow measurement applications.",
    catalogPath: "/catalogs/nextgen-nget-electromagnetic-flow-meter.pdf",
    catalogLabel: "View NEXTGEN NGET electromagnetic flow meter catalogue",
    catalogStatus: "catalog-ready",
    categories: [
      {
        slug: "electromagnetic-flow-meters",
        name: "Electromagnetic Flow Meters",
        description:
          "Instrumentation for measuring flow in conductive liquids across water, wastewater, chemical, pharmaceutical, textile, pulp and paper, and industrial process applications.",
        products: [
          {
            slug: "nget-electromagnetic-flow-meter",
            name: "NGET Electromagnetic Flow Meter",
            description:
              "Electromagnetic flow meter for conductive liquids, acids, alkalies, water, pulps, and slurries, with integral or remote display options and broad line-size coverage from 15 NB to 350 NB.",
            imagePath: "/partners/nextgen/products/electromagnetic-flow-meter.webp",
            imageAlt: "NEXTGEN NGET electromagnetic flow meter product image",
            productSlug: "ro-controller-instruments",
            catalogFiles: [{ label: "NGET electromagnetic flow meter catalogue", path: "/catalogs/nextgen-nget-electromagnetic-flow-meter.pdf" }],
            applications: [
              "Water and wastewater treatment",
              "Effluent treatment plants",
              "Chemical and pharmaceutical industries",
              "Food and beverage industry",
              "Textile industry",
              "Cooling water flow measurement",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "seko",
    name: "SEKO",
    logoPath: "/partners/seko/logo.png",
    logoAlt: "SEKO company logo",
    summary:
      "SEKO motor-driven dosing pump catalog for water and industrial applications, including heavy-duty hydraulic diaphragm, mechanical diaphragm, plunger piston, and electronically controlled pump series.",
    catalogPath: "/catalogs/seko-water-industry-motor-pumps-2026.pdf",
    catalogLabel: "View SEKO motor pumps catalog",
    catalogStatus: "catalog-ready",
    categories: [
      {
        slug: "hydraulic-diaphragm-dosing-pumps",
        name: "Hydraulic Diaphragm Dosing Pumps",
        description:
          "Heavy-duty dosing pumps for demanding water-treatment, industrial, chemical, pharmaceutical, and pulp and paper applications.",
        products: [
          {
            slug: "tork-ty",
            name: "Tork TY",
            description: "Hydraulic double diaphragm dosing pump with flow range up to 3,740 l/h and pressure up to 40 bar.",
            imagePath: "/partners/seko/products/tork-ty-dosing-pump.webp",
            imageAlt: "SEKO Tork TY hydraulic double diaphragm dosing pump official product image",
            productSlug: "dosing-pumps",
            applications: ["Municipal water treatment", "Industrial water treatment", "Chemical industry", "Pharmaceutical"],
          },
        ],
      },
      {
        slug: "mechanical-diaphragm-dosing-pumps",
        name: "Mechanical Diaphragm Dosing Pumps",
        description:
          "Motor-driven diaphragm pump series for reliable chemical dosing across water-treatment and industrial process duties.",
        products: [
          {
            slug: "kosmo-mm2",
            name: "Kosmo MM2",
            description: "Mechanical diaphragm dosing pump for higher output requirements, with flow rates up to 2,300 l/h.",
            imagePath: "/partners/seko/products/kosmo-mm2-dosing-pump.webp",
            imageAlt: "SEKO Kosmo MM2 mechanical diaphragm dosing pump official product image",
            productSlug: "dosing-pumps",
            applications: ["Water treatment", "Industrial dosing", "Chemical dosing"],
          },
          {
            slug: "kosmo-mm1",
            name: "Kosmo MM1",
            description: "Compact mechanical diaphragm dosing pump for lower to medium flow chemical dosing applications.",
            imagePath: "/partners/seko/products/kosmo-mm1-dosing-pump.webp",
            imageAlt: "SEKO Kosmo MM1 compact mechanical diaphragm dosing pump official product image",
            productSlug: "dosing-pumps",
            applications: ["Water treatment", "Process dosing", "Chemical handling"],
          },
          {
            slug: "spring-ms1-avs",
            name: "Spring MS1 AVS",
            description: "Spring-return diaphragm pump with Assisted Vacuum System for improved suction performance.",
            imagePath: "/partners/seko/products/spring-ms1-avs-dosing-pump.webp",
            imageAlt: "SEKO Spring MS1 AVS spring-return diaphragm dosing pump official product image",
            productSlug: "dosing-pumps",
            applications: ["Chemical dosing", "Industrial water treatment", "Process control"],
          },
          {
            slug: "spring-ms1",
            name: "Spring MS1",
            description: "Spring-return mechanical diaphragm dosing pump available with single or multiple head configurations.",
            imagePath: "/partners/seko/products/spring-ms1-dosing-pump.webp",
            imageAlt: "SEKO Spring MS1 mechanical diaphragm dosing pump official product image",
            productSlug: "dosing-pumps",
            applications: ["Water treatment", "Chemical dosing", "Industrial dosing"],
          },
          {
            slug: "spring-msv",
            name: "Spring MSV",
            description: "Vertical-motor spring-return diaphragm dosing pump for adaptable dosing applications.",
            imagePath: "/partners/seko/products/spring-msv-dosing-pump.webp",
            imageAlt: "SEKO Spring MSV vertical motor diaphragm dosing pump official product image",
            productSlug: "dosing-pumps",
            applications: ["Water treatment", "Industrial dosing", "Chemical dosing"],
          },
          {
            slug: "spring-with-elektra",
            name: "Spring with Elektra",
            description: "Spring pump with electronic control for proportional dosing, local programming, Wi-Fi, and Modbus communication.",
            imagePath: "/partners/seko/products/spring-elektra-dosing-pump.webp",
            imageAlt: "SEKO Spring with Elektra electronic dosing pump official product image",
            productSlug: "dosing-pumps",
            applications: ["Proportional dosing", "Remote dosing control", "Industrial automation"],
          },
        ],
      },
      {
        slug: "plunger-piston-dosing-pumps",
        name: "Plunger Piston Dosing Pumps",
        description:
          "Spring-return plunger piston dosing pumps for applications requiring robust dosing and higher pressure capability.",
        products: [
          {
            slug: "spring-ps2",
            name: "Spring PS2",
            description: "Spring-return plunger piston dosing pump for reliable motor-driven chemical dosing.",
            imagePath: "/partners/seko/products/spring-ps2-dosing-pump.webp",
            imageAlt: "SEKO Spring PS2 plunger piston dosing pump official product image",
            productSlug: "dosing-pumps",
            applications: ["Water treatment", "High pressure dosing", "Industrial dosing"],
          },
          {
            slug: "spring-ps2-hp",
            name: "Spring PS2 HP",
            description: "High-pressure Spring plunger piston dosing pump variant designed for demanding pressure applications.",
            imagePath: "/partners/seko/products/spring-ps2-hp-dosing-pump.webp",
            imageAlt: "SEKO Spring PS2 HP high pressure plunger piston dosing pump official product image",
            productSlug: "dosing-pumps",
            applications: ["High pressure dosing", "Industrial process dosing", "Chemical injection"],
          },
          {
            slug: "spring-ps1",
            name: "Spring PS1",
            description: "Spring-return plunger piston dosing pump for compact and dependable dosing duties.",
            imagePath: "/partners/seko/products/spring-ps1-dosing-pump.webp",
            imageAlt: "SEKO Spring PS1 plunger piston dosing pump official product image",
            productSlug: "dosing-pumps",
            applications: ["Chemical dosing", "Water treatment", "Industrial utilities"],
          },
        ],
      },
    ],
  },
  {
    slug: "hydranautics",
    name: "Hydranautics",
    logoPath: "/partners/hydranautics/logo.png",
    logoAlt: "Hydranautics company logo",
    summary:
      "Hydranautics membrane catalogs for LD Technology, CPA Family, and PRO Series applications, including low-fouling RO membranes, high-rejection CPA membranes, and specialty membranes for challenging industrial wastewater.",
    catalogPath: "/catalogs/hydranautics-ld-technology.pdf",
    catalogLabel: "View Hydranautics LD Technology catalog",
    catalogFiles: [
      { label: "View Hydranautics LD Technology catalog", path: "/catalogs/hydranautics-ld-technology.pdf" },
      { label: "View Hydranautics LD Technology e-brochure", path: "/catalogs/hydranautics-ld-tech-e-brochure.pdf" },
      { label: "View Hydranautics CPA Family brochure", path: "/catalogs/hydranautics-cpa-family-brochure.pdf" },
      { label: "View Hydranautics PRO Series brochure", path: "/catalogs/hydranautics-pro-series-brochure.pdf" },
    ],
    catalogStatus: "catalog-ready",
    categories: [
      {
        slug: "ld-technology-ro-membranes",
        name: "LD Technology RO Membranes",
        description:
          "Low differential membrane technology for applications where reduced fouling, stable salt rejection, and improved cleaning behavior are important.",
        products: [
          {
            slug: "cpa-ld-membranes",
            name: "CPA Membranes with LD Technology",
            description: "High purity RO membranes for power generation, semiconductor, and pharmaceutical water applications.",
            imagePath: "/partners/hydranautics/products/ld-technology-ro-membranes.webp",
            imageAlt: "Hydranautics CPA membrane elements with LD Technology official product image",
            productSlug: "ro-membranes",
            catalogFiles: [
              { label: "CPA Family brochure", path: "/catalogs/hydranautics-cpa-family-brochure.pdf" },
              { label: "LD Technology brochure", path: "/catalogs/hydranautics-ld-tech-e-brochure.pdf" },
            ],
            applications: ["Power generation", "Semiconductor ultrapure water", "Pharmaceutical water"],
          },
          {
            slug: "espa-ld-membranes",
            name: "ESPA Membranes with LD Technology",
            description: "Energy-saving RO membranes for water-treatment applications including wastewater, bottled water, and treated sewage effluent.",
            imagePath: "/partners/hydranautics/products/ld-technology-ro-membranes.webp",
            imageAlt: "Hydranautics ESPA membrane elements with LD Technology official product image",
            productSlug: "ro-membranes",
            catalogFiles: [{ label: "LD Technology brochure", path: "/catalogs/hydranautics-ld-tech-e-brochure.pdf" }],
            applications: ["Wastewater treatment", "Bottled water", "Food and beverage", "TSE treatment"],
          },
          {
            slug: "swc-ld-membranes",
            name: "SWC Membranes with LD Technology",
            description: "Seawater RO membranes for desalination and boron reduction applications with varying seawater salinities.",
            imagePath: "/partners/hydranautics/products/ld-technology-ro-membranes.webp",
            imageAlt: "Hydranautics SWC membrane elements with LD Technology official product image",
            productSlug: "ro-membranes",
            catalogFiles: [{ label: "LD Technology brochure", path: "/catalogs/hydranautics-ld-tech-e-brochure.pdf" }],
            applications: ["Seawater desalination", "Hybrid desalination", "Boron reduction"],
          },
          {
            slug: "lfc-ld-membranes",
            name: "LFC Membranes with LD Technology",
            description: "Low fouling membranes for municipal and industrial wastewater with organic fouling potential.",
            imagePath: "/partners/hydranautics/products/ld-technology-ro-membranes.webp",
            imageAlt: "Hydranautics LFC membrane elements with LD Technology official product image",
            productSlug: "ro-membranes",
            catalogFiles: [{ label: "LD Technology brochure", path: "/catalogs/hydranautics-ld-tech-e-brochure.pdf" }],
            applications: ["Municipal wastewater", "Industrial wastewater", "High fouling feed water"],
          },
        ],
      },
      {
        slug: "pro-series-specialty-membranes",
        name: "PRO Series Specialty Membranes",
        description:
          "Specialty membrane products for challenging industrial wastewater, ZLD, and MLD applications where wastewater recovery and treatment performance are important.",
        products: [
          {
            slug: "pro-series-membranes",
            name: "PRO Series Membranes",
            description:
              "Hydranautics PRO Series specialty membranes are designed for difficult industrial wastewater applications, including ZLD and MLD treatment requirements.",
            imagePath: "/partners/hydranautics/products/pro-series-specialty-membranes.webp",
            imageAlt: "Hydranautics PRO Series specialty membrane elements official product image",
            productSlug: "wastewater-filtration-systems",
            catalogFiles: [{ label: "PRO Series brochure", path: "/catalogs/hydranautics-pro-series-brochure.pdf" }],
            applications: ["Industrial wastewater", "ZLD systems", "MLD systems", "Water recovery"],
          },
        ],
      },
    ],
  },
  {
    slug: "dax",
    name: "DAX",
    logoPath: "/partners/dax/logo.png",
    logoAlt: "DAX RO Pressure Vessel company logo",
    summary:
      "DAX RO pressure vessel catalog covering 4 inch and 8 inch membrane housings, side-entry and end-entry configurations, pressure ratings, and pressure vessel accessories.",
    catalogPath: "/catalogs/dax-water-catalog.pdf",
    catalogLabel: "View DAX water catalog",
    catalogStatus: "catalog-ready",
    categories: [
      {
        slug: "ro-pressure-vessels",
        name: "RO Pressure Vessels",
        description:
          "FRP membrane housings for commercial, industrial, brackish, high brackish, and seawater reverse-osmosis applications.",
        products: [
          {
            slug: "4-inch-end-entry-membrane-housings",
            name: "4 inch End Entry Membrane Housings",
            description: "End-entry membrane housings with 300, 450, 600, 1000, and 1200 PSI operating pressure options.",
            imagePath: "/partners/dax/products/ro-pressure-vessels.webp",
            imageAlt: "DAX RO pressure vessel membrane housings official catalog product image",
            productSlug: "ro-housings",
            applications: ["Commercial RO", "Industrial RO", "Brackish water treatment"],
          },
          {
            slug: "4-inch-side-entry-membrane-housings",
            name: "4 inch Side Entry Membrane Housings",
            description: "Side-entry membrane housings with operating pressure options from 300 to 1200 PSI.",
            imagePath: "/partners/dax/products/ro-pressure-vessels.webp",
            imageAlt: "DAX 4 inch side entry RO pressure vessel official catalog product image",
            productSlug: "ro-housings",
            applications: ["Commercial RO", "Industrial RO", "Compact RO skids"],
          },
          {
            slug: "8-inch-end-entry-membrane-housings",
            name: "8 inch End Entry Membrane Housings",
            description: "End-entry membrane housings for up to 7 membrane elements, available across multiple pressure ratings.",
            imagePath: "/partners/dax/products/ro-pressure-vessels.webp",
            imageAlt: "DAX 8 inch end entry RO pressure vessel official catalog product image",
            productSlug: "ro-housings",
            applications: ["Industrial RO", "High-capacity RO plants", "Process water treatment"],
          },
          {
            slug: "8-inch-side-entry-membrane-housings",
            name: "8 inch Side Entry Membrane Housings",
            description: "Side-entry membrane housings for larger RO systems, with 300, 450, 600, 1000, and 1200 PSI options.",
            imagePath: "/partners/dax/products/ro-pressure-vessels.webp",
            imageAlt: "DAX 8 inch side entry RO pressure vessel official catalog product image",
            productSlug: "ro-housings",
            applications: ["Industrial RO", "Large RO systems", "Brackish water treatment"],
          },
          {
            slug: "1500-1800-psi-pressure-vessels",
            name: "1500 and 1800 PSI Pressure Vessels",
            description: "Higher-pressure DAX pressure vessel options noted in the catalog for demanding RO applications.",
            imagePath: "/partners/dax/products/ro-pressure-vessels.webp",
            imageAlt: "DAX high pressure RO pressure vessel official catalog product image",
            productSlug: "ro-housings",
            applications: ["High pressure RO", "Seawater applications", "Special project requirements"],
          },
        ],
      },
      {
        slug: "pressure-vessel-accessories",
        name: "Pressure Vessel Accessories",
        description:
          "Replacement accessories for DAX RO pressure vessels and compatible vessel servicing requirements.",
        products: [
          {
            slug: "head-assembly",
            name: "Head Assembly",
            description: "Side-port and end-port head assemblies for pressure vessel service and replacement.",
            imagePath: "/partners/dax/products/pressure-vessel-accessories.webp",
            imageAlt: "DAX pressure vessel head assembly and accessories official catalog product image",
            productSlug: "ro-housings",
            applications: ["Pressure vessel maintenance", "RO housing replacement"],
          },
          {
            slug: "bearing-plate",
            name: "Bearing Plate",
            description: "Pressure vessel bearing plate accessory for supported membrane housing assemblies.",
            imagePath: "/partners/dax/products/pressure-vessel-accessories.webp",
            imageAlt: "DAX bearing plate pressure vessel accessory official catalog product image",
            productSlug: "ro-housings",
            applications: ["RO vessel servicing", "Accessory replacement"],
          },
          {
            slug: "sealing-plate",
            name: "Sealing Plate",
            description: "Engineering thermoplastic sealing plate for side-port and end-port vessel configurations.",
            imagePath: "/partners/dax/products/pressure-vessel-accessories.webp",
            imageAlt: "DAX sealing plate pressure vessel accessory official catalog product image",
            productSlug: "ro-housings",
            applications: ["Pressure vessel sealing", "RO housing maintenance"],
          },
          {
            slug: "permeate-port",
            name: "Permeate Port",
            description: "Permeate port accessory with NPT female thread connection for RO pressure vessels.",
            imagePath: "/partners/dax/products/pressure-vessel-accessories.webp",
            imageAlt: "DAX permeate port pressure vessel accessory official catalog product image",
            productSlug: "ro-housings",
            applications: ["RO permeate connection", "Vessel servicing"],
          },
          {
            slug: "feed-concentrate-port",
            name: "Feed/Concentrate Port",
            description: "Feed and concentrate port accessories available in stainless steel material options.",
            imagePath: "/partners/dax/products/pressure-vessel-accessories.webp",
            imageAlt: "DAX feed and concentrate port pressure vessel accessory official catalog product image",
            productSlug: "ro-housings",
            applications: ["RO feed connection", "RO reject connection", "Vessel maintenance"],
          },
          {
            slug: "adapter-set",
            name: "Adapter Set",
            description: "Adapter set with adapter seal, PWT seal, and spacers.",
            imagePath: "/partners/dax/products/pressure-vessel-accessories.webp",
            imageAlt: "DAX adapter set pressure vessel accessory official catalog product image",
            productSlug: "ro-housings",
            applications: ["Membrane installation", "RO vessel accessory replacement"],
          },
          {
            slug: "strap-assembly",
            name: "Strap Assembly",
            description: "SS316 strap assembly with PVC cushion for pressure vessel mounting support.",
            imagePath: "/partners/dax/products/pressure-vessel-accessories.webp",
            imageAlt: "DAX strap assembly pressure vessel accessory official catalog product image",
            productSlug: "ro-housings",
            applications: ["Vessel mounting", "RO skid assembly"],
          },
          {
            slug: "thrust-ring-and-interconnector",
            name: "Thrust Ring and Membrane Interconnector",
            description: "Engineering thermoplastic thrust ring and membrane interconnector accessories.",
            imagePath: "/partners/dax/products/pressure-vessel-accessories.webp",
            imageAlt: "DAX thrust ring and membrane interconnector accessory official catalog product image",
            productSlug: "ro-housings",
            applications: ["Membrane support", "RO vessel servicing"],
          },
          {
            slug: "brine-seal-and-retaining-ring",
            name: "Brine Seal and Retaining Ring",
            description: "EPDM brine seal and stainless steel retaining ring accessories for pressure vessel maintenance.",
            imagePath: "/partners/dax/products/pressure-vessel-accessories.webp",
            imageAlt: "DAX brine seal and retaining ring pressure vessel accessory official catalog product image",
            productSlug: "ro-housings",
            applications: ["RO vessel sealing", "Membrane housing maintenance"],
          },
          {
            slug: "saddle",
            name: "Saddle",
            description: "Engineering thermoplastic saddle accessory for RO pressure vessel installation.",
            imagePath: "/partners/dax/products/pressure-vessel-accessories.webp",
            imageAlt: "DAX saddle pressure vessel accessory official catalog product image",
            productSlug: "ro-housings",
            applications: ["Vessel support", "RO skid installation"],
          },
        ],
      },
    ],
  },
  {
    slug: "fenton",
    name: "FENTON",
    logoPath: "/partners/fenton/logo.png",
    logoAlt: "FENTON company logo",
    summary:
      "FENTON Technologies product information has been added from the supplied product images, covering ultrafiltration membranes, MBR hollow fiber membranes, and heavy-duty oil skimmers.",
    catalogLabel: "FENTON supplied product images",
    catalogStatus: "catalog-ready",
    categories: [
      {
        slug: "ultrafiltration-membranes",
        name: "Ultrafiltration Membranes",
        description:
          "UF membrane products for clean-water output, pore precision, stable flow, and water-filtration applications.",
        products: [
          {
            slug: "uf-8585-ultrafiltration-membrane",
            name: "UF 8585 Ultrafiltration Membrane",
            description:
              "Ultra filtration membrane with membrane surface area of 77 m2 / 828 ft2, pore size 0.03 um, and design flux range of 36-120 L/m2-h.",
            imagePath: "/partners/fenton/products/uf-8585-ultrafiltration-membrane.webp",
            imageAlt: "FENTON UF 8585 ultrafiltration membrane supplied marketing product image",
            productSlug: "wastewater-filtration-systems",
            applications: ["Ultrafiltration", "Clean water output", "Industrial filtration", "Water treatment"],
          },
        ],
      },
      {
        slug: "mbr-membranes",
        name: "MBR Membranes",
        description:
          "Hollow fiber membrane products for membrane bioreactor and wastewater-treatment applications.",
        products: [
          {
            slug: "hollow-fiber-mbr-membrane",
            name: "Hollow Fiber MBR Membrane",
            description: "FENTON MBR hollow fiber membrane product for membrane bioreactor filtration systems.",
            imagePath: "/partners/fenton/products/hollow-fiber-mbr-membrane.webp",
            imageAlt: "FENTON hollow fiber MBR membrane supplied marketing product image",
            productSlug: "wastewater-filtration-systems",
            applications: ["MBR systems", "Wastewater treatment", "Biological treatment", "Treated water reuse"],
          },
        ],
      },
      {
        slug: "oil-skimmers",
        name: "Oil Skimmers",
        description:
          "Compact heavy-duty oil skimmers for oil removal with anti-rust body, PU belt, relocation handle, and serviceable construction.",
        products: [
          {
            slug: "compact-heavy-duty-oil-skimmer",
            name: "Compact Heavy Duty Oil Skimmer",
            description:
              "FENTON oil skimmer with heavy-duty motor, anti-rust body, high quality roller, relocation handle, PU belt, dual scraper, and up to 60 L/hr oil removal claim from supplied artwork.",
            imagePath: "/partners/fenton/products/compact-heavy-duty-oil-skimmer.webp",
            imageAlt: "FENTON compact heavy duty oil skimmer supplied marketing product image",
            productSlug: "wastewater-accessories",
            applications: ["Oil removal", "Industrial wastewater", "Coolant tank oil removal", "Machine shop utilities"],
          },
        ],
      },
    ],
  },
];

export const companyPartners: CompanyPartner[] = allCompanyPartners.slice(0, maxCompanyPartners);

export function getCompanyPartnerBySlug(slug: string) {
  return companyPartners.find((company) => company.slug === slug);
}

export function getCompanyProductCount(company: CompanyPartner) {
  return company.categories.reduce((count, category) => count + category.products.length, 0);
}

export function getCompanyProductHref(company: CompanyPartner) {
  const firstProduct = company.categories.flatMap((category) => category.products).find((product) => product.productSlug);

  return firstProduct?.productSlug ? `/products/${firstProduct.productSlug}` : "/products";
}

export function getCompanyProductsForProduct(productSlug: string): CompanyProductMatch[] {
  return companyPartners.flatMap((company) =>
    company.categories.flatMap((category) =>
      category.products
        .filter((product) => product.productSlug === productSlug)
        .map((product) => ({
          ...product,
          company: {
            slug: company.slug,
            name: company.name,
            logoPath: company.logoPath,
            logoAlt: company.logoAlt,
          },
          category: {
            slug: category.slug,
            name: category.name,
            description: category.description,
          },
        })),
    ),
  );
}
