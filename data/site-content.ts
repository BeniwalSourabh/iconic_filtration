export const industryPages = [
  {
    slug: "water-treatment-companies",
    name: "Water Treatment Companies",
    summary:
      "Component sourcing, documentation, and application support for system integrators building RO, filtration, softening, and utility-water packages.",
    needs: ["Reliable component availability", "Datasheets and product clarity", "Compatible accessories", "Quote support for repeat projects"],
  },
  {
    slug: "industrial-plants",
    name: "Industrial Plants",
    summary:
      "Filtration and water-handling products for plant utilities, process support, equipment protection, and maintenance teams.",
    needs: ["Stable process water", "Reduced downtime", "Replacement planning", "Technical selection support"],
  },
  {
    slug: "pharmaceutical-industry",
    name: "Pharmaceutical Industry",
    summary:
      "Documentation-led filtration support for facilities where water quality, traceability, and controlled maintenance matter.",
    needs: ["Document control", "Consistent filtration stages", "Quality-led procurement", "Supplier reliability"],
  },
  {
    slug: "chemical-industry",
    name: "Chemical Industry",
    summary:
      "Water-treatment components and dosing support for demanding utilities, pre-treatment, and plant operation requirements.",
    needs: ["Chemical compatibility", "Controlled dosing", "Durable components", "Application review"],
  },
  {
    slug: "food-beverage-industry",
    name: "Food & Beverage Industry",
    summary:
      "Filtration, polishing, and pre-treatment products for production support, utilities, and equipment protection.",
    needs: ["Hygienic process thinking", "Sediment control", "Reliable consumables", "Repeatable service planning"],
  },
  {
    slug: "textile-industry",
    name: "Textile Industry",
    summary:
      "Filtration and water-treatment product support for process water, utilities, reuse planning, and wastewater applications.",
    needs: ["Process-water consistency", "Filtration support", "Reuse planning", "Wastewater treatment support"],
  },
  {
    slug: "hospitals",
    name: "Hospitals",
    summary:
      "Water filtration products for building utilities, RO systems, softening, and treated-water support in healthcare facilities.",
    needs: ["Reliable water quality", "RO support", "Softening", "Service-friendly product selection"],
  },
  {
    slug: "hotels",
    name: "Hotels",
    summary:
      "Commercial filtration, softening, pressure support, and water-treatment products for hospitality facilities.",
    needs: ["Guest-service reliability", "Softening", "Pressure support", "Low-maintenance operation"],
  },
  {
    slug: "commercial-buildings",
    name: "Commercial Buildings",
    summary:
      "Water softening, filtration, pressure stabilization, and packaged component support for hotels, campuses, and facilities.",
    needs: ["Compact equipment choices", "Low-maintenance operation", "Pressure stability", "Clear replacement cycles"],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    summary:
      "Industrial water filtration products for production support, equipment protection, plant utilities, and treated-water systems.",
    needs: ["Equipment protection", "Utility-water support", "Process reliability", "Replacement planning"],
  },
  {
    slug: "water-treatment-plants",
    name: "Water Treatment Plants",
    summary:
      "RO, filtration, dosing, membrane, vessel, and accessory support for treatment-system requirements.",
    needs: ["Product availability", "Compatible components", "Technical selection", "Documentation support"],
  },
  {
    slug: "oem-manufacturers",
    name: "OEM Manufacturers",
    summary:
      "Component families, product documentation, and selection support for OEMs building standard and custom water-treatment systems.",
    needs: ["Consistent specification", "Repeat procurement", "Compatible product families", "Scalable catalog support"],
  },
  {
    slug: "dealers-distributors",
    name: "Dealers & Distributors",
    summary:
      "A structured product range for channel partners who need clear categories, quote support, and dependable technical responses.",
    needs: ["Quick product comparison", "Brochure-ready information", "Quotation clarity", "After-sales confidence"],
  },
  {
    slug: "government-projects",
    name: "Government Projects",
    summary:
      "Documentation-first product support for public infrastructure, water-supply, and treatment-related project requirements.",
    needs: ["Formal documentation", "Project-stage clarity", "Transparent specifications", "Reliable fulfilment planning"],
  },
];

export type ProjectHighlight = {
  title: string;
  industry: string;
  scope: string;
  outcome: string;
};

