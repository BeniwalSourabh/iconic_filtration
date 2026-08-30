export type TechnicalResourceSection =
  | "Product Catalogues"
  | "Technical Datasheets"
  | "Selection Guides"
  | "Installation Manuals"
  | "Maintenance Guides"
  | "Product Comparison Guides"
  | "Company Documents";

export type TechnicalResource = {
  name: string;
  section: TechnicalResourceSection;
  fileType: "PDF";
  fileSize: string;
  version: string;
  lastUpdated: string;
  description: string;
  href: string;
  product: string;
  brand: string;
  industry: string[];
};

export const technicalResourceSections: TechnicalResourceSection[] = [
  "Product Catalogues",
  "Technical Datasheets",
  "Selection Guides",
  "Installation Manuals",
  "Maintenance Guides",
  "Product Comparison Guides",
  "Company Documents",
];

export const technicalResources: TechnicalResource[] = [
  {
    name: "DAX Water Product Catalogue",
    section: "Product Catalogues",
    fileType: "PDF",
    fileSize: "2.5 MB",
    version: "2026",
    lastUpdated: "1 Jul 2026",
    description: "Approved DAX catalogue for RO pressure vessels and pressure-vessel accessories used in water-treatment systems.",
    href: "/catalogs/dax-water-catalog.pdf",
    product: "Pressure Vessels",
    brand: "DAX",
    industry: ["Water Treatment Plants", "Commercial Buildings", "Hotels"],
  },
  {
    name: "SEKO Water Industry Motor Pumps Catalogue",
    section: "Product Catalogues",
    fileType: "PDF",
    fileSize: "2.6 MB",
    version: "2026",
    lastUpdated: "1 Jul 2026",
    description: "Motor-driven dosing pump catalogue for water treatment and industrial chemical dosing applications.",
    href: "/catalogs/seko-water-industry-motor-pumps-2026.pdf",
    product: "Dosing Pumps",
    brand: "SEKO",
    industry: ["Chemical", "Pharmaceutical", "Water Treatment Plants"],
  },
  {
    name: "NEXTGEN NGET Electromagnetic Flow Meter Catalogue",
    section: "Product Catalogues",
    fileType: "PDF",
    fileSize: "0.6 MB",
    version: "2026",
    lastUpdated: "28 Jul 2026",
    description: "NEXTGEN NGET electromagnetic flow meter catalogue for conductive liquids, water, wastewater, chemicals, pulps, slurries, and industrial flow measurement applications.",
    href: "/catalogs/nextgen-nget-electromagnetic-flow-meter.pdf",
    product: "RO Controller and Instruments",
    brand: "NEXTGEN Envirotech",
    industry: ["Water Treatment Plants", "Chemical", "Pharmaceutical", "Textile", "Manufacturing"],
  },
  {
    name: "Hydranautics LD Technology Catalogue",
    section: "Product Catalogues",
    fileType: "PDF",
    fileSize: "1.1 MB",
    version: "2026",
    lastUpdated: "1 Jul 2026",
    description: "Hydranautics LD Technology catalogue for low-fouling RO membrane applications and industrial water-treatment selection.",
    href: "/catalogs/hydranautics-ld-technology.pdf",
    product: "RO Membranes",
    brand: "Hydranautics",
    industry: ["Manufacturing", "Water Treatment Plants", "Pharmaceutical"],
  },
  {
    name: "Hydranautics LD Technology E-Brochure",
    section: "Technical Datasheets",
    fileType: "PDF",
    fileSize: "3.6 MB",
    version: "2026",
    lastUpdated: "3 Jul 2026",
    description: "Technical brochure for LD Technology RO membranes used in lower-fouling industrial reverse-osmosis applications.",
    href: "/catalogs/hydranautics-ld-tech-e-brochure.pdf",
    product: "RO Membranes",
    brand: "Hydranautics",
    industry: ["Manufacturing", "Water Treatment Plants", "Pharmaceutical"],
  },
  {
    name: "Hydranautics CPA Family Brochure",
    section: "Selection Guides",
    fileType: "PDF",
    fileSize: "0.4 MB",
    version: "2026",
    lastUpdated: "3 Jul 2026",
    description: "CPA Family brochure for comparing high-rejection RO membrane options and selection considerations.",
    href: "/catalogs/hydranautics-cpa-family-brochure.pdf",
    product: "RO Membranes",
    brand: "Hydranautics",
    industry: ["Pharmaceutical", "Food & Beverage", "Water Treatment Plants"],
  },
  {
    name: "Hydranautics PRO Series Brochure",
    section: "Product Comparison Guides",
    fileType: "PDF",
    fileSize: "2.7 MB",
    version: "2026",
    lastUpdated: "3 Jul 2026",
    description: "PRO Series brochure for reviewing specialty membrane options for demanding water-treatment applications.",
    href: "/catalogs/hydranautics-pro-series-brochure.pdf",
    product: "RO Membranes",
    brand: "Hydranautics",
    industry: ["Chemical", "Textile", "Water Treatment Plants"],
  },
  {
    name: "ICONIC FILTRATION Complete Product Catalogue",
    section: "Company Documents",
    fileType: "PDF",
    fileSize: "7.4 MB",
    version: "2026",
    lastUpdated: "9 Jul 2026",
    description: "Company catalogue covering ICONIC FILTRATION AND ENGINEERS LLP product focus, brands, applications, and contact information.",
    href: "/downloads/iconic-filtration-company-catalog.pdf",
    product: "Company Profile",
    brand: "ICONIC",
    industry: ["Industrial Buyers", "OEMs", "Consultants", "Procurement"],
  },
];

export const popularTechnicalResources = [
  "/downloads/iconic-filtration-company-catalog.pdf",
  "/catalogs/nextgen-nget-electromagnetic-flow-meter.pdf",
  "/catalogs/hydranautics-ld-technology.pdf",
  "/catalogs/seko-water-industry-motor-pumps-2026.pdf",
  "/catalogs/dax-water-catalog.pdf",
];
