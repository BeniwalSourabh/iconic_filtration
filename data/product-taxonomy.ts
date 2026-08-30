export type ProductFamily = {
  slug: string;
  name: string;
  description: string;
  products: ProductTaxonomyItem[];
};

export type ProductTaxonomyItem = {
  slug: string;
  name: string;
  applicationHint: string;
  description: string;
  applications: string[];
  selectionNotes: string[];
};

export type ProductRecord = ProductTaxonomyItem & {
  family: Pick<ProductFamily, "slug" | "name" | "description">;
};

export const productTaxonomy: ProductFamily[] = [
  {
    slug: "water-treatment-components",
    name: "Water Treatment Components",
    description:
      "Core components for RO, filtration, ion exchange, chemical dosing, and process-water treatment systems.",
    products: [
      {
        slug: "frp-vessels",
        name: "FRP Vessels",
        applicationHint: "Pressure vessels for filters, softeners, and industrial water-treatment systems.",
        description:
          "FRP vessels give filtration and softening systems a corrosion-resistant pressure body for media beds, distributors, and service valves. They are commonly used by OEMs and plant teams that need dependable performance with lower handling weight than metallic vessels.",
        applications: ["Pressure sand filters", "Activated carbon filters", "Water softeners", "Iron removal systems"],
        selectionNotes: ["Operating pressure and design margin", "Media volume and freeboard", "Valve compatibility", "Connection size and plant layout"],
      },
      {
        slug: "ro-housings",
        name: "RO Housings",
        applicationHint: "Membrane housings for commercial and industrial reverse-osmosis systems.",
        description:
          "RO housings protect membrane elements, maintain pressure integrity, and support stable permeate quality in reverse-osmosis skids. The correct housing choice improves service access, sealing reliability, and long-term system uptime.",
        applications: ["Commercial RO plants", "Industrial RO skids", "Process-water polishing", "Desalination pre-engineering"],
        selectionNotes: ["Membrane size and element count", "Feed pressure range", "End-port or side-port arrangement", "Material compatibility"],
      },
      {
        slug: "dosing-pumps",
        name: "Dosing Pumps",
        applicationHint: "Chemical dosing for antiscalant, pH correction, disinfection, and process control.",
        description:
          "Dosing pumps meter treatment chemicals at controlled rates so plant operators can manage scale, pH, disinfection, and process conditioning. They help keep water-treatment performance predictable across changing feed conditions.",
        applications: ["Antiscalant dosing", "pH correction", "Chlorine dosing", "Coagulant and flocculant dosing"],
        selectionNotes: ["Flow rate and turndown", "Chemical compatibility", "Discharge pressure", "Control signal and automation needs"],
      },
      {
        slug: "electro-chlorination-systems",
        name: "Electro Chlorination Systems",
        applicationHint: "On-site chlorine generation for safe and controlled disinfection.",
        description:
          "Electro chlorination systems generate disinfectant on site from salt, reducing dependency on bulk chemical handling. They are suited to facilities that need repeatable chlorination with safer logistics and better operational control.",
        applications: ["Cooling-water disinfection", "Drinking-water treatment", "Industrial utilities", "Remote water-treatment sites"],
        selectionNotes: ["Chlorine production capacity", "Salt and power availability", "Brine preparation space", "Duty cycle and redundancy"],
      },
      {
        slug: "multiport-valves",
        name: "Multiport Valves",
        applicationHint: "Manual and automatic valve control for filters, softeners, and treatment units.",
        description:
          "Multiport valves simplify filter and softener operation by combining service, backwash, rinse, and regeneration paths in a compact control point. They help OEMs build cleaner assemblies with fewer external valves.",
        applications: ["Filter backwash control", "Softener regeneration", "Carbon filter operation", "Compact treatment packages"],
        selectionNotes: ["Valve size and flow rating", "Manual or automatic actuation", "Mounting style", "Media and vessel compatibility"],
      },
      {
        slug: "distribution-systems",
        name: "Distribution Systems",
        applicationHint: "Internal vessel distribution for uniform flow and efficient media performance.",
        description:
          "Distribution systems spread water evenly through the vessel, support media retention, and reduce channeling. Correct distributor selection protects media performance and keeps pressure drop under control.",
        applications: ["FRP and MS filter vessels", "Softener vessels", "Mixed-bed systems", "Media retention assemblies"],
        selectionNotes: ["Vessel diameter", "Slot size and media grade", "Flow direction", "Collector strength and service access"],
      },
      {
        slug: "ro-membranes",
        name: "RO Membranes",
        applicationHint: "Membrane separation for desalination, process water, and purification systems.",
        description:
          "RO membranes remove dissolved salts and impurities through pressure-driven separation. Membrane selection directly affects recovery, rejection, cleaning frequency, and operating cost.",
        applications: ["Industrial RO plants", "Process-water treatment", "Boiler feed pre-treatment", "TDS reduction"],
        selectionNotes: ["Feed TDS and water chemistry", "Recovery target", "Fouling and scaling risk", "Cleaning strategy"],
      },
      {
        slug: "domestic-ro-membranes",
        name: "Domestic RO Membranes",
        applicationHint: "Compact membranes for domestic and light-commercial water purifiers.",
        description:
          "Domestic RO membranes support compact purification systems where reliable taste, clarity, and TDS reduction matter. They are selected for stable output in household and light-commercial applications.",
        applications: ["Domestic RO purifiers", "Light-commercial purifiers", "Office pantry systems", "Small drinking-water units"],
        selectionNotes: ["GPD rating", "Feed-water quality", "Recovery and reject flow", "Service interval"],
      },
      {
        slug: "filter-cartridges",
        name: "Filter Cartridges",
        applicationHint: "Sediment and polishing filtration for pre-treatment and final filtration stages.",
        description:
          "Filter cartridges remove suspended particles before sensitive equipment or at the final polishing stage. They are a practical safeguard for membranes, instruments, nozzles, and process lines.",
        applications: ["RO pre-filtration", "Final polishing", "Process protection", "Food and beverage filtration"],
        selectionNotes: ["Micron rating", "Cartridge length and diameter", "Dirt-holding capacity", "Material and end-cap compatibility"],
      },
      {
        slug: "filter-media",
        name: "Filter Media",
        applicationHint: "Media for sand filters, carbon filters, iron removal, and specialty filtration.",
        description:
          "Filter media supports removal of turbidity, color, odor, iron, organics, and application-specific contaminants. The right blend and bed depth help plants achieve consistent outlet quality.",
        applications: ["Pressure sand filters", "Activated carbon filters", "Iron removal units", "Multi-grade filtration"],
        selectionNotes: ["Raw-water analysis", "Bed depth and vessel size", "Backwash rate", "Media grading and replacement cycle"],
      },
      {
        slug: "ro-antiscalant",
        name: "RO Antiscalant",
        applicationHint: "Scale-control chemistry for improved membrane life and system uptime.",
        description:
          "RO antiscalant helps control mineral scaling on membrane surfaces, supporting higher recovery and more stable differential pressure. Proper dosing is based on feed-water analysis and system design.",
        applications: ["RO scale prevention", "High-recovery systems", "Brackish-water treatment", "Membrane life extension"],
        selectionNotes: ["Feed-water chemistry", "Recovery percentage", "Dosing concentration", "Compatibility with membranes and cleaners"],
      },
      {
        slug: "cation-exchange-resins",
        name: "Cation Exchange Resins",
        applicationHint: "Softening and demineralization support for water-treatment systems.",
        description:
          "Cation exchange resins exchange hardness ions and support softening or demineralization processes. Resin selection influences exchange capacity, regeneration efficiency, and leakage control.",
        applications: ["Water softeners", "DM plants", "Boiler feed preparation", "Process-water treatment"],
        selectionNotes: ["Total hardness and TDS", "Regeneration method", "Operating temperature", "Required leakage limits"],
      },
      {
        slug: "ro-controller-instruments",
        name: "RO Controller and Instruments",
        applicationHint: "Monitoring and control instruments for RO automation and process visibility.",
        description:
          "RO controllers and instruments help teams monitor pressure, conductivity, flow, level, and protection interlocks. Good instrumentation improves operator confidence and makes troubleshooting faster.",
        applications: ["RO automation panels", "Conductivity monitoring", "Flow and pressure tracking", "Plant protection interlocks"],
        selectionNotes: ["Measured parameters", "Display and alarm needs", "Sensor compatibility", "Panel integration"],
      },
    ],
  },
  {
    slug: "water-handling-equipment",
    name: "Water Handling Equipment",
    description:
      "Equipment and assemblies for storage, pumping, pressure control, and movement of treated or process water.",
    products: [
      {
        slug: "high-pressure-pumps",
        name: "High Pressure Pumps",
        applicationHint: "Pressure generation for RO and industrial water-treatment applications.",
        description:
          "High pressure pumps provide the pressure required for membrane separation and demanding water-transfer duties. Correct pump selection improves energy use, membrane performance, and operating stability.",
        applications: ["RO feed pumping", "Industrial process water", "Pressure boosting", "Skid-mounted treatment systems"],
        selectionNotes: ["Flow and head requirement", "Material of construction", "NPSH and suction condition", "Motor rating and control method"],
      },
      {
        slug: "hydro-pneumatic-tanks",
        name: "Hydro Pneumatic Tanks",
        applicationHint: "Pressure stabilization and water storage for commercial and industrial systems.",
        description:
          "Hydro pneumatic tanks store pressurized water and reduce pump cycling in distribution systems. They support steady pressure for buildings, utilities, and packaged treatment plants.",
        applications: ["Commercial water supply", "Industrial utilities", "Booster systems", "Treated-water distribution"],
        selectionNotes: ["Drawdown volume", "System pressure range", "Pump cycling target", "Bladder and vessel compatibility"],
      },
      {
        slug: "level-sensors",
        name: "Level Sensors",
        applicationHint: "Tank-level monitoring and process protection for water-handling systems.",
        description:
          "Level sensors protect pumps, automate tank operation, and improve visibility across water-handling systems. They help teams prevent dry run, overflow, and process interruption.",
        applications: ["Raw-water tanks", "Treated-water tanks", "Chemical day tanks", "Process interlocks"],
        selectionNotes: ["Tank height and geometry", "Liquid characteristics", "Output signal", "Mounting and cable protection"],
      },
    ],
  },
  {
    slug: "wastewater-treatment-equipment",
    name: "Wastewater Treatment Equipment",
    description: "",
    products: [
      {
        slug: "wastewater-filtration-systems",
        name: "Wastewater Filtration Systems",
        applicationHint: "Filtration support for effluent, recycling, and wastewater reuse applications.",
        description:
          "Wastewater filtration systems help reduce suspended solids and improve water quality before discharge, reuse, or downstream treatment. They can be configured around application load and plant objectives.",
        applications: ["Effluent polishing", "Reuse pre-treatment", "Tertiary filtration", "Process-water recovery"],
        selectionNotes: ["Influent solids load", "Target outlet quality", "Backwash and sludge handling", "Space and maintenance access"],
      },
      {
        slug: "wastewater-dosing-systems",
        name: "Wastewater Dosing Systems",
        applicationHint: "Chemical dosing and conditioning for wastewater treatment processes.",
        description:
          "Wastewater dosing systems support pH control, coagulation, flocculation, odor management, and disinfection. Good dosing design improves treatment consistency and chemical control.",
        applications: ["pH correction", "Coagulant dosing", "Flocculant dosing", "Disinfection support"],
        selectionNotes: ["Chemical type and concentration", "Required dosing accuracy", "Mixing point", "Automation and safety needs"],
      },
      {
        slug: "wastewater-accessories",
        name: "Wastewater Accessories",
        applicationHint: "Supporting accessories for wastewater and effluent treatment installations.",
        description:
          "Wastewater accessories complete treatment installations with practical components for monitoring, handling, dosing, and maintenance. They help plants keep everyday operations cleaner and more controllable.",
        applications: ["ETP support packages", "STP maintenance support", "Sampling and monitoring", "Chemical handling"],
        selectionNotes: ["Plant process flow", "Material compatibility", "Maintenance frequency", "Operator safety requirements"],
      },
    ],
  },
];