export const projectHighlights: ProjectHighlight[] = [];

export const galleryItems = [
  {
    title: "Product Documentation Desk",
    category: "Quality",
    description: "A content slot for approved product certificates, datasheets, inspection notes, and compliance files.",
  },
  {
    title: "Water-Treatment Assembly View",
    category: "Products",
    description: "A visual area for FRP vessels, RO housings, dosing packages, pumps, and installed component groups.",
  },
  {
    title: "OEM Package Workflow",
    category: "Manufacturing",
    description: "A gallery slot for assembly, dispatch preparation, labeling, and repeat project documentation.",
  },
  {
    title: "Industrial Utility Application",
    category: "Applications",
    description: "A place for site-approved utility-water, filtration, and process-water application photographs.",
  },
  {
    title: "Consumables and Media",
    category: "Products",
    description: "A product-media area for cartridges, membranes, filter media, resins, and treatment chemicals.",
  },
  {
    title: "Packaging and Dispatch",
    category: "Operations",
    description: "A slot for approved packaging, dispatch, and channel-supply visuals once real photography is available.",
  },
];

export const certificateItems = [
  {
    title: "Product Datasheets",
    status: "Ready for upload",
    description: "Technical data files for product families, sizes, materials, and application notes.",
  },
  {
    title: "Quality Inspection Records",
    status: "Document category",
    description: "Inspection and quality-control records can be listed after approval for public sharing.",
  },
  {
    title: "Material and Compliance Documents",
    status: "On request",
    description: "Material references and compliance documents can be linked to relevant product pages.",
  },
  {
    title: "Company and Registration Documents",
    status: "Available on request",
    description: "Approved company and registration documents can be shared for relevant business requirements.",
  },
];

export const downloadItems = [
  {
    title: "Product Range Brochure",
    type: "Brochure",
    description: "A complete overview of ICONIC product families and industries served.",
  },
  {
    title: "FRP Vessel Selection Sheet",
    type: "Datasheet",
    description: "Selection inputs for pressure vessels, filter media, valves, and system layout planning.",
  },
  {
    title: "RO Component Checklist",
    type: "Checklist",
    description: "A procurement-friendly checklist for membranes, housings, pumps, antiscalant, and instruments.",
  },
  {
    title: "Quote Requirement Form",
    type: "Form",
    description: "The information needed to prepare a cleaner technical quote for water-treatment applications.",
  },
];

export type CaseStudy = {
  slug: string;
  title: string;
  industry: string;
  challenge: string;
  solution: string;
  outcome: string;
};

export const caseStudies: CaseStudy[] = [];

export type BlogPostSection = {
  id: string;
  title: string;
  paragraphs: string[];
  subsections?: {
    title: string;
    text: string;
  }[];
  diagram?: {
    title: string;
    points: string[];
  };
};

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  authorName: string;
  publishedAt: string;
  readingTime: string;
  excerpt: string;
  featuredImage: {
    title: string;
    alt: string;
    path: string;
    isPlaceholder: boolean;
  };
  sections: BlogPostSection[];
  internalLinks: {
    label: string;
    href: string;
  }[];
  cta: {
    title: string;
    text: string;
  };
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-shortlist-water-filtration-components",
    title: "How to Shortlist Water Filtration Components for Industrial Applications",
    metaTitle: "How to Shortlist Water Filtration Components | ICONIC",
    metaDescription:
      "A practical guide for engineers and procurement teams comparing RO membranes, vessels, pumps, media, cartridges, dosing systems, and instruments for industrial water treatment.",
    category: "Product Selection Guide",
    authorName: "ICONIC Technical Team",
    publishedAt: "2026-07-06",
    readingTime: "9 min read",
    excerpt:
      "A technical selection guide for comparing water filtration components before requesting a quotation or approving a purchase.",
    featuredImage: {
      title: "Industrial water filtration system image",
      alt: "Industrial water filtration equipment used for water treatment component selection",
      path: "/blog/industrial-filtration-components.jpg",
      isPlaceholder: false,
    },
    sections: [
      {
        id: "start-with-process-requirement",
        title: "Start With the Process Requirement",
        paragraphs: [
          "Industrial water filtration selection should begin with the process requirement, not with a product name. Engineers and procurement teams often receive a request such as cartridge filter, dosing pump, RO membrane, pressure vessel, or media filter, but that label is only the starting point. The correct component depends on raw water quality, target outlet quality, operating pressure, flow rate, duty hours, temperature, chemical exposure, cleaning method, space availability, and maintenance access.",
          "For a consultant or plant engineer, the first question is what the component must protect or achieve. A cartridge filter may be protecting RO membranes from suspended solids. An antiscalant dosing pump may be protecting a membrane system from scale. A pressure vessel may need to handle a specific media bed, backwash flow, and valve arrangement. When the purpose is clear, the shortlist becomes more accurate and the quotation becomes easier to compare.",
        ],
        subsections: [
          {
            title: "Define the water quality target",
            text: "Record feed water data, expected treated water quality, turbidity, TDS, hardness, pH, iron, organics, chlorine, and any process-specific contaminants before choosing the component.",
          },
          {
            title: "Identify the operating duty",
            text: "Continuous duty, batch operation, standby service, high recovery RO, utility water, drinking water, and process water each create different selection priorities.",
          },
        ],
      },
      {
        id: "compare-hydraulic-and-chemical-conditions",
        title: "Compare Hydraulic and Chemical Conditions",
        paragraphs: [
          "Hydraulic conditions decide whether a product will fit the system without creating pressure loss, unstable flow, or service problems. For filters and housings, check design flow, peak flow, pressure rating, connection size, allowable pressure drop, and service access. For pumps, confirm flow rate, head, suction condition, chemical compatibility, control method, and power availability. For RO membranes, review feed pressure, recovery target, fouling risk, cleaning frequency, and feed water chemistry.",
          "Chemical conditions are equally important. Materials used in vessels, seals, cartridges, membranes, pump heads, valves, and tubing must be suitable for the liquid they handle. A dosing pump used for acid, alkali, chlorine, antiscalant, or coagulant must be selected with compatible wetted parts. A filter media bed must be selected based on the contaminant load, backwash capacity, and expected service cycle. Ignoring chemical compatibility can create leakage, performance loss, or premature replacement.",
        ],
        diagram: {
          title: "Filtration component selection flow",
          points: ["Application", "Water analysis", "Flow and pressure", "Material compatibility", "Service access", "Quotation"],
        },
      },
      {
        id: "review-core-component-families",
        title: "Review Core Component Families",
        paragraphs: [
          "A practical industrial shortlist usually covers multiple product families. RO membranes are selected for salt rejection, recovery, fouling behavior, and feed water conditions. Pressure vessels and RO housings are selected for membrane size, pressure class, port arrangement, and serviceability. Dosing pumps are selected for chemical type, dosing rate, discharge pressure, turndown, and automation needs. Filter cartridges are selected for micron rating, length, diameter, material, and dirt-holding capacity.",
          "Filter media and FRP vessels require a combined view. The vessel must have the correct diameter, height, pressure rating, internal distribution, and valve compatibility for the selected media. Multiport valves and distribution systems affect service, backwash, rinse, regeneration, and flow uniformity. Instruments and RO controllers help operators monitor conductivity, pressure, flow, tank level, and protection interlocks. Each component should be reviewed as part of the treatment system, not as an isolated item.",
        ],
        subsections: [
          {
            title: "Products commonly reviewed together",
            text: "RO membranes, RO housings, FRP vessels, dosing pumps, cartridges, filter media, multiport valves, antiscalant, level sensors, and instruments are often evaluated in the same procurement cycle.",
          },
        ],
      },
      {
        id: "prepare-procurement-comparison",
        title: "Prepare a Clean Procurement Comparison",
        paragraphs: [
          "Procurement teams need more than a price line. A useful comparison should include product description, model or size, material of construction, pressure rating, flow range, operating temperature, connection details, compatible accessories, document availability, delivery requirement, and warranty information where applicable. If values are not available, they should be marked as pending rather than guessed. This keeps the technical and commercial comparison honest.",
          "A structured enquiry reduces delays. Attach available water analysis, process flow, existing product photographs, previous model numbers, drawings, preferred brands, quantity, timeline, and site location. This information helps the supplier recommend a suitable product and helps the buyer compare alternatives with fewer clarification rounds. For repeat purchase requirements, include the exact replacement size, connection, and operating history if available.",
        ],
      },
      {
        id: "final-selection-checklist",
        title: "Final Selection Checklist",
        paragraphs: [
          "Before issuing a purchase order, engineers should verify that the selected component matches the application, hydraulic duty, material compatibility, installation space, maintenance method, and documentation requirement. Procurement should check whether the quotation clearly identifies what is included and what is excluded. Consultants should confirm whether the product can meet the project specification and whether any approval documents are required.",
          "ICONIC FILTRATION AND ENGINEERS LLP supports industrial buyers, OEMs, consultants, and water treatment companies with product shortlisting and quotation support. A clear enquiry with technical inputs helps the team respond with practical options for water filtration products and engineering-led water treatment solutions.",
          "The strongest purchase decisions usually come from a shared technical checklist. When the engineering team, purchase team, and supplier review the same application data, the discussion becomes more objective. This reduces assumptions, improves quotation quality, and helps the buyer avoid selecting a product that appears economical but creates operating, compatibility, or maintenance problems later.",
        ],
      },
    ],
    internalLinks: [
      { label: "Explore water filtration products", href: "/products" },
      { label: "Learn about ICONIC", href: "/about" },
      { label: "Contact the technical team", href: "/contact" },
      { label: "Request a quotation", href: "/request-quote" },
    ],
    cta: {
      title: "Need help shortlisting filtration components?",
      text: "Share your application, flow rate, water quality, pressure, location, and timeline so ICONIC can help you identify suitable product options for your requirement.",
    },
  },
  {
    slug: "ro-membrane-selection-for-industrial-water-treatment",
    title: "RO Membrane Selection for Industrial Water Treatment Systems",
    metaTitle: "RO Membrane Selection Guide for Industrial Water Treatment",
    metaDescription:
      "Learn how engineers and procurement teams should compare RO membranes using feed water quality, recovery target, pressure, fouling risk, pretreatment, and documentation.",
    category: "RO Membrane Guide",
    authorName: "ICONIC Technical Team",
    publishedAt: "2026-07-06",
    readingTime: "10 min read",
    excerpt:
      "A professional guide to selecting RO membranes based on feed water chemistry, recovery target, fouling behavior, pressure, and system compatibility.",
    featuredImage: {
      title: "RO membrane product image",
      alt: "RO membrane elements for industrial water treatment membrane selection",
      path: "/blog/ro-membrane-selection-fit.jpg",
      isPlaceholder: false,
    },
    sections: [
      {
        id: "why-ro-membrane-selection-matters",
        title: "Why RO Membrane Selection Matters",
        paragraphs: [
          "RO membranes are a core component in industrial water treatment systems because they directly influence treated water quality, recovery, operating pressure, cleaning frequency, and long-term operating cost. A membrane that looks correct by size alone may still be unsuitable if the feed water chemistry, fouling tendency, temperature, pressure, or required permeate quality is not reviewed. For industrial buyers, membrane selection should therefore be treated as an engineering decision, not only a consumable purchase.",
          "The first step is to identify the water source and treatment objective. Borewell water, municipal water, brackish water, seawater, process water, wastewater reuse, and boiler feed applications can require different membrane families. The target may be TDS reduction, process water quality, high purity water, reuse, recovery improvement, or equipment protection. Each target changes the selection inputs and the questions that should be asked before quotation.",
        ],
      },
      {
        id: "feed-water-data-required",
        title: "Feed Water Data Required Before Selection",
        paragraphs: [
          "A reliable RO membrane recommendation depends on water analysis. Important values include TDS, hardness, alkalinity, silica, iron, manganese, turbidity, SDI, TOC where relevant, pH, temperature, free chlorine, and any known organic or biological loading. These values help assess scaling risk, fouling potential, chemical compatibility, and pretreatment requirements. If the feed water data is incomplete, the recommendation should remain provisional until verified information is available.",
          "Pretreatment must also be reviewed. Cartridge filtration, media filtration, carbon filtration, softening, antiscalant dosing, pH correction, dechlorination, and ultrafiltration may all affect membrane performance. A membrane should not be expected to solve problems that belong in pretreatment. Engineers should check whether the pretreatment system can control suspended solids, oxidants, hardness, and organics before the water reaches the RO stage.",
        ],
        diagram: {
          title: "RO system selection inputs",
          points: ["Feed water", "Pretreatment", "High pressure pump", "RO membranes", "Permeate", "Reject"],
        },
      },
      {
        id: "compare-membrane-performance-parameters",
        title: "Compare Membrane Performance Parameters",
        paragraphs: [
          "Common membrane comparison points include membrane size, membrane type, salt rejection, permeate flow, test pressure, recovery range, operating pH range, cleaning pH range, temperature limit, feed spacer design, and fouling resistance. These values should be taken from approved manufacturer datasheets, not assumed. Procurement teams should avoid comparing membranes only by price if the models differ in rejection, pressure requirement, application range, or fouling behavior.",
          "Operating pressure is especially important. A lower energy membrane may reduce pressure requirement in suitable conditions, while a high rejection membrane may be selected where permeate quality is critical. Low fouling membrane options may be considered for waters with organic or biological fouling potential, but they still require correct pretreatment and cleaning practices. The best selection balances water quality, energy use, recovery, fouling control, and service expectations.",
        ],
        subsections: [
          {
            title: "Recovery and scaling risk",
            text: "Higher recovery can reduce reject volume, but it also increases scaling risk. Recovery should be checked against feed chemistry and antiscalant strategy.",
          },
          {
            title: "Cleaning and maintenance",
            text: "Cleaning frequency depends on feed quality, pretreatment, operating flux, differential pressure trends, and plant discipline.",
          },
        ],
      },
      {
        id: "procurement-documentation-for-ro-membranes",
        title: "Procurement Documentation for RO Membranes",
        paragraphs: [
          "Industrial membrane purchases should be supported by clear documentation. Buyers may need datasheets, model references, membrane dimensions, operating limits, storage guidance, installation instructions, and compatibility notes. If a membrane is being purchased as a replacement, the old model number, plant capacity, pressure vessel size, number of elements, and operating history should be shared. This helps avoid selecting a membrane that fits physically but is not appropriate for the process target.",
          "Consultants and plant engineers should also check whether the membrane matches the plant design assumptions. Important questions include number of stages, element count per pressure vessel, feed pressure, flux, recovery, cleaning arrangement, reject handling, and instrument availability. Procurement teams should confirm delivery, packing condition, storage expectations, and whether any catalogue or datasheet references are included with the offer.",
        ],
      },
      {
        id: "how-iconic-supports-ro-buyers",
        title: "How ICONIC Supports RO Buyers",
        paragraphs: [
          "ICONIC FILTRATION AND ENGINEERS LLP supplies RO membranes and related water filtration products for industrial, commercial, and water treatment applications. The team can review product interest, application, feed water information, capacity, preferred brand, and project timeline before preparing a quotation. Where exact technical data is required, approved catalogues and datasheets should be used for final engineering confirmation.",
          "For the fastest response, send feed water analysis, target treated water quality, plant capacity, existing membrane model, number of membranes, pressure vessel details, operating pressure, recovery target, and location. This information helps ICONIC support engineers, procurement teams, OEMs, and consultants with suitable membrane options and connected products such as RO housings, antiscalant, cartridges, pumps, and instruments.",
          "A membrane enquiry should also mention whether the requirement is for a new plant, replacement, capacity expansion, troubleshooting, or cost optimization. These situations may lead to different questions. Replacement buyers may need dimensional and compatibility confirmation, while new projects may require broader review of pretreatment, recovery, pressure vessel arrangement, and product documentation for consultant approval.",
          "Procurement teams can make the review smoother by separating mandatory requirements from preferences. Required values may include membrane size, pressure vessel compatibility, target permeate quality, and delivery timeline. Preferences may include brand family, energy profile, or documentation format. This distinction helps the supplier respond without hiding important technical limitations.",
        ],
      },
    ],
    internalLinks: [
      { label: "View RO membrane product page", href: "/products/ro-membranes" },
      { label: "Explore all products", href: "/products" },
      { label: "About ICONIC", href: "/about" },
      { label: "Contact technical support", href: "/contact" },
      { label: "Request an RO membrane quote", href: "/request-quote" },
    ],
    cta: {
      title: "Need RO membrane selection support?",
      text: "Send your water analysis, plant capacity, existing membrane details, recovery target, and timeline so ICONIC can help you review suitable RO membrane options.",
    },
  },
  {
    slug: "dosing-pump-selection-for-water-treatment",
    title: "Dosing Pump Selection for Water Treatment and Process Applications",
    metaTitle: "Dosing Pump Selection Guide for Water Treatment",
    metaDescription:
      "A technical dosing pump selection guide covering flow rate, pressure, chemical compatibility, control method, installation, accessories, and procurement inputs.",
    category: "Dosing Pump Guide",
    authorName: "ICONIC Technical Team",
    publishedAt: "2026-07-06",
    readingTime: "9 min read",
    excerpt:
      "A technical guide for choosing dosing pumps for antiscalant, pH correction, disinfection, coagulation, and industrial process water applications.",
    featuredImage: {
      title: "Chemical dosing pump product image",
      alt: "Industrial dosing pump for water treatment chemical dosing applications",
      path: "/blog/dosing-pump-selection-fit.jpg",
      isPlaceholder: false,
    },
    sections: [
      {
        id: "role-of-dosing-pumps",
        title: "Role of Dosing Pumps in Water Treatment",
        paragraphs: [
          "Dosing pumps are used to inject controlled quantities of chemicals into water treatment and process systems. Common applications include antiscalant dosing before RO membranes, pH correction, chlorine dosing, coagulant and flocculant dosing, biocide dosing, and chemical conditioning in wastewater treatment. The purpose is not simply to move chemical from a tank to a pipe. The pump must deliver the right dose at the required pressure with acceptable accuracy and material compatibility.",
          "A dosing pump selection should begin with the chemical, the required dosing rate, and the injection point pressure. Engineers should also confirm whether the application is continuous or intermittent, manual or automatic, proportional or fixed rate, and whether standby dosing is required. These inputs affect pump type, capacity range, stroke adjustment, control signal, accessories, and installation arrangement.",
        ],
      },
      {
        id: "flow-pressure-and-turndown",
        title: "Flow Rate, Pressure, and Turndown",
        paragraphs: [
          "The required dosing flow rate is usually calculated from chemical concentration, process flow, target dose, and solution strength. Oversizing the pump can reduce control accuracy at low stroke settings, while undersizing can prevent the system from reaching the required dose. Procurement teams should ask for the normal dosing rate, maximum dosing rate, and expected adjustment range. This is especially important when process flow changes during the day.",
          "Discharge pressure must include the pressure at the injection point, line losses, elevation differences, and any backpressure requirements. Some dosing systems need a backpressure valve to improve dosing stability. Suction conditions also matter. Chemical tank level, viscosity, flooded suction, suction lift, and priming behavior can affect pump performance. For difficult suction applications, accessories or a different pump configuration may be required.",
        ],
        diagram: {
          title: "Dosing system layout",
          points: ["Chemical tank", "Suction line", "Dosing pump", "Backpressure valve", "Injection quill", "Process line"],
        },
      },
      {
        id: "chemical-compatibility",
        title: "Chemical Compatibility and Wetted Materials",
        paragraphs: [
          "Chemical compatibility is one of the most important parts of dosing pump selection. The wetted materials, diaphragm, seals, valves, tubing, and injection accessories must be suitable for the chemical being dosed. Acids, alkalis, chlorine, antiscalants, coagulants, flocculants, and specialty chemicals can have different compatibility requirements. If the chemical concentration and temperature are not known, the material selection should remain pending until the information is confirmed.",
          "The installation should also consider chemical safety. Venting, bunding, operator access, calibration columns, flushing arrangements, and clear labeling all help reduce handling risk. In industrial sites, dosing pumps are often installed near electrical panels, tanks, and process equipment, so layout and maintenance access should be reviewed before final approval. A technically correct pump can still cause service problems if installed without access for priming, calibration, and maintenance.",
        ],
      },
      {
        id: "control-and-automation",
        title: "Control and Automation Requirements",
        paragraphs: [
          "Dosing pumps may operate manually, through pulse input, 4-20 mA signal, timer control, pH or ORP feedback, flow proportional control, or integration with a plant control system. The control requirement should be stated clearly in the enquiry. A simple fixed-rate application may not need advanced control, while a variable flow process may require proportional dosing. Remote monitoring or alarm outputs may also be required for critical treatment applications.",
          "For RO antiscalant dosing, interlocking the dosing pump with the RO feed pump can prevent chemical overdosing or dry operation. For pH correction, the control loop should be reviewed carefully because sensor placement, mixing time, and response delay can affect stability. For disinfection, the dosing strategy should match residual target, contact time, and regulatory or process expectations. The pump is only one part of the control system.",
        ],
        subsections: [
          {
            title: "Accessories to consider",
            text: "Foot valve, injection valve, calibration column, backpressure valve, pressure relief valve, level switch, tubing, pulsation dampener, and control cable may be required depending on the duty.",
          },
        ],
      },
      {
        id: "quotation-inputs-for-dosing-pumps",
        title: "Quotation Inputs for Dosing Pumps",
        paragraphs: [
          "A good dosing pump enquiry should include chemical name and concentration, required dosing flow, process flow, discharge pressure, suction condition, control method, power supply, tank arrangement, installation location, and required accessories. If the pump is a replacement, share the existing model, pump head material, capacity, pressure rating, and photographs of the installation. This reduces uncertainty and helps the supplier prepare a more relevant offer.",
          "ICONIC FILTRATION AND ENGINEERS LLP supplies dosing pumps and related water treatment products for industrial and commercial applications. The team can help review the application, chemical duty, operating condition, and quotation inputs before suggesting suitable product options. For final approval, model-specific datasheets and confirmed materials should be checked against the actual process requirement.",
          "Procurement teams should also confirm what is included in the offer. A pump alone may not cover tubing, foot valve, injection valve, calibration column, panel integration, level switch, or mounting accessories. Listing these needs early prevents incomplete comparisons and helps the buyer evaluate the full dosing package rather than only the base pump price.",
          "For critical plants, buyers should also mention required standby philosophy and site maintenance practice. A duty-standby arrangement, spare pump head, or recommended service kit may be important where chemical dosing affects membrane protection, disinfection, process stability, or compliance expectations.",
        ],
      },
    ],
    internalLinks: [
      { label: "View dosing pump product page", href: "/products/dosing-pumps" },
      { label: "Explore product range", href: "/products" },
      { label: "About ICONIC", href: "/about" },
      { label: "Contact ICONIC", href: "/contact" },
      { label: "Request dosing pump quotation", href: "/request-quote" },
    ],
    cta: {
      title: "Need help selecting a dosing pump?",
      text: "Share your chemical, dosing rate, pressure, control method, power supply, and installation details so ICONIC can help you review suitable dosing pump options.",
    },
  },
];