const productDisplayOrder: Record<string, string[]> = {
  "water-treatment-components": [
    "ro-housings",
    "ro-membranes",
    "domestic-ro-membranes",
    "ro-antiscalant",
    "ro-controller-instruments",
    "dosing-pumps",
    "frp-vessels",
    "multiport-valves",
    "distribution-systems",
    "filter-cartridges",
    "filter-media",
    "cation-exchange-resins",
    "electro-chlorination-systems",
  ],
};

for (const family of productTaxonomy) {
  const displayOrder = productDisplayOrder[family.slug];

  if (displayOrder) {
    family.products.sort((firstProduct, secondProduct) => {
      const firstIndex = displayOrder.indexOf(firstProduct.slug);
      const secondIndex = displayOrder.indexOf(secondProduct.slug);

      return (firstIndex === -1 ? displayOrder.length : firstIndex) - (secondIndex === -1 ? displayOrder.length : secondIndex);
    });
  }
}

export const productRecords: ProductRecord[] = productTaxonomy.flatMap((family) =>
  family.products.map((product) => ({
    ...product,
    family: {
      slug: family.slug,
      name: family.name,
      description: family.description,
    },
  })),
);

export function getProductBySlug(slug: string) {
  return productRecords.find((product) => product.slug === slug);
}

export function getProductFamilyBySlug(slug: string) {
  return productTaxonomy.find((family) => family.slug === slug);
}