export const faqs = [
  {
    question: "What does ICONIC FILTRATION AND ENGINEERS LLP supply?",
    answer:
      "ICONIC focuses on water-treatment components, water-handling equipment, wastewater-treatment equipment, and engineering-led selection support for industrial and commercial requirements.",
  },
  {
    question: "Can ICONIC support OEM manufacturers and dealers?",
    answer:
      "Yes. The product catalog is structured for OEMs, dealers, distributors, water-treatment companies, and project teams that need clear product families and quote-ready information.",
  },
  {
    question: "What information should I share for a technical quote?",
    answer:
      "Share the product category, application, flow or capacity, feed-water condition if available, target output, location, timeline, and whether the requirement is for a new project or replacement.",
  },
  {
    question: "Are certificates and datasheets available online?",
    answer:
      "The website includes dedicated certificate and download sections. Public files can be added after the company approves the final documents for sharing.",
  },
  {
    question: "Does ICONIC serve customers outside Delhi and Noida?",
    answer:
      "Yes. ICONIC serves customers across India and also supports international business requirements for water filtration products and related engineering solutions.",
  },
  {
    question: "Can ICONIC help with product selection?",
    answer:
      "Yes. Share your application, flow or capacity, water condition, location, timeline, and treatment goal so the team can recommend suitable product options.",
  },
];

export const companyStrengths = [
  "Water-filtration product focus",
  "Engineering-led selection support",
  "Catalog built around buyer decisions",
  "Documentation-ready product model",
  "Quote workflow designed for technical clarity",
  "Responsive support for long-term business needs",
];
